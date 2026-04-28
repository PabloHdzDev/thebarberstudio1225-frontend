import { useState, useEffect } from 'react';
import api from '../api';
import { 
  FaPlus, FaCamera, FaScissors, FaBoxOpen, FaX, FaTrash, 
  FaPenToSquare, FaCircleCheck, FaCircleExclamation, FaCalendarCheck, FaWhatsapp, FaClock, FaCalendarDay, FaBars, FaEyeSlash
} from 'react-icons/fa6';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

function BarberDashboard() {
  const [items, setItems] = useState([]);
  const [citas, setCitas] = useState([]);
  const [tabActiva, setTabActiva] = useState('citas');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const [itemAEditar, setItemAEditar] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

  // 1. Añadimos 'activo' al estado inicial del formulario
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: 0, duracionMinutos: 30, fechaHora: '', notas: '', activo: true
  });

  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setAlerta({ mostrar: true, mensaje, tipo });
    setTimeout(() => setAlerta(prev => ({ ...prev, mostrar: false })), 4000);
  };

  useEffect(() => {
    socket.on('notificar_cita', (nuevaCita) => {
      setCitas(prevCitas => {
        const existe = prevCitas.find(c => c._id === nuevaCita._id);
        if (existe) return prevCitas.map(c => c._id === nuevaCita._id ? nuevaCita : c);
        return [nuevaCita, ...prevCitas];
      });
      mostrarNotificacion(`Agenda actualizada: ${nuevaCita.cliente?.nombre}`);
    });
    return () => socket.off('notificar_cita');
  }, []);

const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 👇 AQUÍ ESTÁ LA MAGIA: Si no son citas, le agregamos el ?admin=true
      const endpoint = tabActiva === 'citas' 
        ? '/citas' 
        : `/${tabActiva}?admin=true`; 

      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (tabActiva === 'citas') setCitas(res.data);
      else setItems(res.data);
    } catch (err) {
      mostrarNotificacion("Error al conectar con el servidor", "error");
    }
  };

  useEffect(() => { cargarDatos(); }, [tabActiva]);

  const guardarItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const path = `/${tabActiva}`; 
    
    try {
      if (tabActiva === 'citas' && itemAEditar) {
        const fechaParaEnviar = new Date(form.fechaHora).toISOString();
        await api.put(`/citas/${itemAEditar._id}`, {
          fechaHora: fechaParaEnviar,
          notas: form.notas
        }, { headers: { Authorization: `Bearer ${token}` } });
      } 
      else {
        const data = new FormData();
        data.append('nombre', form.nombre);
        data.append('precio', form.precio);
        data.append('descripcion', form.descripcion);
        data.append('activo', form.activo); // 2. Enviamos el estado 'activo' al backend
        
        if (tabActiva === 'productos') data.append('stock', form.stock);
        if (tabActiva === 'servicios') data.append('duracionMinutos', form.duracionMinutos);
        if (archivo) data.append('imagen', archivo);

        const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };

        if (itemAEditar) {
          await api.put(`${path}/${itemAEditar._id}`, data, config);
        } else {
          await api.post(path, data, config); 
        }
        mostrarNotificacion("Guardado con éxito");
      }

      cerrarTodo();
      cargarDatos();
    } catch (err) {
      mostrarNotificacion("Error: " + (err.response?.data?.mensaje || "No se pudo guardar"), "error");
    }
  };

  const prepararEdicionCita = (cita) => {
    const date = new Date(cita.fechaHora);
    const offset = date.getTimezoneOffset() * 60000;
    const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    setItemAEditar(cita);
    setForm({ ...cita, fechaHora: localISODate, notas: cita.notas || '' });
    setMostrarForm(true);
  };

  const eliminarElemento = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esto permanentemente?")) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/${tabActiva}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      mostrarNotificacion("Eliminado correctamente");
      cargarDatos();
    } catch (err) { mostrarNotificacion("Error al eliminar", "error"); }
  };

  const cerrarTodo = () => {
    setMostrarForm(false);
    setItemAEditar(null);
    // 3. Reiniciamos el formulario asegurando que activo vuelva a true por defecto
    setForm({ nombre: '', descripcion: '', precio: '', stock: 0, duracionMinutos: 30, fechaHora: '', notas: '', activo: true });
    setArchivo(null);
    setMenuMovil(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {alerta.mostrar && (
        <div className={`fixed top-5 right-5 md:top-10 md:right-10 z-[110] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-l-8 text-sm md:text-base ${
          alerta.tipo === 'exito' ? 'bg-negro-barber border-dorado text-white' : 'bg-red-600 border-red-800 text-white'
        }`}>
          {alerta.tipo === 'exito' ? <FaCircleCheck className="text-dorado text-xl" /> : <FaCircleExclamation className="text-xl" />}
          <span className="font-bold">{alerta.mensaje}</span>
        </div>
      )}

      <header className="md:hidden bg-negro-barber p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-dorado font-black tracking-tighter italic">PANEL ADMIN</h2>
        <button onClick={() => setMenuMovil(!menuMovil)} className="text-dorado text-2xl">
          {menuMovil ? <FaX /> : <FaBars />}
        </button>
      </header>

      <aside className={`
        fixed md:relative z-40 w-64 bg-negro-barber text-white p-6 h-screen transition-transform duration-300 shadow-2xl
        ${menuMovil ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <h2 className="hidden md:block text-dorado font-black text-xl mb-10 tracking-tighter italic border-b border-dorado/20 pb-4 uppercase text-center">Panel Admin</h2>
        <nav className="space-y-3 mt-10 md:mt-0">
          <button onClick={() => {setTabActiva('citas'); setMenuMovil(false);}} className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${tabActiva === 'citas' ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}>
            <FaCalendarCheck /> Citas en Vivo
          </button>
          <button onClick={() => {setTabActiva('servicios'); setMenuMovil(false);}} className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${tabActiva === 'servicios' ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}>
            <FaScissors /> Servicios
          </button>
          <button onClick={() => {setTabActiva('productos'); setMenuMovil(false);}} className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${tabActiva === 'productos' ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}>
            <FaBoxOpen /> Productos
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-negro-barber uppercase tracking-tighter">
            {tabActiva === 'citas' ? 'Próximas' : 'Gestión de'} <span className="text-dorado">{tabActiva}</span>
          </h1>
          {tabActiva !== 'citas' && (
            <button onClick={() => setMostrarForm(true)} className="w-full sm:w-auto bg-negro-barber text-dorado px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
              <FaPlus /> NUEVO {tabActiva === 'servicios' ? 'SERVICIO' : 'PRODUCTO'}
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tabActiva === 'citas' ? (
            citas.map(cita => (
              <div key={cita._id} className="bg-white p-6 rounded-2rem shadow-sm border-t-4 border-dorado relative">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-dorado/10 text-dorado px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase">
                    {new Date(cita.fechaHora).toLocaleDateString()} - {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <button onClick={() => eliminarElemento(cita._id)} className="text-gray-300 hover:text-red-500 transition"><FaTrash /></button>
                </div>
                <h3 className="text-xl font-black text-negro-barber mt-3">{cita.cliente?.nombre}</h3>
                <p className="text-gray-500 font-bold mb-1">{cita.servicio?.nombre}</p>
                {cita.notas && <p className="text-xs text-gray-400 italic mb-4">"{cita.notas}"</p>}
                
                <div className="flex flex-col gap-2 mt-4">
                  <a href={`https://wa.me/${cita.cliente?.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                    <FaWhatsapp /> Contactar
                  </a>
                  <button onClick={() => prepararEdicionCita(cita)} className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-negro-barber rounded-xl hover:bg-dorado transition font-bold"><FaCalendarDay /> Reprogramar</button>
                </div>
              </div>
            ))
          ) : (
            items.map(item => (
              <div key={item._id} className={`bg-white rounded-2rem shadow-sm border border-gray-100 overflow-hidden group transition-all ${item.activo === false ? 'opacity-70 grayscale-[50%]' : ''}`}>
                <div className="h-44 bg-gray-200 relative overflow-hidden">
                  
                  {/* 4. Etiqueta visual si está oculto */}
                  {item.activo === false && (
                    <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10 flex items-center gap-1 shadow-lg border border-red-400">
                      <FaEyeSlash /> Oculto
                    </div>
                  )}

                  <img src={item.imagen || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.nombre} />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full font-black text-negro-barber shadow-lg">${item.precio}</div>
                  {tabActiva === 'servicios' && (
                    <div className="absolute top-4 right-4 bg-negro-barber/80 text-dorado px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <FaClock /> {item.duracionMinutos || 30} MIN
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{item.nombre}</h3>
                  {tabActiva === 'productos' && <p className={`text-xs font-black uppercase ${item.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>Stock: {item.stock}</p>}
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => { 
                      setItemAEditar(item); 
                      // Cargamos los datos, si 'activo' no existe por ser viejo, le ponemos true por defecto
                      setForm({ ...item, duracionMinutos: item.duracionMinutos || 30, activo: item.activo !== false }); 
                      setMostrarForm(true); 
                    }} className="flex-1 bg-gray-100 p-3 rounded-xl hover:bg-dorado transition-colors font-bold flex justify-center gap-2 text-sm">
                      <FaPenToSquare /> Editar
                    </button>
                    <button onClick={() => eliminarElemento(item._id)} className="bg-gray-100 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {(mostrarForm) && (
          <div className="fixed inset-0 bg-negro-barber/90 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-in zoom-in duration-300">
              <div className="bg-negro-barber p-6 md:p-8 flex justify-between items-center border-b-4 border-dorado sticky top-0 z-10">
                <h2 className="text-white font-black uppercase tracking-widest text-lg md:text-xl">
                  {tabActiva === 'citas' ? 'Reprogramar' : (itemAEditar ? `Editar ${tabActiva}` : `Nuevo ${tabActiva}`)}
                </h2>
                <button onClick={cerrarTodo} className="text-white hover:text-dorado transition text-2xl"><FaX /></button>
              </div>
              <form onSubmit={guardarItem} className="p-6 md:p-10 space-y-4 md:space-y-6">
                {tabActiva !== 'citas' ? (
                  <>
                    {/* 5. Checkbox para Visibilidad */}
                    <div>
                      <label className="flex items-center justify-between cursor-pointer bg-dorado/10 p-4 rounded-xl border border-dorado/30 hover:border-dorado transition-colors">
                        <span className="text-[10px] md:text-xs font-black uppercase text-negro-barber tracking-widest flex items-center gap-2">
                          <FaEyeSlash className={form.activo ? 'text-gray-400' : 'text-red-500'}/> Visible al público
                        </span>
                        <input 
                          type="checkbox" 
                          checked={form.activo} 
                          onChange={(e) => setForm({...form, activo: e.target.checked})} 
                          className="w-5 h-5 accent-dorado cursor-pointer"
                        />
                      </label>
                      <p className="text-[9px] text-gray-400 mt-1 ml-2 uppercase">Desmarca para ocultarlo sin tener que borrarlo.</p>
                    </div>

                    <div>
                      <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Nombre</label>
                      <input type="text" required value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Precio</label>
                        <input type="number" required value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                      </div>
                      {tabActiva === 'servicios' ? (
                        <div>
                          <label className="text-[10px] md:text-xs font-black uppercase text-dorado tracking-widest">Duración</label>
                          <select value={form.duracionMinutos} onChange={(e) => setForm({...form, duracionMinutos: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-dorado/5 border-2 border-dorado/20 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-black text-xs">
                            <option value="15">15 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">1 hora</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] md:text-xs font-black uppercase text-dorado tracking-widest">Stock</label>
                          <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-dorado/5 border-2 border-dorado/20 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-black" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Descripción</label>
                      <textarea rows="2" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-dorado transition-colors">
                        <FaCamera className="text-dorado text-2xl" />
                        <span className="text-xs font-bold text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{archivo ? archivo.name : 'Subir imagen'}</span>
                        <input type="file" hidden onChange={(e) => setArchivo(e.target.files[0])} />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <p className="font-bold text-negro-barber">Reprogramando a: {itemAEditar?.cliente?.nombre}</p>
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nueva Fecha y Hora</label>
                      <input type="datetime-local" required value={form.fechaHora} onChange={(e) => setForm({...form, fechaHora: e.target.value})} className="w-full mt-2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Notas de la cita</label>
                      <textarea rows="3" value={form.notas} onChange={(e) => setForm({...form, notas: e.target.value})} className="w-full mt-2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dorado focus:outline-none font-medium" placeholder="Ej: El cliente quiere un diseño extra..." />
                    </div>
                  </div>
                )}
                <button type="submit" className="w-full bg-negro-barber text-dorado py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-xl">
                  {tabActiva === 'citas' ? 'Confirmar' : 'Guardar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BarberDashboard;