import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import api from '../api';

// Página a la que lleva el enlace del correo "Confirma tu correo"
function VerificarCorreo() {
  const { token } = useParams();
  const [estado, setEstado] = useState({ tipo: 'cargando', mensaje: '' });
  // En desarrollo React monta el efecto dos veces y el enlace sólo sirve una
  // vez: la segunda vuelta reutiliza la misma petición en lugar de repetirla
  const peticion = useRef(null);

  useEffect(() => {
    if (peticion.current?.token !== token) {
      peticion.current = { token, promesa: api.post(`/auth/verificar-correo/${token}`) };
    }
    let vigente = true;
    peticion.current.promesa
      .then((res) => {
        if (vigente) setEstado({ tipo: 'ok', mensaje: res.data.mensaje });
      })
      .catch((err) => {
        if (vigente) {
          setEstado({
            tipo: 'error',
            mensaje: err.response?.data?.mensaje || 'No pudimos confirmar tu correo. Intenta de nuevo más tarde.',
          });
        }
      });
    return () => { vigente = false; };
  }, [token]);

  const conSesion = Boolean(localStorage.getItem('token'));
  const destino = conSesion
    ? { to: '/perfil', texto: 'Ir a mis citas' }
    : { to: '/login', texto: 'Iniciar sesión' };

  return (
    <div className="min-h-screen bg-negro-barber flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white">
        <div className="bg-negro-barber p-10 text-center border-b-4 border-dorado">
          <h1 className="text-white text-3xl font-black tracking-tighter">
            CONFIRMAR <span className="text-dorado">CORREO</span>
          </h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em]">
            The Barber Studio 1225
          </p>
        </div>

        <div className="p-8 text-center">
          {estado.tipo === 'cargando' ? (
            <div className="py-6" role="status">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-dorado rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-bold">Confirmando tu correo…</p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
                estado.tipo === 'ok' ? 'bg-green-50' : 'bg-amber-50'
              }`}>
                {estado.tipo === 'ok'
                  ? <FaCircleCheck className="text-green-500 text-3xl" />
                  : <FaCircleExclamation className="text-amber-500 text-3xl" />}
              </div>
              <h2 className="text-negro-barber font-black text-lg mb-3">
                {estado.tipo === 'ok' ? '¡Correo confirmado!' : 'No se pudo confirmar'}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{estado.mensaje}</p>
              <Link
                to={destino.to}
                className="inline-block w-full bg-negro-barber text-white font-black py-4 rounded-xl hover:bg-gris-oscuro transition-all uppercase tracking-widest text-sm"
              >
                {destino.texto}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerificarCorreo;
