import { useState, useEffect } from 'react';
import api from '../api';
import { 
  FaPlus, FaCamera, FaScissors, FaBoxOpen, FaX, FaTrash, 
  FaPenToSquare, FaCircleCheck, FaCircleExclamation, FaCalendarCheck, 
  FaWhatsapp, FaClock, FaCalendarDay, FaBars, FaEyeSlash, FaChartPie, FaMoneyBillTrendUp, FaUsers, FaChartColumn
} from 'react-icons/fa6';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

function BarberDashboard() {
  const [items, setItems] = useState([]);
  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState([]); 
  const [serviciosList, setServiciosList] = useState([]); 
  
  const [tabActiva, setTabActiva] = useState('citas'); 
  const [mostrarForm, setMostrarForm] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const [itemAEditar, setItemAEditar] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: 0, duracionMinutos: 30, 
    fechaHora: '', notas: '', activo: true,
    servicio: '', cliente: '', nombreInvitado: '', esInvitado: false,
    orden: 0, esOferta: false, precioAnterior: ''
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
      mostrarNotificacion(`Agenda actualizada: ${nuevaCita.cliente?.nombre || nuevaCita.nombreInvitado}`);
    });
    return () => socket.off('notificar_cita');
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (tabActiva === 'estadisticas') {
        const res = await api.get('/citas', { headers: { Authorization: `Bearer ${token}` } });
        setCitas(res.data);
        return;
      }

      const endpoint = tabActiva === 'citas' ? '/citas' : `/${tabActiva}?admin=true`; 
      const res = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      
      if (tabActiva === 'citas') setCitas(res.data);
      else setItems(res.data);
    } catch (err) {
      mostrarNotificacion("Error al conectar con el servidor", "error");
    }
  };

  const cargarCatalogosCita = async () => {
    try {
      const token = localStorage.getItem('token');
      const [resUsers, resServ] = await Promise.all([
        api.get('/auth/usuarios', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/servicios')
      ]);
      setUsuarios(resUsers.data.filter(u => u.rol !== 'barbero'));
      setServiciosList(resServ.data);
    } catch (error) {
      console.log("No se pudieron cargar los catálogos");
    }
  };

  useEffect(() => { cargarDatos(); }, [tabActiva]);

  const guardarItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (tabActiva === 'citas') {
        const fechaParaEnviar = new Date(form.fechaHora).toISOString();
        
        if (itemAEditar) {
          await api.put(`/citas/${itemAEditar._id}`, {
            fechaHora: fechaParaEnviar, notas: form.notas
          }, { headers: { Authorization: `Bearer ${token}` } });
        } else {
          const dataCita = {
            servicio: form.servicio,
            fechaHora: fechaParaEnviar,
            notas: form.notas,
            cliente: form.esInvitado ? null : form.cliente,
            nombreInvitado: form.esInvitado ? form.nombreInvitado : null
          };
          await api.post('/citas', dataCita, { headers: { Authorization: `Bearer ${token}` } });
        }
      } 
      else {
        const data = new FormData();
        data.append('nombre', form.nombre);
        data.append('precio', form.precio);
        data.append('descripcion', form.descripcion);
        data.append('activo', form.activo);
        data.append('orden', form.orden);  
        data.append('esOferta', form.esOferta);
        data.append('precioAnterior', form.precioAnterior || 0);
        
        if (tabActiva === 'servicios') data.append('duracionMinutos', form.duracionMinutos);
        if (tabActiva === 'productos') data.append('stock', form.stock);
        if (archivo) data.append('imagen', archivo);

        const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
        if (itemAEditar) await api.put(`/${tabActiva}/${itemAEditar._id}`, data, config);
        else await api.post(`/${tabActiva}`, data, config); 
      }

      mostrarNotificacion("Guardado con éxito");
      cerrarTodo();
      cargarDatos();
    } catch (err) {
      mostrarNotificacion("Error: " + (err.response?.data?.mensaje || "No se pudo guardar"), "error");
    }
  };

  const abrirModalNuevaCita = () => {
    cargarCatalogosCita();
    setItemAEditar(null);
    setForm({ ...form, fechaHora: '', notas: '', servicio: '', cliente: '', nombreInvitado: '', esInvitado: false });
    setMostrarForm(true);
  };

  const prepararEdicionCita = (cita) => {
    const date = new Date(cita.fechaHora);
    const offset = date.getTimezoneOffset() * 60000;
    const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    setItemAEditar(cita);
    setForm({ ...form, fechaHora: localISODate, notas: cita.notas || '' });
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
    setForm({ nombre: '', descripcion: '', precio: '', stock: 0, duracionMinutos: 30, fechaHora: '', notas: '', activo: true, servicio: '', cliente: '', nombreInvitado: '', esInvitado: false, orden: 0, esOferta: false, precioAnterior: '' });
    setArchivo(null);
    setMenuMovil(false);
  };

  // --- NUEVO CÁLCULO DE ESTADÍSTICAS ---
  const calcularEstadisticas = () => {
    if (citas.length === 0) return { ingresos: 0, promedio: 0, total: 0, diasSemana: [], maxPromedio: 0 };
    
    // 1. Ingresos y totales
    const ingresosTotales = citas.reduce((acc, c) => acc + (c.servicio?.precio || 0), 0);
    const diasUnicos = new Set(citas.map(c => new Date(c.fechaHora).toDateString())).size;
    const promedioDiario = diasUnicos > 0 ? (citas.length / diasUnicos).toFixed(1) : 0;

    // 2. Lógica para el promedio de cortes por día de la semana
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Creamos un mapa para los 7 días de la semana
    const mapaDias = Array(7).fill(0).map(() => ({ totalCortes: 0, fechasUnicas: new Set() }));

    citas.forEach(c => {
      const fecha = new Date(c.fechaHora);
      const diaSemana = fecha.getDay(); // Retorna 0 para Domingo, 1 para Lunes...
      mapaDias[diaSemana].totalCortes += 1;
      mapaDias[diaSemana].fechasUnicas.add(fecha.toDateString());
    });

    const diasSemana = mapaDias.map((data, index) => {
      // Si el barbero ha trabajado 3 lunes en la historia, dividimos los cortes de los lunes entre 3.
      const promedio = data.fechasUnicas.size > 0 ? (data.totalCortes / data.fechasUnicas.size).toFixed(1) : 0;
      return {
        dia: nombresDias[index],
        promedio: parseFloat(promedio)
      };
    });

    // Encontrar el valor más alto para escalar la gráfica dinámicamente
    const maxPromedio = Math.max(...diasSemana.map(d => d.promedio), 1);

    return { ingresos: ingresosTotales, promedio: promedioDiario, total: citas.length, diasSemana, maxPromedio };
  };
  
  const stats = calcularEstadisticas();

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
            <FaCalendarCheck /> Agenda
          </button>
          <button onClick={() => {setTabActiva('estadisticas'); setMenuMovil(false);}} className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${tabActiva === 'estadisticas' ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}>
            <FaChartPie /> Estadísticas
          </button>
          <button onClick={() => {setTabActiva('servicios'); setMenuMovil(false);}} className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${tabActiva === 'servicios' ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}>
            <FaScissors /> Servicios
          </button>
          <button onClick={() => {setTabActiva('productos'); setMenuMovil(false);}} className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${tabActiva === 'productos' ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}>
            <FaBoxOpen /> Productos
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-negro-barber uppercase tracking-tighter">
            {tabActiva === 'citas' ? 'Agenda en Vivo' : tabActiva === 'estadisticas' ? 'Rendimiento' : 'Gestión de'} <span className="text-dorado">{tabActiva !== 'citas' && tabActiva !== 'estadisticas' ? tabActiva : ''}</span>
          </h1>
          
          {tabActiva !== 'estadisticas' && (
            <button 
              onClick={tabActiva === 'citas' ? abrirModalNuevaCita : () => setMostrarForm(true)} 
              className="w-full sm:w-auto bg-negro-barber text-dorado px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl"
            >
              <FaPlus /> NUEVO {tabActiva === 'citas' ? 'TURNO' : tabActiva === 'servicios' ? 'SERVICIO' : 'PRODUCTO'}
            </button>
          )}
        </header>

        {/* --- PESTAÑA DE ESTADÍSTICAS AMPLIADA --- */}
        {tabActiva === 'estadisticas' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Tarjetas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-dorado relative overflow-hidden">
                <FaMoneyBillTrendUp className="absolute -right-4 -bottom-4 text-8xl text-gray-100" />
                <div className="relative z-10">
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Ingresos Estimados</p>
                  <h3 className="text-4xl font-black text-negro-barber">${stats.ingresos} <span className="text-sm">MXN</span></h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-dorado relative overflow-hidden">
                <FaCalendarDay className="absolute -right-4 -bottom-4 text-8xl text-gray-100" />
                <div className="relative z-10">
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Promedio General</p>
                  <h3 className="text-4xl font-black text-negro-barber">{stats.promedio} <span className="text-sm">Cortes/Día</span></h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-dorado relative overflow-hidden">
                <FaUsers className="absolute -right-4 -bottom-4 text-8xl text-gray-100" />
                <div className="relative z-10">
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Citas Totales</p>
                  <h3 className="text-4xl font-black text-negro-barber">{stats.total}</h3>
                </div>
              </div>
            </div>

            {/* Nueva Gráfica de Barras: Cortes por día de la semana */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-negro-barber uppercase mb-8 flex items-center gap-3">
                <FaChartColumn className="text-dorado" /> Promedio de Cortes por Día
              </h3>
              
              <div className="flex items-end justify-between gap-2 h-48 mt-4 pt-6 border-b border-gray-100">
                {stats.diasSemana.map((dia, i) => {
                  // Calculamos la altura de la barra en porcentaje (máximo 100%)
                  const heightPercent = dia.promedio > 0 ? (dia.promedio / stats.maxPromedio) * 100 : 0;
                  const esCerrado = dia.promedio === 0;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                      {/* Tooltip flotante con el número exacto */}
                      <div className={`absolute -top-8 text-xs font-black px-2 py-1 rounded-md transition-all duration-300
                        ${esCerrado ? 'text-gray-300' : 'text-negro-barber bg-dorado/20 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:-translate-y-0'}
                      `}>
                        {dia.promedio}
                      </div>

                      {/* La barra */}
                      <div 
                        className={`w-full max-w-[40px] md:max-w-[60px] rounded-t-xl transition-all duration-500 cursor-pointer
                          ${esCerrado ? 'bg-gray-100' : 'bg-dorado/30 group-hover:bg-dorado'}
                        `}
                        style={{ height: esCerrado ? '4px' : `${heightPercent}%` }}
                      ></div>
                      
                      {/* El nombre del día */}
                      <div className={`text-[10px] md:text-xs font-black uppercase mt-2 
                        ${esCerrado ? 'text-gray-300' : 'text-gray-500 group-hover:text-negro-barber'}
                      `}>
                        {dia.dia}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                Basado en tu historial de citas completadas
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {tabActiva === 'citas' ? (
            citas.map(cita => (
              <div key={cita._id} className="bg-white p-6 rounded-2rem shadow-sm border-t-4 border-dorado relative">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-dorado/10 text-dorado px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase">
                    {new Date(cita.fechaHora).toLocaleDateString()} - {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <button onClick={() => eliminarElemento(cita._id)} className="text-gray-300 hover:text-red-500 transition"><FaTrash /></button>
                </div>
                <h3 className="text-xl font-black text-negro-barber mt-3">
                  {cita.cliente ? cita.cliente.nombre : `${cita.nombreInvitado} (Walk-in)`}
                </h3>
                <p className="text-gray-500 font-bold mb-1">{cita.servicio?.nombre}</p>
                {cita.notas && <p className="text-xs text-gray-400 italic mb-4">"{cita.notas}"</p>}
                
                <div className="flex flex-col gap-2 mt-4">
                  {cita.cliente && (
                    <a href={`https://wa.me/${cita.cliente.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                      <FaWhatsapp /> Contactar
                    </a>
                  )}
                  <button onClick={() => prepararEdicionCita(cita)} className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-negro-barber rounded-xl hover:bg-dorado transition font-bold"><FaCalendarDay /> Reprogramar</button>
                </div>
              </div>
            ))
          ) : tabActiva !== 'estadisticas' && (
            items.map(item => (
              <div key={item._id} className={`bg-white rounded-2rem shadow-sm border border-gray-100 overflow-hidden group transition-all ${item.activo === false ? 'opacity-70 grayscale-[50%]' : ''}`}>
                <div className="h-44 bg-gray-200 relative overflow-hidden">
                  {item.activo === false && (
                    <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10 flex items-center gap-1 shadow-lg border border-red-400">
                      <FaEyeSlash /> Oculto
                    </div>
                  )}
                  <img src={item.imagen || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.nombre} />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full font-black text-negro-barber shadow-lg">${item.precio}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{item.nombre}</h3>
                  {tabActiva === 'productos' && <p className={`text-xs font-black uppercase ${item.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>Stock: {item.stock}</p>}
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => { 
                      setItemAEditar(item); 
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
                  {tabActiva === 'citas' ? (itemAEditar ? 'Reprogramar Cita' : 'Nueva Cita Manual') : (itemAEditar ? `Editar ${tabActiva}` : `Nuevo ${tabActiva}`)}
                </h2>
                <button onClick={cerrarTodo} className="text-white hover:text-dorado transition text-2xl"><FaX /></button>
              </div>
              <form onSubmit={guardarItem} className="p-6 md:p-10 space-y-4 md:space-y-6">
                
                {/* --- FORMULARIO PRODUCTOS / SERVICIOS --- */}
                {tabActiva !== 'citas' ? (
                  <>
                    <div className="flex items-center justify-between bg-dorado/10 p-4 rounded-xl border border-dorado/30 hover:border-dorado transition-colors">
                      <span className="text-[10px] md:text-xs font-black uppercase text-negro-barber tracking-widest flex items-center gap-2">
                        <FaEyeSlash className={form.activo ? 'text-gray-400' : 'text-red-500'}/> Visible al público
                      </span>
                      <input type="checkbox" checked={form.activo} onChange={(e) => setForm({...form, activo: e.target.checked})} className="w-5 h-5 accent-dorado cursor-pointer" />
                    </div>

                    <div>
                      <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Nombre</label>
                      <input type="text" required value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Precio Normal</label>
                        <input type="number" required value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                      </div>
                      
                      {tabActiva === 'servicios' ? (
                        <div>
                          <label className="text-[10px] md:text-xs font-black uppercase text-dorado tracking-widest">Duración</label>
                          <select value={form.duracionMinutos} onChange={(e) => setForm({...form, duracionMinutos: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-dorado/5 border-2 border-dorado/20 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-black text-xs">
                            <option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">1 hora</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] md:text-xs font-black uppercase text-dorado tracking-widest">Stock</label>
                          <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full mt-1 p-3 md:p-4 bg-dorado/5 border-2 border-dorado/20 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-black" />
                        </div>
                      )}
                    </div>

                    {/* 👇 SECCIÓN DE CONFIGURACIÓN AVANZADA (Para ambos: Servicios y Productos) */}
                    <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Opciones Avanzadas</h4>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Input de Orden (Más compacto) */}
                        <div className="flex-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center justify-between">
                            Posición (Orden) <span className="text-gray-300 font-normal">0 es primero</span>
                          </label>
                          <input type="number" value={form.orden} onChange={(e) => setForm({...form, orden: e.target.value})} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl focus:border-dorado focus:ring-1 focus:ring-dorado font-bold outline-none transition-all" />
                        </div>
                        
                        {/* Checkbox de Oferta */}
                        <div className="flex-1 flex flex-col justify-center">
                          <label className="flex items-center gap-3 cursor-pointer mt-2 sm:mt-6 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={form.esOferta} onChange={(e) => setForm({...form, esOferta: e.target.checked})} className="w-5 h-5 accent-red-500 rounded cursor-pointer" />
                            <span className="text-xs font-black uppercase text-red-500 tracking-widest flex items-center gap-1">
                              🔥 Activar Oferta
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Input de Precio Anterior (Solo aparece si es oferta, con animación suave) */}
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${form.esOferta ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 m-0'}`}>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Precio Anterior (Se mostrará tachado)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input type="number" value={form.precioAnterior} onChange={(e) => setForm({...form, precioAnterior: e.target.value})} className="w-full mt-1 p-3 pl-8 bg-white border border-red-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 font-bold text-red-500 line-through outline-none transition-all" placeholder="Ej. 350" />
                        </div>
                      </div>
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
                  // --- FORMULARIO CITAS ---
                  <div className="space-y-4">
                    {!itemAEditar && (
                      <>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <span className="text-xs font-black uppercase text-negro-barber">¿Es cliente nuevo/de paso?</span>
                          <input type="checkbox" checked={form.esInvitado} onChange={(e) => setForm({...form, esInvitado: e.target.checked})} className="w-5 h-5 accent-dorado" />
                        </div>

                        {form.esInvitado ? (
                          <div>
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nombre del Cliente</label>
                            <input type="text" required value={form.nombreInvitado} onChange={(e) => setForm({...form, nombreInvitado: e.target.value})} placeholder="Ej. Carlos G." className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado font-bold" />
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Seleccionar Cliente</label>
                            <select required value={form.cliente} onChange={(e) => setForm({...form, cliente: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado font-bold">
                              <option value="">-- Elige un cliente registrado --</option>
                              {usuarios.map(u => <option key={u._id} value={u._id}>{u.nombre} ({u.whatsapp})</option>)}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Servicio</label>
                          <select required value={form.servicio} onChange={(e) => setForm({...form, servicio: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado font-bold">
                            <option value="">-- Elige un servicio --</option>
                            {serviciosList.map(s => <option key={s._id} value={s._id}>{s.nombre} (${s.precio})</option>)}
                          </select>
                        </div>
                      </>
                    )}

                    {itemAEditar && (
                      <p className="font-bold text-negro-barber bg-dorado/10 p-4 rounded-xl">Reprogramando a: {itemAEditar.cliente ? itemAEditar.cliente.nombre : itemAEditar.nombreInvitado}</p>
                    )}
                    
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Fecha y Hora</label>
                      <input type="datetime-local" required value={form.fechaHora} onChange={(e) => setForm({...form, fechaHora: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Notas</label>
                      <textarea rows="2" value={form.notas} onChange={(e) => setForm({...form, notas: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dorado focus:outline-none font-medium" />
                    </div>
                  </div>
                )}
                <button type="submit" className="w-full bg-negro-barber text-dorado py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-dorado hover:text-negro-barber transition-all shadow-xl">
                  {tabActiva === 'citas' && !itemAEditar ? 'Agendar Turno' : 'Guardar Cambios'}
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