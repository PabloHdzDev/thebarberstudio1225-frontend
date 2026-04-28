// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../api';
import { FaScissors, FaCalendarDay, FaClock, FaX, FaTrash, FaPen, FaArrowLeft, FaWhatsapp } from 'react-icons/fa6';
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
      setCitas(res.data);
    } catch (err) {
      console.error("Error al cargar citas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarCitas(); }, []);

  // Función para validar si la cita es editable (más de 24 horas de diferencia)
  const esEditable = (fechaHoraCita) => {
    const ahora = new Date();
    const fechaCita = new Date(fechaHoraCita);
    const diferenciaMs = fechaCita - ahora;
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    return diferenciaHoras > 4;
  };

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
      await api.delete(`/citas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarCitas();
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al cancelar");
    }
  };

  if (cargando) return <div className="min-h-screen flex items-center justify-center bg-gray-100 font-black text-dorado animate-pulse">CARGANDO TUS CITAS...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-negro-barber uppercase tracking-tighter">Mis <span className="text-dorado">Citas</span></h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Historial y próximas visitas</p>
          </div>
          <Link to="/" className="text-gray-400 hover:text-negro-barber transition font-black text-[10px] flex items-center gap-2 border-b border-transparent hover:border-negro-barber">
            <FaArrowLeft /> VOLVER AL INICIO
          </Link>
        </header>

        {citas.length === 0 ? (
          <div className="bg-white p-16 rounded-2rem text-center shadow-sm border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold mb-6">No tienes citas próximas.</p>
            <Link to="/" className="bg-negro-barber text-dorado px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-lg">
              Agendar Servicio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {citas.map(cita => {
              const editable = esEditable(cita.fechaHora);
              return (
                <div key={cita._id} className="bg-white p-6 rounded-2rem shadow-sm border-l-4 border-dorado relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-dorado/10 text-dorado px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {new Date(cita.fechaHora).toLocaleDateString()} — {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {!editable && <span className="text-[10px] font-black text-red-500 uppercase">Bloqueada</span>}
                  </div>

                  <h3 className="text-xl font-black text-negro-barber mb-1 uppercase italic">{cita.servicio?.nombre}</h3>
                  <p className="text-gray-400 text-sm font-bold mb-4">${cita.servicio?.precio} MXN</p>
                  
                  {cita.notas && (
                    <p className="text-[11px] text-gray-500 italic mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      "{cita.notas}"
                    </p>
                  )}

                  {editable ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => abrirModalReprogramar(cita)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-negro-barber text-white rounded-xl text-[10px] font-black uppercase hover:bg-dorado hover:text-negro-barber transition-all"
                      >
                        <FaPen /> Reprogramar
                      </button>
                      <button 
                        onClick={() => cancelarCita(cita._id)}
                        className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-tighter leading-tight">
                        Los cambios solo se permiten con <br/> más de 24 horas de anticipación.
                      </div>
                      <a 
                        href="https://wa.me/523328412707" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-green-500/20"
                      >
                        <FaWhatsapp className="text-sm" /> Ayuda por WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL PARA REPROGRAMAR */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-negro-barber/90 backdrop-blur-md z-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2rem overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="bg-negro-barber p-6 flex justify-between items-center border-b-4 border-dorado">
                <h2 className="text-white font-black uppercase text-xs tracking-widest">Nueva Fecha</h2>
                <button onClick={() => setModalAbierto(false)} className="text-white hover:text-dorado transition text-xl"><FaX /></button>
              </div>
              <form onSubmit={confirmarCambio} className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Selecciona el nuevo horario</label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={form.fechaHora} 
                    onChange={(e) => setForm({...form, fechaHora: e.target.value})} 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Actualizar nota</label>
                  <textarea 
                    value={form.notas} 
                    onChange={(e) => setForm({...form, notas: e.target.value})} 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-medium text-sm"
                    rows="3"
                  />
                </div>
                <button type="submit" className="w-full bg-negro-barber text-dorado py-5 rounded-xl font-black uppercase tracking-widest shadow-xl hover:bg-dorado hover:text-negro-barber transition-all">
                  Confirmar Cambio
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