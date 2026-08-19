import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaIdCard, FaArrowLeft, FaCircleCheck, FaWhatsapp } from 'react-icons/fa6';
import api from '../api';

function RecuperarPassword() {
  const [identificador, setIdentificador] = useState('');
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const enviarSolicitud = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await api.post('/auth/olvide-password', { identificador });
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-negro-barber flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white">

        <div className="bg-negro-barber p-10 text-center border-b-4 border-dorado">
          <h1 className="text-white text-3xl font-black tracking-tighter">
            RECUPERAR <span className="text-dorado">ACCESO</span>
          </h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em]">
            Te ayudamos a volver
          </p>
        </div>

        <div className="p-8">
          {enviado ? (
            <div className="text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaCircleCheck className="text-green-500 text-3xl" />
              </div>
              <h2 className="text-negro-barber font-black text-lg mb-3">Solicitud enviada</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Si la cuenta existe, la barbería recibirá tu solicitud y te enviará
                un enlace por WhatsApp para que crees tu contraseña nueva.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 text-left mb-6">
                <FaWhatsapp className="text-green-500 text-xl shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Mantente pendiente de tu WhatsApp. Si en un rato no recibes nada,
                  puedes escribirle directamente a la barbería.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block w-full bg-negro-barber text-white font-black py-4 rounded-xl hover:bg-gris-oscuro transition-all uppercase tracking-widest text-sm"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Escribe el correo o el WhatsApp con el que te registraste. La barbería
                te hará llegar un enlace para crear una contraseña nueva.
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <form onSubmit={enviarSolicitud} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-negro-barber font-bold text-xs uppercase mb-2">
                    <FaIdCard className="text-dorado" /> Correo o WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:border-dorado focus:outline-none transition-all"
                    placeholder="Email o número de celular"
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
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Enviar solicitud</span>
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

export default RecuperarPassword;
