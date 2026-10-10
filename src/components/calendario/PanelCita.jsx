import { useState, useEffect, useMemo } from 'react';
import {
  FaX, FaPlus, FaCheck, FaMagnifyingGlass, FaTriangleExclamation, FaUserClock,
} from 'react-icons/fa6';
import api from '../../api';
import SelectorCliente from '../SelectorCliente';
import {
  formatoHora12, etiquetaDuracion, claveDia, hhmmAMinutos,
  NOMBRES_DIA, NOMBRES_MES,
} from '../../utils/tiempo';
import { buscarChoque, PASO_MINUTOS } from './disposicion';

// Opciones de hora para editar a mano: de 7:00 a 22:00 cada 15 minutos
const OPCIONES_HORA = Array.from({ length: ((22 - 7) * 60) / PASO_MINUTOS + 1 }, (_, i) => 7 * 60 + i * PASO_MINUTOS);

const aHHMM = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

function Paso({ numero, titulo, completo, accion, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 transition-colors ${
            completo ? 'bg-dorado text-negro-barber' : 'bg-white border-2 border-gray-200 text-gray-400'
          }`}
        >
          {completo ? <FaCheck /> : numero}
        </span>
        {numero < 3 && <span className="w-0.5 flex-1 bg-gray-200 my-1" />}
      </div>

      <div className="flex-1 min-w-0 pb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{titulo}</h4>
            {accion}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function BotonEditar({ onClick, children = 'Cambiar' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] font-black uppercase tracking-widest text-dorado-hover hover:text-negro-barber"
    >
      {children}
    </button>
  );
}

// Panel lateral para agendar o mover una cita. Se abre al tocar un hueco del
// calendario, con la fecha y la hora ya puestas.
function PanelCita({ modo = 'crear', fechaInicial, cita, servicios, usuarios, horarios, citasSemana, onCerrar, onGuardado }) {
  const moviendo = modo === 'mover';

  const [servicio, setServicio] = useState(() => (moviendo ? cita?.servicio : null));
  const [eligiendoServicio, setEligiendoServicio] = useState(false);
  const [buscarServicio, setBuscarServicio] = useState('');

  const [esInvitado, setEsInvitado] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [nombreInvitado, setNombreInvitado] = useState('');

  const [fecha, setFecha] = useState(() => new Date(fechaInicial));
  const [editandoHora, setEditandoHora] = useState(moviendo);
  const [notas, setNotas] = useState(() => (moviendo ? cita?.notas || '' : ''));

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [saliendo, setSaliendo] = useState(false);

  const cerrar = () => {
    setSaliendo(true);
    setTimeout(onCerrar, 220);
  };

  useEffect(() => {
    const porTecla = (e) => { if (e.key === 'Escape') cerrar(); };
    window.addEventListener('keydown', porTecla);
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', porTecla);
      document.body.style.overflow = previo;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const duracion = servicio?.duracionMinutos || cita?.duracionMinutos || 30;
  const fin = new Date(fecha.getTime() + duracion * 60000);

  const serviciosFiltrados = useMemo(() => {
    const texto = buscarServicio.trim().toLowerCase();
    const activos = (servicios || []).filter((s) => s.activo !== false);
    return texto ? activos.filter((s) => s.nombre.toLowerCase().includes(texto)) : activos;
  }, [servicios, buscarServicio]);

  const choque = useMemo(
    () => buscarChoque(citasSemana || [], fecha, duracion, cita?._id),
    [citasSemana, fecha, duracion, cita]
  );

  // Aviso si la cita cae fuera del horario de ese día
  const fueraDeHorario = useMemo(() => {
    const h = (horarios || []).find((x) => x.diaSemana === fecha.getDay());
    if (!h) return false;
    if (!h.abierto) return 'Ese día la barbería está cerrada.';
    const ini = fecha.getHours() * 60 + fecha.getMinutes();
    if (ini < hhmmAMinutos(h.apertura) || ini + duracion > hhmmAMinutos(h.cierre)) {
      return `Fuera del horario de ese día (${formatoHora12(h.apertura)} – ${formatoHora12(h.cierre)}).`;
    }
    return false;
  }, [horarios, fecha, duracion]);

  const enPasado = fecha < new Date();

  const clienteListo = moviendo || (esInvitado ? nombreInvitado.trim().length > 1 : Boolean(clienteId));
  const listo = Boolean(servicio) && clienteListo && !guardando;

  const cambiarDia = (valor) => {
    if (!valor) return;
    const [a, m, d] = valor.split('-').map(Number);
    const nueva = new Date(fecha);
    nueva.setFullYear(a, m - 1, d);
    setFecha(nueva);
  };

  const cambiarHora = (min) => {
    const nueva = new Date(fecha);
    nueva.setHours(Math.floor(min / 60), min % 60, 0, 0);
    setFecha(nueva);
  };

  const guardar = async () => {
    if (!listo) return;
    setGuardando(true);
    setError('');
    try {
      if (moviendo) {
        await api.put(`/citas/${cita._id}`, { fechaHora: fecha.toISOString(), notas });
        onGuardado('Cita movida');
      } else {
        await api.post('/citas', {
          servicio: servicio._id,
          fechaHora: fecha.toISOString(),
          notas,
          cliente: esInvitado ? null : clienteId,
          nombreInvitado: esInvitado ? nombreInvitado.trim() : null,
        });
        onGuardado('Cita agendada');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar la cita. Intenta de nuevo.');
      setGuardando(false);
    }
  };

  const clienteFijo = moviendo ? (cita?.cliente?.nombre || cita?.nombreInvitado) : null;

  return (
    <div className="fixed inset-0 z-100" role="dialog" aria-modal="true" aria-label={moviendo ? 'Mover cita' : 'Nueva cita'}>
      <div
        className="absolute inset-0 bg-negro-barber/40 transition-opacity duration-200"
        style={{ opacity: saliendo ? 0 : 1 }}
        onClick={cerrar}
      />

      <aside
        className="absolute top-0 right-0 h-full w-full sm:w-[440px] bg-gray-50 shadow-2xl flex flex-col animar-panel"
        style={{
          transform: saliendo ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 220ms ease-in',
        }}
      >
        {/* Encabezado */}
        <header className="bg-negro-barber px-6 py-5 flex items-center justify-between border-b-4 border-dorado shrink-0">
          <div>
            <p className="text-dorado text-[10px] font-black uppercase tracking-[0.3em]">Agenda</p>
            <h2 className="text-white text-xl font-black tracking-tight">
              {moviendo ? 'Mover cita' : 'Nueva cita'}
            </h2>
          </div>
          <button onClick={cerrar} aria-label="Cerrar" className="text-white/60 hover:text-dorado text-xl">
            <FaX />
          </button>
        </header>

        {/* Pasos */}
        <div className="flex-1 overflow-y-auto px-5 pt-6">
          {/* 1 · Servicio */}
          <Paso
            numero={1}
            titulo="Servicio"
            completo={Boolean(servicio)}
            accion={servicio && !moviendo && !eligiendoServicio && (
              <BotonEditar onClick={() => setEligiendoServicio(true)} />
            )}
          >
            {servicio && !eligiendoServicio ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black text-negro-barber truncate">{servicio.nombre}</p>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">{etiquetaDuracion(duracion)}</p>
                </div>
                {servicio.precio != null && (
                  <span className="text-sm font-black text-dorado-hover bg-dorado/15 px-3 py-1.5 rounded-lg shrink-0">
                    ${servicio.precio}
                  </span>
                )}
              </div>
            ) : (
              <div>
                {!eligiendoServicio ? (
                  <button
                    type="button"
                    onClick={() => setEligiendoServicio(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-dorado/50 rounded-xl text-sm font-black text-dorado-hover hover:bg-dorado/10 transition"
                  >
                    <FaPlus /> Elegir servicio
                  </button>
                ) : (
                  <div className="border-2 border-dorado rounded-xl overflow-hidden">
                    <div className="relative border-b border-gray-100">
                      <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" aria-hidden="true" />
                      <input
                        autoFocus
                        value={buscarServicio}
                        onChange={(e) => setBuscarServicio(e.target.value)}
                        placeholder="Buscar servicio..."
                        aria-label="Buscar servicio"
                        className="w-full pl-8 pr-3 py-3 text-sm font-bold focus:outline-none"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {serviciosFiltrados.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-5">Ningún servicio coincide.</p>
                      ) : serviciosFiltrados.map((s) => (
                        <button
                          key={s._id}
                          type="button"
                          onClick={() => { setServicio(s); setEligiendoServicio(false); setBuscarServicio(''); }}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-gray-50 last:border-0 hover:bg-dorado/10 transition ${
                            servicio?._id === s._id ? 'bg-dorado/10' : ''
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-bold text-negro-barber truncate">{s.nombre}</span>
                            <span className="block text-[11px] text-gray-400 font-bold">{etiquetaDuracion(s.duracionMinutos || 30)}</span>
                          </span>
                          <span className="text-sm font-black text-negro-barber shrink-0">${s.precio}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Paso>

          {/* 2 · Cliente */}
          <Paso
            numero={2}
            titulo="Cliente"
            completo={clienteListo}
            accion={!moviendo && (
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esInvitado}
                  onChange={(e) => setEsInvitado(e.target.checked)}
                  className="w-4 h-4 accent-dorado"
                />
                De paso
              </label>
            )}
          >
            {moviendo ? (
              <p className="font-black text-negro-barber">{clienteFijo}</p>
            ) : esInvitado ? (
              <div>
                <label htmlFor="nombre-invitado" className="sr-only">Nombre del cliente</label>
                <div className="relative">
                  <FaUserClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" aria-hidden="true" />
                  <input
                    id="nombre-invitado"
                    value={nombreInvitado}
                    onChange={(e) => setNombreInvitado(e.target.value)}
                    placeholder="Nombre de quien viene"
                    className="w-full pl-11 p-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Para alguien sin cuenta en la página.</p>
              </div>
            ) : (
              <SelectorCliente usuarios={usuarios || []} valor={clienteId} onSeleccionar={setClienteId} />
            )}
          </Paso>

          {/* 3 · Fecha y hora */}
          <Paso
            numero={3}
            titulo="Fecha y hora"
            completo={!choque && !enPasado}
            accion={!editandoHora && <BotonEditar onClick={() => setEditandoHora(true)}>Editar</BotonEditar>}
          >
            {editandoHora ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="cita-dia" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Día</label>
                  <input
                    id="cita-dia"
                    type="date"
                    value={claveDia(fecha)}
                    onChange={(e) => cambiarDia(e.target.value)}
                    className="w-full mt-1 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="cita-hora" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hora</label>
                  <select
                    id="cita-hora"
                    value={fecha.getHours() * 60 + fecha.getMinutes()}
                    onChange={(e) => cambiarHora(Number(e.target.value))}
                    className="w-full mt-1 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold text-sm"
                  >
                    {OPCIONES_HORA.map((min) => (
                      <option key={min} value={min}>{formatoHora12(aHHMM(min))}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            <div className={editandoHora ? 'mt-3' : ''}>
              <p className="font-black text-negro-barber">
                {NOMBRES_DIA[fecha.getDay()]} {fecha.getDate()} de {NOMBRES_MES[fecha.getMonth()].toLowerCase()}
              </p>
              <p className="text-sm font-bold text-gray-500 mt-0.5">
                {formatoHora12(fecha)} – {formatoHora12(fin)}
                <span className="text-gray-300"> · {etiquetaDuracion(duracion)}</span>
              </p>
            </div>

            {choque && (
              <p className="mt-3 flex items-start gap-2 text-xs font-bold text-red-700 bg-red-50 rounded-xl p-3">
                <FaTriangleExclamation className="mt-0.5 shrink-0" aria-hidden="true" />
                Se empalma con {choque.cliente?.nombre || choque.nombreInvitado || 'otra cita'} ({formatoHora12(choque.fechaHora)}).
              </p>
            )}
            {!choque && fueraDeHorario && (
              <p className="mt-3 flex items-start gap-2 text-xs font-bold text-amber-800 bg-amber-50 rounded-xl p-3">
                <FaTriangleExclamation className="mt-0.5 shrink-0" aria-hidden="true" />
                {fueraDeHorario} Puedes agendarla de todos modos.
              </p>
            )}
            {enPasado && (
              <p className="mt-3 flex items-start gap-2 text-xs font-bold text-amber-800 bg-amber-50 rounded-xl p-3">
                <FaTriangleExclamation className="mt-0.5 shrink-0" aria-hidden="true" />
                Esa hora ya pasó.
              </p>
            )}
          </Paso>

          {/* Notas */}
          <div className="pl-[52px] pb-6">
            <label htmlFor="cita-notas" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Notas (opcional)
            </label>
            <textarea
              id="cita-notas"
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. quiere el fade más bajo"
              className="w-full mt-1 p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Pie */}
        <footer className="shrink-0 bg-white border-t border-gray-100 px-5 py-4">
          {error && (
            <p className="mb-3 text-xs font-bold text-red-700 bg-red-50 rounded-xl p-3" role="alert">{error}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={cerrar}
              className="px-5 py-3.5 text-sm font-black text-gray-400 hover:text-negro-barber transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={guardar}
              disabled={!listo}
              className="flex-1 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all bg-negro-barber text-dorado hover:bg-dorado hover:text-negro-barber disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando…' : moviendo ? 'Mover cita' : 'Agendar cita'}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

export default PanelCita;
