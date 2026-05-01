import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaWhatsapp, FaArrowLeft, FaIdCard } from 'react-icons/fa6';
import api from '../api';

function Auth() {
  const [esLogin, setEsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    identificador: '', // Para el Login (input mixto)
    email: '',         // Para Registro
    password: '',
    whatsapp: ''       // Para Registro
  });
  const [error, setError] = useState('');
  
  // 👇 1. Agregamos el estado de carga
  const [cargando, setCargando] = useState(false); 
  
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true); // 👇 2. Activamos la animación de carga
    
    const ruta = esLogin ? '/auth/login' : '/auth/registro';
    
    try {
      const res = await api.post(ruta, formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify({
        nombre: res.data.nombre,
        rol: res.data.rol
      }));

      if (res.data.rol === 'barbero') {
        navigate('/admin'); 
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Ocurrió un error en el servidor');
    } finally {
      setCargando(false); // 👇 3. Apagamos la carga (falle o tenga éxito)
    }
  };

  return (
    <div className="min-h-screen bg-negro-barber flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white">
        
        {/* Encabezado con Identidad Visual */}
        <div className="bg-negro-barber p-10 text-center border-b-4 border-dorado">
          <h1 className="text-white text-3xl font-black tracking-tighter">
            BARBER <span className="text-dorado">IMPERIO</span>
          </h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em]">
            {esLogin ? 'Bienvenido de vuelta' : 'Únete a la élite'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={enviarFormulario} className="space-y-5">
            
            {/* CAMPOS DE REGISTRO */}
            {!esLogin && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                    <FaUser className="text-dorado" /> Nombre Completo
                  </label>
                  <input 
                    type="text" name="nombre" required
                    onChange={manejarCambio}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                    placeholder="Juan Pérez"
                    disabled={cargando}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                    <FaEnvelope className="text-dorado" /> Correo Electrónico
                  </label>
                  <input 
                    type="email" name="email" required
                    onChange={manejarCambio}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                    placeholder="ejemplo@mail.com"
                    disabled={cargando}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                    <FaWhatsapp className="text-dorado" /> WhatsApp
                  </label>
                  <input 
                    type="text" name="whatsapp" required
                    onChange={manejarCambio}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                    placeholder="5512345678"
                    disabled={cargando}
                  />
                </div>
              </>
            )}

            {/* CAMPO ÚNICO DE LOGIN */}
            {esLogin && (
              <div>
                <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                  <FaIdCard className="text-dorado" /> Correo o WhatsApp
                </label>
                <input 
                  type="text" name="identificador" required
                  onChange={manejarCambio}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                  placeholder="Email o número de celular"
                  disabled={cargando}
                />
              </div>
            )}

            {/* CAMPO COMPARTIDO */}
            <div>
              <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                <FaLock className="text-dorado" /> Contraseña
              </label>
              <input 
                type="password" name="password" required
                onChange={manejarCambio}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                placeholder="••••••••"
                disabled={cargando}
              />
            </div>

            {/* 👇 4. Botón Dinámico con Spinner */}
            <button 
              type="submit" 
              disabled={cargando}
              className={`w-full text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg mt-4 flex justify-center items-center gap-3
                ${cargando 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-negro-barber hover:bg-gris-oscuro'
                }
              `}
            >
              {cargando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{esLogin ? 'Entrando...' : 'Creando Cuenta...'}</span>
                </>
              ) : (
                <span>{esLogin ? 'Entrar' : 'Crear Cuenta'}</span>
              )}
            </button>
          </form>

          {/* Selector de modo */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm font-medium">
              {esLogin ? '¿Aún no tienes cuenta?' : '¿Ya eres cliente?'}
            </p>
            <button 
              onClick={() => { setEsLogin(!esLogin); setError(''); }}
              disabled={cargando}
              className="text-negro-barber font-black text-sm uppercase mt-2 border-b-2 border-dorado hover:text-dorado-hover transition-all disabled:opacity-50"
            >
              {esLogin ? 'Registrarme ahora' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-negro-barber transition text-xs font-bold uppercase tracking-tighter">
              <FaArrowLeft /> Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;