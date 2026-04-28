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
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError('');
    
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
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm font-bold">
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
              />
            </div>

            <button type="submit" className="w-full bg-negro-barber text-white font-black py-4 rounded-xl hover:bg-gris-oscuro transition-all uppercase tracking-widest shadow-lg mt-4">
              {esLogin ? 'Entrar' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Selector de modo */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm font-medium">
              {esLogin ? '¿Aún no tienes cuenta?' : '¿Ya eres cliente?'}
            </p>
            <button 
              onClick={() => { setEsLogin(!esLogin); setError(''); }}
              className="text-negro-barber font-black text-sm uppercase mt-2 border-b-2 border-dorado hover:text-dorado-hover transition-all"
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