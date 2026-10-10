import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  FaChevronLeft, FaChevronRight, FaGift, FaWhatsapp, FaCalendarDay,
  FaTrash, FaX, FaGoogle, FaUser, FaClock, FaScissors,
} from 'react-icons/fa6';
import api from '../../api';
import {
  formatoHora12, horaCorta, claveDia, mismoDia, inicioSemana, sumarDias,
  minutosDelDia, hhmmAMinutos, etiquetaDuracion,
  NOMBRES_DIA, NOMBRES_DIA_CORTO, NOMBRES_MES,
} from '../../utils/tiempo';
import { enlaceWhatsApp, tieneWhatsApp } from '../../utils/whatsapp';
import {
  ALTO_HORA, PIXELES_POR_MINUTO, rangoVisible, distribuirCitas, minutosDesdeY,
} from './disposicion';

// Colores por estado de la cita. El dorado queda para lo que viene, que es lo
// que el barbero necesita ver primero.
const ESTILOS = {
  proxima:    { borde: 'border-t-dorado',       fondo: 'bg-dorado/15',  texto: 'text-negro-barber', etiqueta: 'Próxima' },
  completada: { borde: 'border-t-emerald-500',  fondo: 'bg-emerald-50', texto: 'text-emerald-900',  etiqueta: 'Completada' },
  cancelada:  { borde: 'border-t-red-400',      fondo: 'bg-red-50',     texto: 'text-red-800',      etiqueta: 'Cancelada' },
  externa:    { borde: 'border-t-sky-400',      fondo: 'bg-sky-50',     texto: 'text-sky-900',      etiqueta: 'Reservada en Google' },
};

const tipoDeCita = (c) => {
  if (c.esExterno) return 'externa';
  if (c.estado === 'cancelada') return 'cancelada';
  if (c.estado === 'completada') return 'completada';
  return 'proxima';
};

const nombreDeCita = (c) => c.cliente?.nombre || c.nombreInvitado || 'Sin nombre';

function useEsMovil() {
  const consulta = '(max-width: 1023px)';
  const [movil, setMovil] = useState(() => window.matchMedia(consulta).matches);
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const cambiar = () => setMovil(mq.matches);
    mq.addEventListener('change', cambiar);
    return () => mq.removeEventListener('change', cambiar);
  }, []);
  return movil;
}

// ── Ficha de la cita que se abre al tocarla ────────────────────────────────
function FichaCita({ cita, ancla, esMovil, onCerrar, onReprogramar, onEliminar }) {
  const tipo = tipoDeCita(cita);
  const estilo = ESTILOS[tipo];
  const inicio = new Date(cita.fechaHora);
  const fin = new Date(inicio.getTime() + (cita.duracionMinutos || 30) * 60000);
  const futura = inicio > new Date();
  // Las reservas de Google traen el teléfono que escribió el cliente
  const telefono = cita.cliente?.whatsapp || cita.contacto?.telefono || '';

  useEffect(() => {
    const porTecla = (e) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', porTecla);
    return () => window.removeEventListener('keydown', porTecla);
  }, [onCerrar]);

  // En escritorio la ficha flota junto a la cita; en celular sube desde abajo
  let posicion = {};
  if (!esMovil && ancla) {
    const ANCHO = 320;
    const ALTO_ESTIMADO = 330;
    const cabeDerecha = ancla.right + ANCHO + 16 < window.innerWidth;
    posicion = {
      position: 'fixed',
      left: cabeDerecha ? ancla.right + 10 : Math.max(16, ancla.left - ANCHO - 10),
      top: Math.min(Math.max(16, ancla.top), window.innerHeight - ALTO_ESTIMADO - 16),
      width: ANCHO,
    };
  }

  return (
    <>
      <div className="fixed inset-0 z-90 bg-negro-barber/20 lg:bg-transparent" onClick={onCerrar} />
      <div
        role="dialog"
        aria-label={`Cita de ${nombreDeCita(cita)}`}
        className={`z-100 bg-white shadow-2xl border border-gray-100 overflow-hidden ${
          esMovil ? 'fixed left-0 right-0 bottom-0 rounded-t-3xl animar-subir' : 'rounded-2xl animar-aparecer'
        }`}
        style={posicion}
      >
        <div className={`h-1.5 ${estilo.fondo} border-t-4 ${estilo.borde}`} />

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-dorado/20 flex items-center justify-center text-dorado font-black shrink-0">
              {cita.esExterno ? <FaGoogle /> : nombreDeCita(cita).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-negro-barber truncate flex items-center gap-2">
                {nombreDeCita(cita)}
                {cita.esPremio && <FaGift className="text-dorado text-sm shrink-0" title="Cita con premio" />}
              </p>
              <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${estilo.fondo} ${estilo.texto}`}>
                {estilo.etiqueta}
              </span>
            </div>
            <button onClick={onCerrar} aria-label="Cerrar" className="text-gray-300 hover:text-negro-barber p-1">
              <FaX />
            </button>
          </div>

          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <FaScissors className="text-dorado shrink-0" aria-hidden="true" />
              <dd className="font-bold text-negro-barber">
                {cita.servicio?.nombre || 'Servicio'}
                {cita.servicio?.precio != null && (
                  <span className="text-gray-400 font-medium"> · ${cita.esPremio ? Math.round(cita.servicio.precio / 2) : cita.servicio.precio}</span>
                )}
              </dd>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FaClock className="text-dorado shrink-0" aria-hidden="true" />
              <dd>
                <span className="font-bold text-negro-barber">
                  {NOMBRES_DIA[inicio.getDay()]} {inicio.getDate()} de {NOMBRES_MES[inicio.getMonth()].toLowerCase()}
                </span>
                <br />
                {formatoHora12(inicio)} – {formatoHora12(fin)}
                <span className="text-gray-400"> · {etiquetaDuracion(cita.duracionMinutos)}</span>
              </dd>
            </div>
            {telefono && (
              <div className="flex items-center gap-3 text-gray-600">
                <FaUser className="text-dorado shrink-0" aria-hidden="true" />
                <dd>{telefono}</dd>
              </div>
            )}
          </dl>

          {cita.notas && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 line-clamp-3 whitespace-pre-line">{cita.notas}</p>
          )}

          <div className="mt-5 grid gap-2">
            {tieneWhatsApp(telefono) && (
              <a
                href={enlaceWhatsApp(telefono)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            )}
            {cita.esExterno ? (
              <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest py-2">
                Se modifica desde Google Calendar
              </p>
            ) : futura && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onReprogramar(cita)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-negro-barber rounded-xl font-bold text-sm hover:bg-dorado/30 transition"
                >
                  <FaCalendarDay /> Mover
                </button>
                <button
                  onClick={() => onEliminar(cita)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition"
                >
                  <FaTrash /> Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Calendario ─────────────────────────────────────────────────────────────
function CalendarioAgenda({ horarios, version = 0, onNuevaCita, onReprogramar, onEliminar }) {
  const esMovil = useEsMovil();
  const [fechaBase, setFechaBase] = useState(() => new Date());
  // Cada respuesta guarda a qué consulta pertenece: así "cargando" se deduce
  // en vez de encenderse y apagarse a mano dentro del efecto
  const [datos, setDatos] = useState({ clave: null, citas: [], error: null });
  const [ficha, setFicha] = useState(null);
  const [fantasma, setFantasma] = useState(null);
  const [ahora, setAhora] = useState(() => new Date());

  const contenedor = useRef(null);
  const yaDesplazado = useRef(false);
  const toqueInicio = useRef(null);

  const lunes = useMemo(() => inicioSemana(fechaBase), [fechaBase]);
  const semana = useMemo(() => Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i)), [lunes]);
  // En celular se ve un día; en escritorio, la semana completa
  const dias = esMovil ? [fechaBase] : semana;
  const claveSemana = claveDia(lunes);
  const claveConsulta = `${claveSemana}#${version}`;

  // Siempre se pide la semana completa: cambiar de día dentro de ella en el
  // celular no vuelve a consultar
  useEffect(() => {
    let vigente = true;
    const desde = claveSemana;
    const hasta = claveDia(sumarDias(new Date(`${claveSemana}T12:00:00`), 6));
    api.get('/citas/rango', { params: { desde, hasta } })
      .then((res) => {
        if (vigente) setDatos({ clave: claveConsulta, citas: res.data.citas || [], error: null });
      })
      .catch((err) => {
        if (vigente) {
          setDatos({
            clave: claveConsulta,
            citas: [],
            error: err.response?.data?.mensaje || 'No se pudo cargar la agenda',
          });
        }
      });
    return () => { vigente = false; };
  }, [claveSemana, claveConsulta]);

  // Mientras llega la semana nueva se siguen viendo las citas anteriores bajo
  // el indicador de carga, sin que la rejilla parpadee en blanco
  const cargando = datos.clave !== claveConsulta;
  const citas = datos.citas;
  const error = cargando ? null : datos.error;

  // La línea de "ahora" avanza sola
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const horarioPorDia = useMemo(() => {
    const mapa = {};
    (horarios || []).forEach((h) => { mapa[h.diaSemana] = h; });
    return mapa;
  }, [horarios]);

  const citasPorDia = useMemo(() => {
    const mapa = {};
    citas.forEach((c) => {
      const k = claveDia(c.fechaHora);
      (mapa[k] = mapa[k] || []).push(c);
    });
    return mapa;
  }, [citas]);

  // En escritorio todas las columnas comparten escala, así que la rejilla
  // abarca la semana entera. En celular basta con el día que se ve: un día
  // que abre tarde no debe obligar a recorrer horas vacías de otro.
  const { horaInicio, horaFin } = useMemo(() => {
    if (!esMovil) return rangoVisible(horarios, citas);
    const delDia = horarioPorDia[fechaBase.getDay()];
    return rangoVisible(delDia ? [delDia] : [], citasPorDia[claveDia(fechaBase)] || []);
  }, [esMovil, horarios, citas, horarioPorDia, citasPorDia, fechaBase]);
  const horas = Array.from({ length: horaFin - horaInicio }, (_, i) => horaInicio + i);
  const altoTotal = (horaFin - horaInicio) * ALTO_HORA;

  // Al abrir, la rejilla se coloca una hora antes de la actual, en punto y con
  // aire para que la etiqueta de la hora no quede bajo los encabezados.
  // En celular la rejilla no tiene scroll propio: se desplaza la página.
  useEffect(() => {
    if (esMovil || cargando || yaDesplazado.current || !contenedor.current) return;
    const minutos = Math.max(minutosDelDia(new Date()) - horaInicio * 60 - 60, 0);
    contenedor.current.scrollTop = Math.max(Math.floor(minutos / 60) * ALTO_HORA - 12, 0);
    yaDesplazado.current = true;
  }, [esMovil, cargando, horaInicio]);

  const mover = (pasos) => setFechaBase((f) => sumarDias(f, pasos * (esMovil ? 1 : 7)));
  const irAHoy = () => setFechaBase(new Date());

  // En celular se cambia de día deslizando de lado
  const alTocar = (e) => { toqueInicio.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const alSoltar = (e) => {
    if (!toqueInicio.current) return;
    const dx = e.changedTouches[0].clientX - toqueInicio.current.x;
    const dy = e.changedTouches[0].clientY - toqueInicio.current.y;
    toqueInicio.current = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) mover(dx < 0 ? 1 : -1);
  };

  const fechaEnMinuto = (dia, min) => {
    const f = new Date(dia);
    f.setHours(0, 0, 0, 0);
    f.setMinutes(min);
    return f;
  };

  const alClicHueco = (e, dia) => {
    const caja = e.currentTarget.getBoundingClientRect();
    const min = minutosDesdeY(e.clientY - caja.top, horaInicio);
    const fecha = fechaEnMinuto(dia, min);
    // No se agenda en el pasado desde la rejilla, para evitar toques accidentales
    if (fecha < new Date()) return;
    onNuevaCita?.(fecha, citas);
  };

  const alMoverEnHueco = (e, dia) => {
    if (esMovil) return;
    const caja = e.currentTarget.getBoundingClientRect();
    const min = minutosDesdeY(e.clientY - caja.top, horaInicio);
    if (fechaEnMinuto(dia, min) < new Date()) return setFantasma(null);
    setFantasma({ clave: claveDia(dia), min });
  };

  const titulo = esMovil
    ? `${NOMBRES_MES[fechaBase.getMonth()]} ${fechaBase.getFullYear()}`
    : (() => {
        const fin = sumarDias(lunes, 6);
        const mesIni = NOMBRES_MES[lunes.getMonth()];
        return lunes.getMonth() === fin.getMonth()
          ? `${mesIni} ${lunes.getFullYear()}`
          : `${mesIni.slice(0, 3)} – ${NOMBRES_MES[fin.getMonth()].slice(0, 3)} ${fin.getFullYear()}`;
      })();

  const subtitulo = esMovil
    ? `${NOMBRES_DIA[fechaBase.getDay()]} ${fechaBase.getDate()}`
    : `${lunes.getDate()} – ${sumarDias(lunes, 6).getDate()} de ${NOMBRES_MES[sumarDias(lunes, 6).getMonth()].toLowerCase()}`;

  const cerrarFicha = useCallback(() => setFicha(null), []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ── Barra superior ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-negro-barber uppercase tracking-tighter leading-none">
            {titulo}
          </h3>
          <p className="text-xs font-bold text-gray-400 mt-1">{subtitulo}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={irAHoy}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-gray-200 text-negro-barber hover:border-dorado transition"
          >
            Hoy
          </button>
          <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
            <button onClick={() => mover(-1)} aria-label={esMovil ? 'Día anterior' : 'Semana anterior'} className="p-2.5 hover:bg-gray-50 text-negro-barber">
              <FaChevronLeft />
            </button>
            <button onClick={() => mover(1)} aria-label={esMovil ? 'Día siguiente' : 'Semana siguiente'} className="p-2.5 hover:bg-gray-50 text-negro-barber border-l-2 border-gray-200">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tira de la semana (sólo celular) ── */}
      {esMovil && (
        <div className="grid grid-cols-7 gap-1 px-2 py-2 border-b border-gray-100 bg-gray-50/60">
          {semana.map((d) => {
            const activo = mismoDia(d, fechaBase);
            const hoy = mismoDia(d, ahora);
            const total = (citasPorDia[claveDia(d)] || []).filter((c) => c.estado !== 'cancelada').length;
            return (
              <button
                key={claveDia(d)}
                onClick={() => setFechaBase(d)}
                aria-label={`${NOMBRES_DIA[d.getDay()]} ${d.getDate()}, ${total} citas`}
                aria-pressed={activo}
                className={`flex flex-col items-center py-1.5 rounded-xl transition ${
                  activo ? 'bg-negro-barber text-white' : 'text-gray-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{NOMBRES_DIA_CORTO[d.getDay()]}</span>
                <span className={`text-base font-black ${hoy && !activo ? 'text-dorado' : ''}`}>{d.getDate()}</span>
                <span className={`h-1.5 w-1.5 rounded-full mt-0.5 ${total ? (activo ? 'bg-dorado' : 'bg-dorado/70') : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
      )}

      {esMovil && horarioPorDia[fechaBase.getDay()]?.abierto === false && (
        <p className="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest text-center border-b border-red-100">
          La barbería no abre este día
        </p>
      )}

      {/* ── Rejilla ── */}
      <div className="relative">
        {cargando && (
          <div className="absolute inset-0 z-30 bg-white/60 flex items-start justify-center pt-24">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-dorado rounded-full animate-spin" role="status" aria-label="Cargando agenda" />
          </div>
        )}
        {error && !cargando && (
          <p className="absolute inset-x-0 top-10 z-30 text-center text-red-500 font-bold text-sm">{error}</p>
        )}

        <div
          ref={contenedor}
          // En escritorio la rejilla tiene su propio scroll con encabezados
          // fijos; en celular un scroll dentro de otro se siente atrapado,
          // así que la rejilla mide lo que mide y se desplaza la página
          className={esMovil ? '' : 'overflow-auto'}
          style={esMovil ? undefined : { maxHeight: 'max(440px, calc(100vh - 300px))' }}
          onTouchStart={esMovil ? alTocar : undefined}
          onTouchEnd={esMovil ? alSoltar : undefined}
        >
          <div
            className="grid min-w-full"
            style={{
              gridTemplateColumns: `56px repeat(${dias.length}, minmax(${esMovil ? '0' : '118px'}, 1fr))`,
              width: esMovil ? '100%' : 'max-content',
              minWidth: '100%',
            }}
          >
            {/* Encabezados de día, fijos arriba. En celular sobran: la tira de
                la semana ya dice qué día se está viendo */}
            {!esMovil && <div className="sticky top-0 left-0 z-20 bg-white border-b border-gray-100" />}
            {!esMovil && dias.map((d) => {
              const hoy = mismoDia(d, ahora);
              const h = horarioPorDia[d.getDay()];
              return (
                <div key={`cab-${claveDia(d)}`} className="sticky top-0 z-10 bg-white border-b border-l border-gray-100 px-2 py-3 text-center">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${hoy ? 'text-dorado' : 'text-gray-400'}`}>
                    {NOMBRES_DIA_CORTO[d.getDay()]}
                  </p>
                  <p className={`mt-0.5 text-lg font-black leading-none inline-flex items-center justify-center w-9 h-9 rounded-full ${
                    hoy ? 'bg-dorado text-negro-barber' : 'text-negro-barber'
                  }`}>
                    {d.getDate()}
                  </p>
                  {h && !h.abierto && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mt-1">Cerrado</p>
                  )}
                </div>
              );
            })}

            {/* Columna de horas */}
            <div className="sticky left-0 z-10 bg-white" style={{ height: altoTotal }}>
              {horas.map((h) => (
                <div key={h} className="relative border-gray-100" style={{ height: ALTO_HORA }}>
                  <span className="absolute -top-2 right-2 text-[10px] font-bold text-gray-400 whitespace-nowrap">
                    {h === horaInicio ? '' : horaCorta(h)}
                  </span>
                </div>
              ))}
            </div>

            {/* Columnas de día */}
            {dias.map((d) => {
              const k = claveDia(d);
              const h = horarioPorDia[d.getDay()];
              const cerrado = h && !h.abierto;
              const apertura = h ? hhmmAMinutos(h.apertura) : horaInicio * 60;
              const cierre = h ? hhmmAMinutos(h.cierre) : horaFin * 60;
              const antesDeAbrir = Math.max(0, (apertura - horaInicio * 60) * PIXELES_POR_MINUTO);
              const despuesDeCerrar = Math.max(0, (horaFin * 60 - cierre) * PIXELES_POR_MINUTO);
              const colocadas = distribuirCitas(citasPorDia[k] || []);
              const esHoy = mismoDia(d, ahora);
              const lineaAhora = (minutosDelDia(ahora) - horaInicio * 60) * PIXELES_POR_MINUTO;

              return (
                <div
                  key={k}
                  data-dia={k}
                  className="relative border-l border-gray-100 cursor-pointer"
                  style={{ height: altoTotal }}
                  onClick={(e) => alClicHueco(e, d)}
                  onMouseMove={(e) => alMoverEnHueco(e, d)}
                  onMouseLeave={() => setFantasma(null)}
                >
                  {/* Líneas de hora y media hora */}
                  {horas.map((hr, i) => (
                    <div key={hr} className="pointer-events-none absolute inset-x-0 border-t border-gray-100" style={{ top: i * ALTO_HORA }}>
                      <div className="border-t border-dashed border-gray-50" style={{ marginTop: ALTO_HORA / 2 - 1 }} />
                    </div>
                  ))}

                  {/* Horas en que la barbería está cerrada */}
                  {cerrado ? (
                    <div className="pointer-events-none absolute inset-0 bg-rayado" />
                  ) : (
                    <>
                      {antesDeAbrir > 0 && <div className="pointer-events-none absolute inset-x-0 top-0 bg-rayado" style={{ height: antesDeAbrir }} />}
                      {despuesDeCerrar > 0 && <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-rayado" style={{ height: despuesDeCerrar }} />}
                    </>
                  )}

                  {/* Vista previa al pasar el ratón por un hueco libre */}
                  {fantasma?.clave === k && (
                    <div
                      className="pointer-events-none absolute left-1 right-1 rounded-lg border-2 border-dashed border-dorado bg-dorado/10 flex items-start px-2 pt-1"
                      style={{ top: (fantasma.min - horaInicio * 60) * PIXELES_POR_MINUTO, height: 30 * PIXELES_POR_MINUTO - 2 }}
                    >
                      <span className="text-[10px] font-black text-dorado-hover">+ {formatoHora12(`${Math.floor(fantasma.min / 60)}:${fantasma.min % 60}`)}</span>
                    </div>
                  )}

                  {/* Citas */}
                  {colocadas.map(({ cita, ini, fin, carril, totalCarriles }) => {
                    const estilo = ESTILOS[tipoDeCita(cita)];
                    const alto = Math.max((fin - ini) * PIXELES_POR_MINUTO - 3, 20);
                    const ancho = 100 / totalCarriles;
                    const compacta = alto < 44;
                    return (
                      <button
                        key={cita._id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFantasma(null);
                          setFicha({ cita, ancla: e.currentTarget.getBoundingClientRect() });
                        }}
                        onMouseMove={(e) => e.stopPropagation()}
                        className={`absolute rounded-lg border-t-4 ${estilo.borde} ${estilo.fondo} text-left px-2 py-1 overflow-hidden shadow-sm hover:shadow-md hover:z-10 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-dorado`}
                        style={{
                          top: (ini - horaInicio * 60) * PIXELES_POR_MINUTO + 1,
                          height: alto,
                          left: `calc(${carril * ancho}% + 3px)`,
                          width: `calc(${ancho}% - 6px)`,
                        }}
                        aria-label={`${nombreDeCita(cita)}, ${cita.servicio?.nombre || ''}, ${formatoHora12(cita.fechaHora)}`}
                      >
                        <p className={`text-[11px] font-black leading-tight truncate ${estilo.texto} ${cita.estado === 'cancelada' ? 'line-through' : ''}`}>
                          {cita.esPremio && <FaGift className="inline text-dorado mr-1 -mt-0.5" aria-hidden="true" />}
                          {nombreDeCita(cita)}
                          {compacta && <span className="font-medium opacity-70"> · {formatoHora12(cita.fechaHora)}</span>}
                        </p>
                        {!compacta && (
                          <>
                            <p className="text-[10px] font-medium text-gray-500 truncate">{cita.servicio?.nombre}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5 truncate">
                              {formatoHora12(cita.fechaHora)} – {formatoHora12(new Date(new Date(cita.fechaHora).getTime() + (cita.duracionMinutos || 30) * 60000))}
                            </p>
                          </>
                        )}
                      </button>
                    );
                  })}

                  {/* Hora actual */}
                  {esHoy && lineaAhora >= 0 && lineaAhora <= altoTotal && (
                    <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: lineaAhora }}>
                      <span className="w-2.5 h-2.5 -ml-1.5 rounded-full bg-red-500" />
                      <span className="flex-1 h-0.5 bg-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Leyenda ── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 md:px-6 py-3 border-t border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {Object.entries(ESTILOS).map(([clave, e]) => (
          <span key={clave} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm border-t-4 ${e.borde} ${e.fondo}`} />
            {e.etiqueta}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rayado border border-gray-200" />
          Cerrado
        </span>
        {!esMovil && <span className="ml-auto normal-case tracking-normal font-medium">Toca un hueco libre para agendar</span>}
      </div>

      {ficha && (
        <FichaCita
          cita={ficha.cita}
          ancla={ficha.ancla}
          esMovil={esMovil}
          onCerrar={cerrarFicha}
          onReprogramar={(c) => { cerrarFicha(); onReprogramar?.(c, citas); }}
          onEliminar={(c) => { cerrarFicha(); onEliminar?.(c); }}
        />
      )}
    </div>
  );
}

export default CalendarioAgenda;
