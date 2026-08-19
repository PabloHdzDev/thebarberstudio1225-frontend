import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaCircleCheck, FaCircleExclamation, FaArrowLeft } from 'react-icons/fa6';
import api from '../api';

function RestablecerPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [verificando, setVerificando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [nombre, setNombre] = useState('');

  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await api.get(`/auth/reset/${token}`);
        setTokenValido(true);
        setNombre(res.data.nombre || '');
      } catch {
        setTokenValido(false);
      } finally {
        setVerificando(false);
      }
    };
    verificar();
  }, [token]);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      await api.post(`/auth/reset/${token}`, { nuevaContrasena: password });
      setListo(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo actualizar la contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-negro-barber flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white">

        <div className="bg-negro-barber p-10 text-center border-b-4 border-dorado">
          <h1 className="text-white text-3xl font-black tracking-tighter">
            NUEVA <span className="text-dorado">CONTRASEÑA</span>
          </h1>
          {nombre && !listo && (
            <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em]">
              Hola, {nombre}
            </p>
          )}
        </div>

        <div className="p-8">
          {verificando ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-dorado rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm font-bold">Verificando enlace...</p>
            </div>
          ) : !tokenValido ? (
            <div className="text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaCircleExclamation className="text-red-500 text-3xl" />
              </div>
              <h2 className="text-negro-barber font-black text-lg mb-3">Enlace no válido</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Este enlace ya venció o ya fue usado. Los enlaces duran 1 hora
                y solo sirven una vez.
              </p>
              <Link
                to="/recuperar"
                className="inline-block w-full bg-negro-barber text-white font-black py-4 rounded-xl hover:bg-gris-oscuro transition-all uppercase tracking-widest text-sm"
              >
                Pedir un enlace nuevo
              </Link>
            </div>
          ) : listo ? (
            <div className="text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaCircleCheck className="text-green-500 text-3xl" />
              </div>
              <h2 className="text-negro-barber font-black text-lg mb-3">¡Listo!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tu contraseña quedó actualizada. Te llevamos al inicio de sesión...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <form onSubmit={guardar} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                    <FaLock className="text-dorado" /> Nueva contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                    placeholder="Mínimo 6 caracteres"
                    disabled={cargando}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                    <FaLock className="text-dorado" /> Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmacion}
                    onChange={(e) => setConfirmacion(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                    placeholder="Repite la contraseña"
                    disabled={cargando}
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className={`w-full text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg flex justify-center items-center gap-3
                    ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-negro-barber hover:bg-gris-oscuro'}`}
                >
                  {cargando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar contraseña</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-8 border-t border-gray-100 pt-6">
                <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-negro-barber transition text-xs font-bold uppercase tracking-tighter">
                  <FaArrowLeft /> Volver a iniciar sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestablecerPassword;
