import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCalendarDays, FaClock, FaArrowLeft, FaPen } from 'react-icons/fa6';
import api from '../api';

function Reservar() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [servicio, setServicio] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  const [horariosDinamicos, setHorariosDinamicos] = useState([]);
  const [cargandoHoras, setCargandoHoras] = useState(false); // 👈 Nuevo estado

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const cargarServicio = async () => {
      try {
        const res = await api.get('/servicios');
        const servicioEncontrado = res.data.find(s => s._id === id);
        setServicio(servicioEncontrado);
      } catch (err) {
        console.error("Error al cargar servicio:", err);
      }
    };
    cargarServicio();
  }, [id]);

  const manejarCambioFecha = (e) => {
    const fechaSeleccionada = e.target.value;
    const fechaObj = new Date(`${fechaSeleccionada}T12:00:00`);
    
    if (fechaObj.getDay() === 3) {
      setMensaje({ texto: 'Los miércoles descansamos. Por favor, elige otro día.', tipo: 'error' });
      setFecha('');
      setHorariosDinamicos([]);
      setHora('');
    } else {
      setMensaje({ texto: '', tipo: '' });
      setFecha(fechaSeleccionada);
      setHora('');
    }
  };

  // 👈 LÓGICA MAGISTRAL: Hablar con Google Calendar antes de pintar
  useEffect(() => {
    if (!fecha || !servicio) return;

    const generarHorarios = async () => {
      setCargandoHoras(true);
      setHorariosDinamicos([]); // Limpiamos los previos
      setMensaje({ texto: '', tipo: '' });

      try {
        const token = localStorage.getItem('token');
        // 1. Preguntamos a nuestro nuevo endpoint qué horas están ocupadas hoy
        const res = await api.get(`/citas/disponibilidad/${fecha}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bloquesOcupados = res.data; // [{start: '...', end: '...'}, ...]

        const horariosDisponibles = [];
        const ahora = new Date();
        
        let tiempoActual = new Date(`${fecha}T11:00:00`);
        const tiempoCierre = new Date(`${fecha}T19:00:00`);
        const duracionMs = servicio.duracionMinutos * 60000;

        while (tiempoActual.getTime() + duracionMs <= tiempoCierre.getTime()) {
          const finDelTurnoPosible = new Date(tiempoActual.getTime() + duracionMs);
          const diferenciaHoras = (tiempoActual - ahora) / (1000 * 60 * 60);

          // 2. Revisamos si este turno choca con ALGÚN evento de Google Calendar
          const hayChoque = bloquesOcupados.some(bloque => {
            const ocupadoInicio = new Date(bloque.start).getTime();
            const ocupadoFin = new Date(bloque.end).getTime();
            
            // Lógica de colisión de tiempo
            return (tiempoActual.getTime() < ocupadoFin && finDelTurnoPosible.getTime() > ocupadoInicio);
          });

          // 3. Solo agregamos el botón si faltan > 4 horas Y NO choca con Google Calendar
          if (diferenciaHoras >= 4 && !hayChoque) {
            const horasStr = tiempoActual.getHours().toString().padStart(2, '0');
            const minutosStr = tiempoActual.getMinutes().toString().padStart(2, '0');
            horariosDisponibles.push(`${horasStr}:${minutosStr}`);
          }

          tiempoActual = new Date(tiempoActual.getTime() + duracionMs);
        }

        setHorariosDinamicos(horariosDisponibles);
        
        if (horariosDisponibles.length === 0) {
          setMensaje({ texto: 'La agenda de este día está completamente llena o ya es muy tarde.', tipo: 'error' });
        }
      } catch (error) {
        setMensaje({ texto: 'Error al verificar disponibilidad con el calendario.', tipo: 'error' });
      } finally {
        setCargandoHoras(false);
      }
    };

    generarHorarios();
  }, [fecha, servicio]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    const fechaSeleccionada = new Date(`${fecha}T${hora}:00`);
    const ahora = new Date();
    const diferenciaHoras = (fechaSeleccionada - ahora) / (1000 * 60 * 60);

    if (diferenciaHoras < 4) {
      setMensaje({ texto: 'Por favor, agenda con al menos 4 horas de anticipación.', tipo: 'error' });
      return;
    }

    setMensaje({ texto: 'Procesando tu lugar...', tipo: 'info' });

    try {
      const token = localStorage.getItem('token'); 
      await api.post('/citas', 
        { 
          servicio: id, 
          fechaHora: fechaSeleccionada.toISOString(),
          notas: notas 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje({ texto: '¡Cita agendada con éxito! Te esperamos.', tipo: 'exito' });
      setTimeout(() => navigate('/perfil'), 2500);

    } catch (error) {
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al agendar. Alguien acaba de ganar este lugar.', 
        tipo: 'error' 
      });
    }
  };

  if (!servicio) return <div className="min-h-screen bg-negro-barber flex items-center justify-center text-dorado font-bold">CARGANDO SERVICIO...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        <div className="bg-negro-barber p-8 text-center border-b-4 border-dorado">
          <h2 className="text-dorado text-xs font-black tracking-[0.2em] uppercase mb-2">Reserva tu experiencia</h2>
          <h1 className="text-white text-3xl font-bold">{servicio.nombre}</h1>
          <p className="text-gray-400 mt-2 font-medium">${servicio.precio} MXN • {servicio.duracionMinutos} min</p>
        </div>

        <form onSubmit={manejarEnvio} className="p-8">
          {mensaje.texto && (
            <div className={`p-4 rounded-xl mb-6 text-center text-sm font-bold border animate-in fade-in ${
              mensaje.tipo === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
              mensaje.tipo === 'exito' ? 'bg-amber-50 border-dorado text-amber-900' : 
              'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              {mensaje.texto}
            </div>
          )}

          <div className="mb-6">
            <label className="flex items-center gap-2 text-negro-barber font-black text-xs uppercase tracking-widest mb-3">
              <FaCalendarDays className="text-dorado" /> Selecciona el día
            </label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split('T')[0]}
              value={fecha}
              onChange={manejarCambioFecha}
              className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-dorado focus:outline-none transition-colors bg-gray-50 font-bold"
            />
          </div>

          {/* ESTADO DE CARGA DE HORARIOS */}
          {cargandoHoras && (
            <div className="flex justify-center my-8">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-dorado rounded-full animate-spin"></div>
            </div>
          )}

          {/* MOSTRAR BOTONES SI HAY DISPONIBILIDAD */}
          {fecha && !cargandoHoras && horariosDinamicos.length > 0 && (
            <div className="mb-6 animate-in fade-in duration-300">
              <label className="flex items-center gap-2 text-negro-barber font-black text-xs uppercase tracking-widest mb-3">
                <FaClock className="text-dorado" /> Selecciona la hora
              </label>
              <div className="grid grid-cols-4 gap-2">
                {horariosDinamicos.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHora(h)}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${
                      hora === h 
                      ? 'bg-dorado text-negro-barber shadow-lg shadow-dorado/30 scale-105' 
                      : 'bg-gray-100 text-gray-500 hover:bg-dorado/20 hover:text-negro-barber'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="flex items-center gap-2 text-negro-barber font-black text-xs uppercase tracking-widest mb-3">
              <FaPen className="text-dorado" /> ¿Alguna nota especial?
            </label>
            <textarea 
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Taper fade, corte con navaja..."
              className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-dorado focus:outline-none transition-colors bg-gray-50 font-medium text-sm resize-none"
              rows="3"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={!fecha || !hora || cargandoHoras}
            className="w-full bg-negro-barber text-dorado font-black py-5 rounded-xl hover:bg-dorado hover:text-negro-barber disabled:opacity-30 disabled:grayscale transition-all shadow-xl uppercase tracking-widest text-sm"
          >
            Confirmar Cita
          </button>

          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition font-black text-[10px] tracking-widest uppercase">
              <FaArrowLeft /> CANCELAR
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reservar;