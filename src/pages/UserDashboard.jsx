import { useState, useEffect } from 'react';
import api from '../api';
import {
  FaScissors, FaCalendarDay, FaClock, FaX, FaTrash, FaPen,
  FaArrowLeft, FaStar, FaGift, FaCheck, FaLock,
  FaFire, FaTrophy, FaCoins
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const META_VISITAS = 5;

const NIVELES = {
  nuevo:     { label: 'Nuevo',     color: 'bg-gray-200 text-gray-600' },
  regular:   { label: 'Regular',   color: 'bg-blue-100 text-blue-700' },
  frecuente: { label: 'Frecuente', color: 'bg-amber-100 text-amber-700' },
  vip:       { label: 'VIP',       color: 'bg-dorado text-negro-barber' },
};

function UserDashboard() {
  const [citas, setCitas] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaAEditar, setCitaAEditar] = useState(null);
  const [form, setForm] = useState({ fechaHora: '', notas: '' });

  const [modalPasswordAbierto, setModalPasswordAbierto] = useState(false);
  const [formPassword, setFormPassword] = useState({ actual: '', nueva: '' });

  const cargarPerfil = async () => {
    try {
      const res = await api.get('/auth/perfil');
      setPerfil(res.data);
    } catch (err) {
      console.error('Error al cargar perfil');
    }
  };

  const cargarCitas = async () => {
    try {
      const res = await api.get('/citas/mis-citas');
      setCitas(res.data.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)));
    } catch (err) {
      console.error('Error al cargar citas');
    }
  };

  useEffect(() => {
    Promise.all([cargarPerfil(), cargarCitas()]).finally(() => setCargando(false));
  }, []);

  const ahora = new Date();
  const citasProximas = citas.filter(c => new Date(c.fechaHora) > ahora);
  const citasPasadas  = citas.filter(c => new Date(c.fechaHora) <= ahora);

  // Datos de fidelidad desde la BD (no desde conteo local)
  const contadorVisitas = perfil?.contadorVisitas ?? 0;
  const premioPendiente = perfil?.premioPendiente ?? false;
  const totalVisitas    = perfil?.totalVisitas ?? 0;
  const totalGastado    = perfil?.totalGastado ?? 0;
  const ultimaVisita    = perfil?.ultimaVisita ? new Date(perfil.ultimaVisita) : null;
  const nivel           = perfil?.nivel ?? 'nuevo';
  const cortesParaPremio = META_VISITAS - contadorVisitas;

  const esEditable = (fechaHoraCita) => {
    const diferencia = (new Date(fechaHoraCita) - ahora) / (1000 * 60 * 60);
    return diferencia > 4;
  };

  const abrirModalReprogramar = (cita) => {
    const date = new Date(cita.fechaHora);
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setCitaAEditar(cita);
    setForm({ fechaHora: localISO, notas: cita.notas || '' });
    setModalAbierto(true);
  };

  const confirmarCambio = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/citas/${citaAEditar._id}`, {
        fechaHora: new Date(form.fechaHora).toISOString(),
        notas: form.notas
      });
      alert('¡Cita reprogramada con éxito!');
      setModalAbierto(false);
      cargarCitas();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al reprogramar');
    }
  };

  const cancelarCita = async (id) => {
    if (!window.confirm('¿Seguro que quieres cancelar tu cita?')) return;
    try {
      await api.delete(`/citas/${id}`);
      cargarCitas();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al cancelar');
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/cambiar-password', {
        contrasenaActual: formPassword.actual,
        nuevaContrasena: formPassword.nueva
      });
      alert(res.data.mensaje);
      setModalPasswordAbierto(false);
      setFormPassword({ actual: '', nueva: '' });
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al cambiar la contraseña');
    }
  };

  const manejarCanjearPremio = () => {
    // El flag de localStorage es solo para la UI de Reservar.
    // La validación real ocurre en el backend al crear la cita.
    localStorage.setItem('canjearPremio', 'true');
  };

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-black text-dorado animate-pulse">
      CARGANDO TU PERFIL...
    </div>
  );

  const nivelInfo = NIVELES[nivel] || NIVELES.nuevo;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── HEADER ── */}
        <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-black text-negro-barber uppercase tracking-tighter">
              Mi <span className="text-dorado">Perfil</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tus beneficios y agenda</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setModalPasswordAbierto(true)}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase bg-white px-4 py-2.5 rounded-lg text-gray-500 shadow-sm border border-gray-200 hover:text-dorado hover:border-dorado transition-all w-full sm:w-auto justify-center"
            >
              <FaLock /> Seguridad
            </button>
            <Link to="/" className="text-gray-400 hover:text-negro-barber transition font-black text-[10px] flex items-center gap-2 border-b border-transparent hover:border-negro-barber">
              <FaArrowLeft /> VOLVER AL INICIO
            </Link>
          </div>
        </header>

        {/* ── TARJETA DE LEALTAD ── */}
        <section className="bg-negro-barber p-6 md:p-8 rounded-3xl shadow-xl border border-dorado/20 relative overflow-hidden">
          <FaStar className="absolute -right-10 -top-10 text-9xl text-dorado/5" />

          <div className="relative z-10">
            {/* Encabezado con nombre y nivel */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-dorado text-xs font-black tracking-[0.2em] uppercase mb-1">
                  The Barber Studio 1225
                </h2>
                <h3 className="text-white text-xl md:text-2xl font-bold">
                  {premioPendiente
                    ? '¡Tu premio está listo!'
                    : `${cortesParaPremio} ${cortesParaPremio === 1 ? 'visita' : 'visitas'} para tu próximo premio`
                  }
                </h3>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${nivelInfo.color}`}>
                {nivelInfo.label}
              </span>
            </div>

            {/* Sellos de progreso */}
            <div className="flex gap-2 sm:gap-3 mb-6">
              {Array.from({ length: META_VISITAS }).map((_, i) => {
                const numero = i + 1;
                const completado = numero <= contadorVisitas;
                const esPremio = numero === META_VISITAS;
                return (
                  <div
                    key={numero}
                    className={`flex-1 h-10 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-xl font-bold transition-all
                      ${completado || premioPendiente
                        ? 'bg-dorado text-negro-barber shadow-lg shadow-dorado/40 scale-105'
                        : 'bg-gray-800 text-gray-600 border border-gray-700'
                      }
                      ${esPremio && !completado && !premioPendiente ? 'border-dorado text-dorado' : ''}
                    `}
                  >
                    {esPremio
                      ? <FaGift />
                      : completado
                        ? <FaCheck />
                        : numero
                    }
                  </div>
                );
              })}
            </div>

            {/* Botón de canje */}
            {premioPendiente && (
              <Link
                to="/"
                onClick={manejarCanjearPremio}
                className="inline-flex items-center justify-center gap-2 bg-dorado text-negro-barber px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-dorado/20 w-full sm:w-auto mb-4"
              >
                <FaGift className="text-lg" /> Agendar con 50% OFF
              </Link>
            )}

            {/* Stats del cliente */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-dorado text-lg md:text-2xl font-black">{totalVisitas}</p>
                <p className="text-gray-500 text-[9px] uppercase tracking-widest">Visitas totales</p>
              </div>
              <div className="text-center border-l border-white/10">
                <p className="text-dorado text-xs md:text-sm font-black">
                  {ultimaVisita
                    ? ultimaVisita.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
                    : '—'
                  }
                </p>
                <p className="text-gray-500 text-[9px] uppercase tracking-widest">Última visita</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRÓXIMAS CITAS ── */}
        <section>
          <h2 className="text-xl font-black text-negro-barber uppercase tracking-tighter mb-6 flex items-center gap-3">
            <FaCalendarDay className="text-dorado" /> Próximas Citas
          </h2>

          {citasProximas.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center shadow-sm border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold mb-6">No tienes turnos agendados.</p>
              <Link to="/" className="inline-block bg-negro-barber text-dorado px-6 py-4 text-xs rounded-xl font-black uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-lg">
                Agendar Servicio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {citasProximas.map(cita => {
                const editable = esEditable(cita.fechaHora);
                return (
                  <div key={cita._id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-dorado">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-dorado/10 text-dorado px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        {new Date(cita.fechaHora).toLocaleDateString()} — {new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!editable && <span className="text-[10px] font-black text-red-500 uppercase">Bloqueada</span>}
                    </div>

                    <h3 className="text-xl font-black text-negro-barber mb-1 uppercase italic">{cita.servicio?.nombre}</h3>
                    <p className="text-gray-400 text-sm font-bold mb-4">
                      ${cita.servicio?.precio} MXN
                      {cita.esPremio && <span className="ml-2 text-dorado text-[10px] font-black uppercase">🎁 Premio</span>}
                    </p>

                    {cita.notas && (
                      <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Indicaciones:</p>
                        <p className="text-[11px] text-gray-600 italic">"{cita.notas}"</p>
                      </div>
                    )}

                    {editable && (
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => abrirModalReprogramar(cita)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-negro-barber text-white rounded-xl text-[10px] font-black uppercase hover:bg-dorado hover:text-negro-barber transition-all">
                          <FaPen /> Reprogramar
                        </button>
                        <button onClick={() => cancelarCita(cita._id)} className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── HISTORIAL ── */}
        {citasPasadas.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <FaClock /> Historial de Cortes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-80 hover:opacity-100 transition-opacity">
              {citasPasadas.map(cita => (
                <div key={cita._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-400 text-[10px] font-black uppercase">
                        {new Date(cita.fechaHora).toLocaleDateString()}
                      </span>
                      {cita.estado === 'completada' && (
                        <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Completada</span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-gray-700 uppercase italic">{cita.servicio?.nombre}</h3>
                    {cita.esPremio && <p className="text-[10px] text-dorado font-black mt-1">🎁 Canje de premio</p>}
                    {cita.notas && <p className="text-[10px] text-gray-500 italic mt-2 border-l-2 border-gray-200 pl-2">"{cita.notas}"</p>}
                  </div>

                  <Link
                    to={`/reservar/${cita.servicio?._id}`}
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all"
                  >
                    <FaScissors /> Repetir corte
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── MODAL REPROGRAMAR ── */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-negro-barber/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setModalAbierto(false)} className="absolute top-6 right-6 text-gray-400 hover:text-negro-barber text-xl"><FaX /></button>
              <h2 className="text-2xl font-black text-negro-barber mb-6 tracking-tighter uppercase italic">Reprogramar</h2>
              <form onSubmit={confirmarCambio} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nuevo Horario</label>
                  <input type="datetime-local" required value={form.fechaHora} onChange={(e) => setForm({ ...form, fechaHora: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Notas Actualizadas</label>
                  <textarea rows="2" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-medium" />
                </div>
                <button type="submit" className="w-full bg-negro-barber text-dorado py-4 rounded-xl font-black uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-xl mt-4">
                  Confirmar Cambio
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL CONTRASEÑA ── */}
        {modalPasswordAbierto && (
          <div className="fixed inset-0 bg-negro-barber/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setModalPasswordAbierto(false)} className="absolute top-6 right-6 text-gray-400 hover:text-negro-barber text-xl"><FaX /></button>
              <h2 className="text-2xl font-black text-negro-barber mb-2 tracking-tighter uppercase italic">Seguridad</h2>
              <p className="text-gray-400 text-xs font-bold mb-6">Actualiza tu contraseña de acceso</p>
              <form onSubmit={cambiarPassword} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contraseña Actual</label>
                  <input type="password" required value={formPassword.actual} onChange={(e) => setFormPassword({ ...formPassword, actual: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nueva Contraseña</label>
                  <input type="password" required minLength="6" value={formPassword.nueva} onChange={(e) => setFormPassword({ ...formPassword, nueva: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold" placeholder="Mínimo 6 caracteres" />
                </div>
                <button type="submit" className="w-full bg-negro-barber text-dorado py-4 rounded-xl font-black uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-xl mt-4">
                  Guardar Contraseña
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UserDashboard;
