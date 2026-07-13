import { useState, useEffect } from 'react';
import api from '../api';
import {
  FaPlus, FaCamera, FaScissors, FaBoxOpen, FaX, FaTrash,
  FaPenToSquare, FaCircleCheck, FaCircleExclamation, FaCalendarCheck,
  FaWhatsapp, FaCalendarDay, FaBars, FaEyeSlash, FaChartPie,
  FaMoneyBillTrendUp, FaUsers, FaChartColumn, FaGift, FaFire,
  FaTrophy, FaUserPlus, FaUserClock, FaMagnifyingGlass,
  FaLock, FaLockOpen, FaArrowRotateLeft, FaChevronLeft, FaChevronRight,
  FaAddressBook
} from 'react-icons/fa6';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const NIVELES = {
  nuevo:     { label: 'Nuevo',     color: 'bg-gray-100 text-gray-500' },
  regular:   { label: 'Regular',   color: 'bg-blue-100 text-blue-700' },
  frecuente: { label: 'Frecuente', color: 'bg-amber-100 text-amber-700' },
  vip:       { label: 'VIP',       color: 'bg-yellow-400 text-black' },
};

function BarberDashboard() {
  const [items, setItems] = useState([]);
  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [serviciosList, setServiciosList] = useState([]);
  const [clienteStats, setClienteStats] = useState(null);
  const [cargandoStats, setCargandoStats] = useState(false);

  const [directorio, setDirectorio] = useState([]);
  const [dirPage, setDirPage] = useState(1);
  const [dirTotalPaginas, setDirTotalPaginas] = useState(1);
  const [dirTotal, setDirTotal] = useState(0);
  const [dirBuscar, setDirBuscar] = useState('');
  const [dirOrden, setDirOrden] = useState('nombre');
  const [cargandoDir, setCargandoDir] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [tabActiva, setTabActiva] = useState('citas');
  const [filtroCitas, setFiltroCitas] = useState('proximas');
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
      setCitas(prev => {
        const existe = prev.find(c => c._id === nuevaCita._id);
        if (existe) return prev.map(c => c._id === nuevaCita._id ? nuevaCita : c);
        return [nuevaCita, ...prev];
      });
      mostrarNotificacion(`Agenda actualizada: ${nuevaCita.cliente?.nombre || nuevaCita.nombreInvitado}`);
    });
    return () => {
      socket.off('notificar_cita');
    };
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');

      if (tabActiva === 'clientes') {
        setCargandoStats(true);
        const [resStats] = await Promise.all([
          api.get('/clientes/estadisticas', { headers: { Authorization: `Bearer ${token}` } }),
          cargarDirectorio(1, '', 'nombre')
        ]);
        setClienteStats(resStats.data);
        setCargandoStats(false);
        return;
      }

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
      mostrarNotificacion('Error al conectar con el servidor', 'error');
      setCargandoStats(false);
    }
  };

  const cargarDirectorio = async (pagina = 1, buscar = dirBuscar, orden = dirOrden) => {
    setCargandoDir(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(
        `/clientes/directorio?pagina=${pagina}&buscar=${encodeURIComponent(buscar)}&orden=${orden}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDirectorio(res.data.clientes);
      setDirTotalPaginas(res.data.totalPaginas);
      setDirTotal(res.data.total);
      setDirPage(res.data.paginaActual);
    } catch {
      mostrarNotificacion('Error al cargar el directorio', 'error');
    } finally {
      setCargandoDir(false);
    }
  };

  const ejecutarAccion = async (id, accion) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.put(`/clientes/${id}/admin`, { accion }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      mostrarNotificacion('Acción ejecutada con éxito');
      setDirectorio(prev => prev.map(c => c._id === id ? res.data.usuario : c));
      if (clienteSeleccionado?._id === id) setClienteSeleccionado(res.data.usuario);
    } catch (err) {
      mostrarNotificacion(err.response?.data?.mensaje || 'Error al ejecutar la acción', 'error');
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
      console.log('No se pudieron cargar los catálogos');
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
          await api.post('/citas', {
            servicio: form.servicio,
            fechaHora: fechaParaEnviar,
            notas: form.notas,
            cliente: form.esInvitado ? null : form.cliente,
            nombreInvitado: form.esInvitado ? form.nombreInvitado : null
          }, { headers: { Authorization: `Bearer ${token}` } });
        }
      } else {
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

      mostrarNotificacion('Guardado con éxito');
      cerrarTodo();
      cargarDatos();
    } catch (err) {
      mostrarNotificacion('Error: ' + (err.response?.data?.mensaje || 'No se pudo guardar'), 'error');
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
    const localISODate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setItemAEditar(cita);
    setForm({ ...form, fechaHora: localISODate, notas: cita.notas || '' });
    setMostrarForm(true);
  };

  const eliminarElemento = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esto permanentemente?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/${tabActiva}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      mostrarNotificacion('Eliminado correctamente');
      cargarDatos();
    } catch (err) { mostrarNotificacion('Error al eliminar', 'error'); }
  };

  const cerrarTodo = () => {
    setMostrarForm(false);
    setItemAEditar(null);
    setForm({ nombre: '', descripcion: '', precio: '', stock: 0, duracionMinutos: 30, fechaHora: '', notas: '', activo: true, servicio: '', cliente: '', nombreInvitado: '', esInvitado: false, orden: 0, esOferta: false, precioAnterior: '' });
    setArchivo(null);
    setMenuMovil(false);
  };

  // --- ESTADÍSTICAS DE CITAS (calculadas en frontend) ---
  const calcularEstadisticas = () => {
    if (citas.length === 0) return { ingresos: 0, promedio: 0, total: 0, diasSemana: [], maxPromedio: 0 };
    const ingresosTotales = citas.reduce((acc, c) => acc + (c.servicio?.precio || 0), 0);
    const diasUnicos = new Set(citas.map(c => new Date(c.fechaHora).toDateString())).size;
    const promedioDiario = diasUnicos > 0 ? (citas.length / diasUnicos).toFixed(1) : 0;
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const mapaDias = Array(7).fill(0).map(() => ({ totalCortes: 0, fechasUnicas: new Set() }));
    citas.forEach(c => {
      const diaSemana = new Date(c.fechaHora).getDay();
      mapaDias[diaSemana].totalCortes += 1;
      mapaDias[diaSemana].fechasUnicas.add(new Date(c.fechaHora).toDateString());
    });
    const diasSemana = mapaDias.map((data, i) => {
      const promedio = data.fechasUnicas.size > 0 ? (data.totalCortes / data.fechasUnicas.size).toFixed(1) : 0;
      return { dia: nombresDias[i], promedio: parseFloat(promedio) };
    });
    const maxPromedio = Math.max(...diasSemana.map(d => d.promedio), 1);
    return { ingresos: ingresosTotales, promedio: promedioDiario, total: citas.length, diasSemana, maxPromedio };
  };

  const stats = calcularEstadisticas();

  const ahora = new Date();
  const citasMostradas = citas.filter(cita => {
    const esPasada = new Date(cita.fechaHora) < ahora;
    return filtroCitas === 'proximas' ? !esPasada : esPasada;
  });
  if (filtroCitas === 'pasadas') {
    citasMostradas.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
  }

  const tabItems = [
    { id: 'citas',        icon: <FaCalendarCheck />, label: 'Agenda' },
    { id: 'clientes',     icon: <FaUsers />,         label: 'Clientes' },
    { id: 'estadisticas', icon: <FaChartPie />,      label: 'Estadísticas' },
    { id: 'servicios',    icon: <FaScissors />,       label: 'Servicios' },
    { id: 'productos',    icon: <FaBoxOpen />,        label: 'Productos' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

      {/* ── TOAST ── */}
      {alerta.mostrar && (
        <div className={`fixed top-5 right-5 md:top-10 md:right-10 z-110 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-l-8 text-sm md:text-base ${
          alerta.tipo === 'exito' ? 'bg-negro-barber border-dorado text-white' : 'bg-red-600 border-red-800 text-white'
        }`}>
          {alerta.tipo === 'exito' ? <FaCircleCheck className="text-dorado text-xl" /> : <FaCircleExclamation className="text-xl" />}
          <span className="font-bold">{alerta.mensaje}</span>
        </div>
      )}

      {/* ── HEADER MÓVIL ── */}
      <header className="md:hidden bg-negro-barber p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-dorado font-black tracking-tighter italic">PANEL ADMIN</h2>
        <button onClick={() => setMenuMovil(!menuMovil)} className="text-dorado text-2xl">
          {menuMovil ? <FaX /> : <FaBars />}
        </button>
      </header>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed md:sticky md:top-0 md:self-start z-40 w-64 bg-negro-barber text-white p-6 h-screen overflow-y-auto transition-transform duration-300 shadow-2xl ${menuMovil ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <h2 className="hidden md:block text-dorado font-black text-xl mb-10 tracking-tighter italic border-b border-dorado/20 pb-4 uppercase text-center">Panel Admin</h2>
        <nav className="space-y-2 mt-10 md:mt-0">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setTabActiva(tab.id); setMenuMovil(false); }}
              className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all text-sm font-bold ${tabActiva === tab.id ? 'bg-dorado text-negro-barber font-black' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-negro-barber uppercase tracking-tighter">
            {tabActiva === 'citas' && 'Agenda en Vivo'}
            {tabActiva === 'clientes' && <>Gestión de <span className="text-dorado">Clientes</span></>}
            {tabActiva === 'estadisticas' && 'Rendimiento'}
            {(tabActiva === 'servicios' || tabActiva === 'productos') && <>Gestión de <span className="text-dorado">{tabActiva}</span></>}
          </h1>

          {tabActiva !== 'estadisticas' && tabActiva !== 'clientes' && (
            <button
              onClick={tabActiva === 'citas' ? abrirModalNuevaCita : () => setMostrarForm(true)}
              className="w-full sm:w-auto bg-negro-barber text-dorado px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl"
            >
              <FaPlus /> NUEVO {tabActiva === 'citas' ? 'TURNO' : tabActiva === 'servicios' ? 'SERVICIO' : 'PRODUCTO'}
            </button>
          )}
        </header>

        {/* ══════════════════════════════════════
            TAB: CLIENTES
        ══════════════════════════════════════ */}
        {tabActiva === 'clientes' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {cargandoStats ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-dorado rounded-full animate-spin" />
              </div>
            ) : clienteStats ? (
              <>
                {/* Resumen */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Clientes Totales',    value: clienteStats.resumen.totalClientes,          icon: <FaUsers />,     color: 'border-dorado' },
                    { label: 'Con Premio Pendiente', value: clienteStats.resumen.clientesConPremio,      icon: <FaGift />,      color: 'border-amber-400' },
                    { label: 'Nuevos este Mes',      value: clienteStats.resumen.clientesNuevosEsteMes,  icon: <FaUserPlus />,  color: 'border-blue-400' },
                    { label: 'Inactivos +60 días',   value: clienteStats.resumen.clientesInactivos,      icon: <FaUserClock />, color: 'border-red-400' },
                  ].map(stat => (
                    <div key={stat.label} className={`bg-white p-5 rounded-2xl shadow-sm border-t-4 ${stat.color} relative overflow-hidden`}>
                      <div className="absolute -right-3 -bottom-3 text-6xl text-gray-100">{stat.icon}</div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-negro-barber">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Clientes con Premio */}
                {clienteStats.clientesConPremio.length > 0 && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                    <h3 className="font-black text-negro-barber uppercase tracking-tight text-lg mb-4 flex items-center gap-2">
                      <FaGift className="text-amber-500" /> Clientes con Premio Disponible
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {clienteStats.clientesConPremio.map(c => (
                        <div key={c._id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                          <div>
                            <p className="font-black text-negro-barber">{c.nombre}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                          <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-green-600 transition">
                            <FaWhatsapp /> Contactar
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clientes Frecuentes */}
                {clienteStats.clientesFrecuentes.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-black text-negro-barber uppercase tracking-tight text-lg mb-4 flex items-center gap-2">
                      <FaTrophy className="text-dorado" /> Clientes Más Frecuentes
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-3 text-xs text-gray-400 font-black uppercase tracking-widest">Cliente</th>
                            <th className="text-center py-2 px-3 text-xs text-gray-400 font-black uppercase tracking-widest">Nivel</th>
                            <th className="text-center py-2 px-3 text-xs text-gray-400 font-black uppercase tracking-widest">Visitas</th>
                            <th className="text-center py-2 px-3 text-xs text-gray-400 font-black uppercase tracking-widest">Total gastado</th>
                            <th className="text-center py-2 px-3 text-xs text-gray-400 font-black uppercase tracking-widest">Última visita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clienteStats.clientesFrecuentes.map((c, i) => {
                            const nivelInfo = NIVELES[c.nivel] || NIVELES.nuevo;
                            return (
                              <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-300">#{i + 1}</span>
                                    <div>
                                      <p className="font-bold text-negro-barber">{c.nombre}</p>
                                      <p className="text-[10px] text-gray-400">{c.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${nivelInfo.color}`}>{nivelInfo.label}</span>
                                </td>
                                <td className="py-3 px-3 text-center font-black text-dorado">{c.totalVisitas}</td>
                                <td className="py-3 px-3 text-center font-bold text-negro-barber">${c.totalGastado}</td>
                                <td className="py-3 px-3 text-center text-xs text-gray-500">
                                  {c.ultimaVisita ? new Date(c.ultimaVisita).toLocaleDateString('es-MX') : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Servicios Top */}
                  {clienteStats.serviciosTop.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h3 className="font-black text-negro-barber uppercase tracking-tight mb-4 flex items-center gap-2">
                        <FaFire className="text-orange-500" /> Servicios Más Solicitados
                      </h3>
                      <div className="space-y-3">
                        {clienteStats.serviciosTop.map((s, i) => {
                          const maxTotal = clienteStats.serviciosTop[0]?.total || 1;
                          const pct = (s.total / maxTotal) * 100;
                          return (
                            <div key={s._id}>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-negro-barber">{s.nombre || 'Servicio eliminado'}</span>
                                <span className="text-dorado">{s.total} {s.total === 1 ? 'vez' : 'veces'}</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-dorado/70 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Clientes Inactivos */}
                  {clienteStats.clientesInactivos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h3 className="font-black text-negro-barber uppercase tracking-tight mb-4 flex items-center gap-2">
                        <FaUserClock className="text-red-400" /> Clientes Inactivos (+60 días)
                      </h3>
                      <div className="space-y-3">
                        {clienteStats.clientesInactivos.map(c => (
                          <div key={c._id} className="flex items-center justify-between py-2 border-b border-gray-50">
                            <div>
                              <p className="font-bold text-negro-barber text-sm">{c.nombre}</p>
                              <p className="text-[10px] text-gray-400">
                                Última: {c.ultimaVisita ? new Date(c.ultimaVisita).toLocaleDateString('es-MX') : '—'}
                              </p>
                            </div>
                            <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-600 text-lg transition">
                              <FaWhatsapp />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clientes Nuevos */}
                {clienteStats.clientesNuevos.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-black text-negro-barber uppercase tracking-tight mb-4 flex items-center gap-2">
                      <FaUserPlus className="text-blue-400" /> Clientes Nuevos (últimos 30 días)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {clienteStats.clientesNuevos.map(c => (
                        <div key={c._id} className="bg-gray-50 rounded-xl p-4">
                          <p className="font-bold text-negro-barber">{c.nombre}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            Registrado: {new Date(c.createdAt).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── DIRECTORIO PAGINADO ── */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="font-black text-negro-barber uppercase tracking-tight flex items-center gap-2">
                      <FaAddressBook className="text-dorado" /> Directorio
                      <span className="text-xs font-bold text-gray-400 normal-case tracking-normal">({dirTotal} clientes)</span>
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                          type="text"
                          placeholder="Buscar por nombre, email..."
                          value={dirBuscar}
                          onChange={e => {
                            setDirBuscar(e.target.value);
                            cargarDirectorio(1, e.target.value, dirOrden);
                          }}
                          className="pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-dorado focus:outline-none w-full sm:w-52"
                        />
                      </div>
                      <select
                        value={dirOrden}
                        onChange={e => { setDirOrden(e.target.value); cargarDirectorio(1, dirBuscar, e.target.value); }}
                        className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:border-dorado focus:outline-none"
                      >
                        <option value="nombre">A–Z</option>
                        <option value="totalVisitas">Más visitas</option>
                        <option value="totalGastado">Más gasto</option>
                        <option value="ultimaVisita">Última visita</option>
                        <option value="recientes">Más recientes</option>
                      </select>
                    </div>
                  </div>

                  {cargandoDir ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-dorado rounded-full animate-spin" />
                    </div>
                  ) : directorio.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No se encontraron clientes.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 text-xs text-gray-400 font-black uppercase tracking-widest">Cliente</th>
                            <th className="text-center py-2 px-2 text-xs text-gray-400 font-black uppercase tracking-widest hidden sm:table-cell">Nivel</th>
                            <th className="text-center py-2 px-2 text-xs text-gray-400 font-black uppercase tracking-widest">Visitas</th>
                            <th className="text-center py-2 px-2 text-xs text-gray-400 font-black uppercase tracking-widest hidden md:table-cell">Gastado</th>
                            <th className="text-center py-2 px-2 text-xs text-gray-400 font-black uppercase tracking-widest hidden lg:table-cell">Última</th>
                            <th className="text-center py-2 px-2 text-xs text-gray-400 font-black uppercase tracking-widest">Estado</th>
                            <th className="py-2 px-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {directorio.map(c => {
                            const nivelInfo = NIVELES[c.nivel] || NIVELES.nuevo;
                            return (
                              <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${c.activo === false ? 'bg-red-100 text-red-400' : 'bg-dorado/20 text-dorado'}`}>
                                      {c.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className={`font-bold text-sm ${c.activo === false ? 'text-gray-400 line-through' : 'text-negro-barber'}`}>{c.nombre}</p>
                                      <p className="text-[10px] text-gray-400 hidden sm:block">{c.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-center hidden sm:table-cell">
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${nivelInfo.color}`}>{nivelInfo.label}</span>
                                </td>
                                <td className="py-3 px-2 text-center font-black text-dorado">{c.totalVisitas}</td>
                                <td className="py-3 px-2 text-center text-xs font-bold text-negro-barber hidden md:table-cell">${c.totalGastado}</td>
                                <td className="py-3 px-2 text-center text-xs text-gray-400 hidden lg:table-cell">
                                  {c.ultimaVisita ? new Date(c.ultimaVisita).toLocaleDateString('es-MX') : '—'}
                                </td>
                                <td className="py-3 px-2 text-center">
                                  {c.activo === false
                                    ? <span className="text-[10px] font-black text-red-400 bg-red-50 px-2 py-0.5 rounded-full">Bloqueado</span>
                                    : <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Activo</span>
                                  }
                                </td>
                                <td className="py-3 px-2">
                                  <button
                                    onClick={() => setClienteSeleccionado(c)}
                                    className="text-xs font-black text-gray-400 hover:text-negro-barber bg-gray-100 hover:bg-dorado/20 px-3 py-1.5 rounded-lg transition"
                                  >
                                    Ver
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Paginación */}
                  {dirTotalPaginas > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <button
                        disabled={dirPage <= 1}
                        onClick={() => cargarDirectorio(dirPage - 1)}
                        className="flex items-center gap-1 px-4 py-2 text-xs font-black rounded-xl bg-gray-100 text-gray-500 hover:bg-dorado/20 hover:text-negro-barber transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FaChevronLeft /> Anterior
                      </button>
                      <span className="text-xs text-gray-400 font-bold">
                        Página {dirPage} de {dirTotalPaginas}
                      </span>
                      <button
                        disabled={dirPage >= dirTotalPaginas}
                        onClick={() => cargarDirectorio(dirPage + 1)}
                        className="flex items-center gap-1 px-4 py-2 text-xs font-black rounded-xl bg-gray-100 text-gray-500 hover:bg-dorado/20 hover:text-negro-barber transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Siguiente <FaChevronRight />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-gray-400">No hay datos disponibles aún.</div>
            )}
          </div>
        )}

        {/* ── MODAL ACCIONES CLIENTE ── */}
        {clienteSeleccionado && (
          <div className="fixed inset-0 bg-negro-barber/80 backdrop-blur-sm z-100 flex items-center justify-center p-4" onClick={() => setClienteSeleccionado(null)}>
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-negro-barber p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-dorado/20 flex items-center justify-center text-2xl font-black text-dorado flex-shrink-0">
                  {clienteSeleccionado.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-black text-lg truncate">{clienteSeleccionado.nombre}</h3>
                  <p className="text-gray-400 text-xs truncate">{clienteSeleccionado.email}</p>
                  {clienteSeleccionado.activo === false && (
                    <span className="text-[10px] font-black text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">Cuenta bloqueada</span>
                  )}
                </div>
                <button onClick={() => setClienteSeleccionado(null)} className="text-gray-400 hover:text-white text-xl flex-shrink-0">
                  <FaX />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-dorado">{clienteSeleccionado.totalVisitas}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Visitas</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-negro-barber">${clienteSeleccionado.totalGastado}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gastado</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <span className={`text-xs font-black px-2 py-1 rounded-lg ${(NIVELES[clienteSeleccionado.nivel] || NIVELES.nuevo).color}`}>
                      {(NIVELES[clienteSeleccionado.nivel] || NIVELES.nuevo).label}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Nivel</p>
                  </div>
                </div>

                {/* Progreso lealtad */}
                <div className="bg-dorado/5 border border-dorado/20 rounded-xl p-4">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-600">Progreso lealtad</span>
                    <span className="text-dorado">{clienteSeleccionado.contadorVisitas}/5 visitas</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-dorado rounded-full transition-all" style={{ width: `${Math.min((clienteSeleccionado.contadorVisitas / 5) * 100, 100)}%` }} />
                  </div>
                  {clienteSeleccionado.premioPendiente && (
                    <p className="text-[11px] text-dorado font-black mt-2 flex items-center gap-1"><FaGift /> Premio disponible para canjear</p>
                  )}
                </div>

                {/* Última visita */}
                <p className="text-xs text-gray-400 text-center">
                  Última visita: {clienteSeleccionado.ultimaVisita
                    ? new Date(clienteSeleccionado.ultimaVisita).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Sin visitas registradas'}
                </p>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <a href={`https://wa.me/${clienteSeleccionado.whatsapp}`} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition">
                    <FaWhatsapp /> Contactar por WhatsApp
                  </a>

                  <button
                    onClick={() => ejecutarAccion(clienteSeleccionado._id, 'resetear_contador')}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm hover:bg-amber-100 transition"
                  >
                    <FaArrowRotateLeft /> Resetear contador de lealtad
                  </button>

                  {clienteSeleccionado.activo === false ? (
                    <button
                      onClick={() => ejecutarAccion(clienteSeleccionado._id, 'desbloquear')}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-sm hover:bg-blue-100 transition"
                    >
                      <FaLockOpen /> Desbloquear cuenta
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Bloquear la cuenta de ${clienteSeleccionado.nombre}? No podrá iniciar sesión.`)) {
                          ejecutarAccion(clienteSeleccionado._id, 'bloquear');
                        }
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition"
                    >
                      <FaLock /> Bloquear cuenta
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: ESTADÍSTICAS
        ══════════════════════════════════════ */}
        {tabActiva === 'estadisticas' && (
          <div className="space-y-8 animate-in fade-in duration-500">
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

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-negro-barber uppercase mb-8 flex items-center gap-3">
                <FaChartColumn className="text-dorado" /> Promedio de Cortes por Día
              </h3>
              <div className="flex items-end justify-between gap-2 h-48 mt-4 pt-6 border-b border-gray-100">
                {stats.diasSemana.map((dia, i) => {
                  const heightPercent = dia.promedio > 0 ? (dia.promedio / stats.maxPromedio) * 100 : 0;
                  const esCerrado = dia.promedio === 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                      <div className={`absolute -top-8 text-xs font-black px-2 py-1 rounded-md transition-all duration-300 ${esCerrado ? 'text-gray-300' : 'text-negro-barber bg-dorado/20 opacity-0 group-hover:opacity-100'}`}>
                        {dia.promedio}
                      </div>
                      <div
                        className={`w-full max-w-10 md:max-w-15 rounded-t-xl transition-all duration-500 cursor-pointer ${esCerrado ? 'bg-gray-100' : 'bg-dorado/30 group-hover:bg-dorado'}`}
                        style={{ height: esCerrado ? '4px' : `${heightPercent}%` }}
                      />
                      <div className={`text-[10px] md:text-xs font-black uppercase mt-2 ${esCerrado ? 'text-gray-300' : 'text-gray-500 group-hover:text-negro-barber'}`}>
                        {dia.dia}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: CITAS — sub-tabs
        ══════════════════════════════════════ */}
        {tabActiva === 'citas' && (
          <div className="flex gap-2 mb-6 bg-gray-200 p-1.5 rounded-xl w-full sm:w-fit">
            <button onClick={() => setFiltroCitas('proximas')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filtroCitas === 'proximas' ? 'bg-white text-negro-barber shadow-md' : 'text-gray-500 hover:text-negro-barber'}`}>
              Próximas
            </button>
            <button onClick={() => setFiltroCitas('pasadas')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filtroCitas === 'pasadas' ? 'bg-white text-negro-barber shadow-md' : 'text-gray-500 hover:text-negro-barber'}`}>
              Historial
            </button>
          </div>
        )}

        {/* ── GRID CITAS / SERVICIOS / PRODUCTOS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tabActiva === 'citas' ? (
            citasMostradas.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold text-lg">No hay citas en esta sección.</p>
              </div>
            ) : (
              citasMostradas.map(cita => (
                <div
                  key={cita._id}
                  className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 relative
                    ${cita.esExterno ? 'border-blue-500' : cita.estado === 'completada' ? 'border-green-500' : 'border-dorado'}
                    ${filtroCitas === 'pasadas' ? 'opacity-90' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase ${cita.esExterno ? 'bg-blue-50 text-blue-600' : 'bg-dorado/10 text-dorado'}`}>
                      {new Date(cita.fechaHora).toLocaleDateString()} - {new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!cita.esExterno && (
                      <button onClick={() => eliminarElemento(cita._id)} className="text-gray-300 hover:text-red-500 transition"><FaTrash /></button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-negro-barber">
                      {cita.cliente ? cita.cliente.nombre : cita.esExterno ? cita.nombreInvitado : `${cita.nombreInvitado} (Walk-in)`}
                    </h3>
                    {cita.esPremio && <span className="text-[10px] bg-dorado/20 text-dorado font-black px-2 py-0.5 rounded-full">🎁 Premio</span>}
                  </div>

                  <p className={`font-bold mb-1 ${cita.esExterno ? 'text-blue-500' : 'text-gray-500'}`}>
                    {cita.servicio?.nombre}
                  </p>

                  {cita.notas && (
                    <div className="text-xs text-gray-400 italic mb-4 line-clamp-3 [&>b]:text-negro-barber"
                      dangerouslySetInnerHTML={{ __html: cita.notas }}
                    />
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    {cita.cliente && (
                      <a href={`https://wa.me/${cita.cliente.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                        <FaWhatsapp /> Contactar
                      </a>
                    )}

                    {!cita.esExterno && filtroCitas === 'proximas' && (
                      <button onClick={() => prepararEdicionCita(cita)} className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-negro-barber rounded-xl hover:bg-dorado transition font-bold">
                        <FaCalendarDay /> Reprogramar
                      </button>
                    )}

                    {cita.estado === 'completada' && (
                      <div className="py-2.5 bg-green-50 rounded-xl text-center text-green-600 font-black text-xs uppercase tracking-widest border border-green-200">
                        ✓ Asistió — Puntos registrados
                      </div>
                    )}

                    {cita.esExterno && (
                      <div className="py-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Modificar en App de Google
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          ) : tabActiva !== 'estadisticas' && tabActiva !== 'clientes' && (
            items.map(item => (
              <div key={item._id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group transition-all ${item.activo === false ? 'opacity-70 grayscale-50' : ''}`}>
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

        {/* ── MODAL FORMULARIO ── */}
        {mostrarForm && (
          <div className="fixed inset-0 bg-negro-barber/90 backdrop-blur-md z-100 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-4xl shadow-2xl animate-in zoom-in duration-300">
              <div className="bg-negro-barber p-6 md:p-8 flex justify-between items-center border-b-4 border-dorado sticky top-0 z-10">
                <h2 className="text-white font-black uppercase tracking-widest text-lg md:text-xl">
                  {tabActiva === 'citas' ? (itemAEditar ? 'Reprogramar Cita' : 'Nueva Cita Manual') : (itemAEditar ? `Editar ${tabActiva}` : `Nuevo ${tabActiva}`)}
                </h2>
                <button onClick={cerrarTodo} className="text-white hover:text-dorado transition text-2xl"><FaX /></button>
              </div>
              <form onSubmit={guardarItem} className="p-6 md:p-10 space-y-4 md:space-y-6">

                {tabActiva !== 'citas' ? (
                  <>
                    <div className="flex items-center justify-between bg-dorado/10 p-4 rounded-xl border border-dorado/30 hover:border-dorado transition-colors">
                      <span className="text-[10px] md:text-xs font-black uppercase text-negro-barber tracking-widest flex items-center gap-2">
                        <FaEyeSlash className={form.activo ? 'text-gray-400' : 'text-red-500'} /> Visible al público
                      </span>
                      <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="w-5 h-5 accent-dorado cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Nombre</label>
                      <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Precio Normal</label>
                        <input type="number" required value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                      </div>
                      {tabActiva === 'servicios' ? (
                        <div>
                          <label className="text-[10px] md:text-xs font-black uppercase text-dorado tracking-widest">Duración</label>
                          <select value={form.duracionMinutos} onChange={(e) => setForm({ ...form, duracionMinutos: e.target.value })} className="w-full mt-1 p-3 md:p-4 bg-dorado/5 border-2 border-dorado/20 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-black text-xs">
                            <option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">1 hora</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] md:text-xs font-black uppercase text-dorado tracking-widest">Stock</label>
                          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full mt-1 p-3 md:p-4 bg-dorado/5 border-2 border-dorado/20 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none font-black" />
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Opciones Avanzadas</h4>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center justify-between">
                            Posición (Orden) <span className="text-gray-300 font-normal">0 es primero</span>
                          </label>
                          <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl focus:border-dorado focus:ring-1 focus:ring-dorado font-bold outline-none transition-all" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <label className="flex items-center gap-3 cursor-pointer mt-2 sm:mt-6 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={form.esOferta} onChange={(e) => setForm({ ...form, esOferta: e.target.checked })} className="w-5 h-5 accent-red-500 rounded cursor-pointer" />
                            <span className="text-xs font-black uppercase text-red-500 tracking-widest">🔥 Activar Oferta</span>
                          </label>
                        </div>
                      </div>
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${form.esOferta ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Precio Anterior (Se mostrará tachado)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input type="number" value={form.precioAnterior} onChange={(e) => setForm({ ...form, precioAnterior: e.target.value })} className="w-full mt-1 p-3 pl-8 bg-white border border-red-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 font-bold text-red-500 line-through outline-none transition-all" placeholder="Ej. 350" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest">Descripción</label>
                      <textarea rows="2" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="w-full mt-1 p-3 md:p-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-dorado focus:outline-none" />
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
                  <div className="space-y-4">
                    {!itemAEditar && (
                      <>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <span className="text-xs font-black uppercase text-negro-barber">¿Es cliente nuevo/de paso?</span>
                          <input type="checkbox" checked={form.esInvitado} onChange={(e) => setForm({ ...form, esInvitado: e.target.checked })} className="w-5 h-5 accent-dorado" />
                        </div>
                        {form.esInvitado ? (
                          <div>
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nombre del Cliente</label>
                            <input type="text" required value={form.nombreInvitado} onChange={(e) => setForm({ ...form, nombreInvitado: e.target.value })} placeholder="Ej. Carlos G." className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado font-bold" />
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Seleccionar Cliente</label>
                            <select required value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado font-bold">
                              <option value="">-- Elige un cliente registrado --</option>
                              {usuarios.map(u => <option key={u._id} value={u._id}>{u.nombre} ({u.whatsapp})</option>)}
                            </select>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Servicio</label>
                          <select required value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado font-bold">
                            <option value="">-- Elige un servicio --</option>
                            {serviciosList.map(s => <option key={s._id} value={s._id}>{s.nombre} (${s.precio})</option>)}
                          </select>
                        </div>
                      </>
                    )}
                    {itemAEditar && (
                      <p className="font-bold text-negro-barber bg-dorado/10 p-4 rounded-xl">
                        Reprogramando a: {itemAEditar.cliente ? itemAEditar.cliente.nombre : itemAEditar.nombreInvitado}
                      </p>
                    )}
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Fecha y Hora</label>
                      <input type="datetime-local" required value={form.fechaHora} onChange={(e) => setForm({ ...form, fechaHora: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dorado focus:outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Notas</label>
                      <textarea rows="2" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dorado focus:outline-none font-medium" />
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
