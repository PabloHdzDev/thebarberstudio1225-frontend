// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../api';
import { FaScissors, FaCalendarDay, FaClock, FaX, FaTrash, FaPen, FaArrowLeft, FaWhatsapp, FaStar, FaGift, FaCheck } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function UserDashboard() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaAEditar, setCitaAEditar] = useState(null);
  const [form, setForm] = useState({ fechaHora: '', notas: '' });

  const cargarCitas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/citas/mis-citas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ordenamos del más reciente al más antiguo
      const citasOrdenadas = res.data.sort((a, b) => {
        return new Date(b.fechaHora) - new Date(a.fechaHora);
      });
      
      setCitas(citasOrdenadas);
    } catch (err) {
      console.error("Error al cargar citas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarCitas(); }, []);

  // --- LÓGICA DE SEPARACIÓN Y LEALTAD ---
  const ahora = new Date();
  
  // Separamos las citas
  const citasProximas = citas.filter(cita => new Date(cita.fechaHora) > ahora);
  // Asumimos que las que ya pasaron son cortes completados
  const citasPasadas = citas.filter(cita => new Date(cita.fechaHora) <= ahora); 
  
  const totalCortes = citasPasadas.length;
  // Ciclos de 5 cortes (0 a 4). Si tiene 4, el progreso es 4.
  const progresoActual = totalCortes % 5; 
  const cortesParaPremio = 5 - progresoActual;

  const esEditable = (fechaHoraCita) => {
    const fechaCita = new Date(fechaHoraCita);
    const diferenciaHoras = (fechaCita - ahora) / (1000 * 60 * 60);
    return diferenciaHoras > 4;
  };

  // ... (abrirModalReprogramar, confirmarCambio, cancelarCita se quedan exactamente igual)
  const abrirModalReprogramar = (cita) => {
    const date = new Date(cita.fechaHora);
    const offset = date.getTimezoneOffset() * 60000;
    const localISO = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    setCitaAEditar(cita);
    setForm({ fechaHora: localISO, notas: cita.notas || '' });
    setModalAbierto(true);
  };

  const confirmarCambio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put(`/citas/${citaAEditar._id}`, {
        fechaHora: new Date(form.fechaHora).toISOString(),
        notas: form.notas
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("¡Cita reprogramada con éxito!");
      setModalAbierto(false);
      cargarCitas();
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al reprogramar");
    }
  };

  const cancelarCita = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar tu cita?")) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/citas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      cargarCitas();
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al cancelar");
    }
  };

  if (cargando) return <div className="min-h-screen flex items-center justify-center bg-gray-100 font-black text-dorado animate-pulse">CARGANDO TU PERFIL...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-negro-barber uppercase tracking-tighter">Mi <span className="text-dorado">Perfil</span></h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tus beneficios y agenda</p>
          </div>
          <Link to="/" className="text-gray-400 hover:text-negro-barber transition font-black text-[10px] flex items-center gap-2 border-b border-transparent hover:border-negro-barber">
            <FaArrowLeft /> VOLVER AL INICIO
          </Link>
        </header>

        {/* --- SECCIÓN 1: TARJETA DE LEALTAD --- */}
        <section className="bg-negro-barber p-8 rounded-3xl shadow-xl border border-dorado/20 relative overflow-hidden">
          {/* Fondo decorativo */}
          <FaStar className="absolute -right-10 -top-10 text-9xl text-dorado/5" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-dorado text-xs font-black tracking-[0.2em] uppercase mb-2">The Barber Studio 1225</h2>
              <h3 className="text-white text-2xl font-bold mb-1">
                {cortesParaPremio === 1 ? '¡Tu próximo corte es a MITAD DE PRECIO!' : `Faltan ${cortesParaPremio} cortes para tu premio`}
              </h3>
              <p className="text-gray-400 text-sm">
                Has completado {totalCortes} {totalCortes === 1 ? 'corte' : 'cortes'} históricos.
              </p>
            </div>

            {/* Los Sellos (Stamps) */}
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((sello) => {
                const completado = sello <= progresoActual;
                const esPremio = sello === 5;
                return (
                  <div 
                    key={sello} 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all
                      ${completado ? 'bg-dorado text-negro-barber shadow-lg shadow-dorado/40 scale-110' : 'bg-gray-800 text-gray-600 border border-gray-700'}
                      ${esPremio && !completado ? 'border-dorado text-dorado' : ''}
                    `}
                  >
                    {esPremio ? <FaGift /> : completado ? <FaCheck /> : sello}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 2: PRÓXIMAS CITAS --- */}
        <section>
          <h2 className="text-xl font-black text-negro-barber uppercase tracking-tighter mb-6 flex items-center gap-3">
            <FaCalendarDay className="text-dorado" /> Próximas Citas
          </h2>
          
          {citasProximas.length === 0 ? (
            <div className="bg-white p-10 rounded-2rem text-center shadow-sm border-2 border-dashed border-gray-200">
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
                  <div key={cita._id} className="bg-white p-6 rounded-2rem shadow-sm border-l-4 border-dorado">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-dorado/10 text-dorado px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        {new Date(cita.fechaHora).toLocaleDateString()} — {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {!editable && <span className="text-[10px] font-black text-red-500 uppercase">Bloqueada</span>}
                    </div>

                    <h3 className="text-xl font-black text-negro-barber mb-1 uppercase italic">{cita.servicio?.nombre}</h3>
                    <p className="text-gray-400 text-sm font-bold mb-4">${cita.servicio?.precio} MXN</p>
                    
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

        {/* --- SECCIÓN 3: HISTORIAL (El Mismo de Siempre) --- */}
        {citasPasadas.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <FaClock /> Historial de Cortes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-80 hover:opacity-100 transition-opacity">
              {citasPasadas.map(cita => (
                <div key={cita._id} className="bg-white p-5 rounded-2rem shadow-sm border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] font-black uppercase block mb-2">
                      {new Date(cita.fechaHora).toLocaleDateString()}
                    </span>
                    <h3 className="text-lg font-black text-gray-700 uppercase italic">{cita.servicio?.nombre}</h3>
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

        {/* --- MODAL PARA REPROGRAMAR (Se queda igual, no lo borres) --- */}
        {/* ... (Pega aquí la parte del modalAbierto que ya tenías) ... */}

      </div>
    </div>
  );
}

export default UserDashboard;