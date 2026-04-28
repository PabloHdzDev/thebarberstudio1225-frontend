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
  
  // NUEVO: Estado para guardar las horas que se generen automáticamente
  const [horariosDinamicos, setHorariosDinamicos] = useState([]);

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

  // LÓGICA 1: Manejar el cambio de fecha y bloquear los miércoles
  const manejarCambioFecha = (e) => {
    const fechaSeleccionada = e.target.value;
    
    // Convertimos la fecha de manera segura para evitar saltos de zona horaria
    const fechaObj = new Date(`${fechaSeleccionada}T12:00:00`);
    
    // getDay(): Domingo es 0, Lunes es 1, ... Miércoles es 3
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

  // LÓGICA 2: Generador de horarios cuando cambia la fecha o el servicio
  useEffect(() => {
    if (!fecha || !servicio) return;

    const generarHorarios = () => {
      const horarios = [];
      const ahora = new Date();
      
      // Horario de atención: 11:00 AM a 19:00 PM (7:00 PM)
      let tiempoActual = new Date(`${fecha}T11:00:00`);
      const tiempoCierre = new Date(`${fecha}T19:00:00`);
      const duracionMs = servicio.duracionMinutos * 60000;

      // Mientras el inicio del turno + la duración del servicio no pase de las 7:00 PM
      while (tiempoActual.getTime() + duracionMs <= tiempoCierre.getTime()) {
        
        // Calculamos cuántas horas faltan desde AHORA hasta ese turno
        const diferenciaHoras = (tiempoActual - ahora) / (1000 * 60 * 60);

        // Solo mostramos el horario si faltan más de 4 horas
        if (diferenciaHoras >= 4) {
          const horasStr = tiempoActual.getHours().toString().padStart(2, '0');
          const minutosStr = tiempoActual.getMinutes().toString().padStart(2, '0');
          horarios.push(`${horasStr}:${minutosStr}`);
        }

        // Sumamos la duración del servicio para el siguiente turno
        tiempoActual = new Date(tiempoActual.getTime() + duracionMs);
      }

      setHorariosDinamicos(horarios);
      
      if (horarios.length === 0) {
        setMensaje({ texto: 'Ya no hay horarios disponibles para este día.', tipo: 'error' });
      }
    };

    generarHorarios();
  }, [fecha, servicio]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    const fechaSeleccionada = new Date(`${fecha}T${hora}:00`);
    const ahora = new Date();
    const diferenciaHoras = (fechaSeleccionada - ahora) / (1000 * 60 * 60);

    // Doble validación de seguridad
    if (diferenciaHoras < 4) {
      setMensaje({ texto: 'Por favor, agenda con al menos 4 horas de anticipación.', tipo: 'error' });
      return;
    }

    setMensaje({ texto: 'Procesando tu lugar...', tipo: 'info' });

    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setMensaje({ texto: 'Inicia sesión para agendar.', tipo: 'error' });
        return;
      }

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
        texto: error.response?.data?.mensaje || 'Error al agendar. Es posible que el horario ya se ocupó.', 
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
            <div className={`p-4 rounded-xl mb-6 text-center text-sm font-bold border ${
              mensaje.tipo === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
              mensaje.tipo === 'exito' ? 'bg-amber-50 border-dorado text-amber-900' : 
              'bg-gray-50 border-gray-200 text-gray-700'
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

          {fecha && horariosDinamicos.length > 0 && (
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
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
            disabled={!fecha || !hora}
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