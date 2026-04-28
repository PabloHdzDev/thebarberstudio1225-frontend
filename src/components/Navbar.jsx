// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaCircleUser, FaArrowRightFromBracket, FaTableColumns } from 'react-icons/fa6';

function Navbar() {
  const location = useLocation();
  const usuarioJson = localStorage.getItem('usuario');
  const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <nav className="bg-negro-barber border-b border-dorado/20 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-xl">
      <Link to="/" className="text-arena font-black text-lg tracking-tighter">
        THE BARBER STUDIO 1225
      </Link>

      <div className="flex items-center gap-4">
        {usuario && (
          <div className="flex items-center gap-4">
            
            {/* LÓGICA PARA BARBERO */}
            {usuario.rol === 'barbero' && location.pathname !== '/admin' && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 bg-marron text-beige px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-beige hover:text-marron transition-all"
              >
                <FaTableColumns /> Panel Admin
              </Link>
            )}

            {/* LÓGICA PARA CLIENTE (NUEVO) */}
            {usuario.rol === 'cliente' && location.pathname !== '/perfil' && (
              <Link 
                to="/perfil" 
                className="flex items-center gap-2 bg-marron text-beige px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-beige hover:text-marron transition-all"
              >
                <FaCircleUser /> Mis Citas
              </Link>
            )}
            
            {/* Si está en cualquier dashboard, mostrar botón de "Ver Web" */}
            {(location.pathname === '/admin' || location.pathname === '/perfil') && (
              <Link 
                to="/" 
                className="text-marron border border-marron px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest bg-beige hover:bg-marron hover:text-beige transition-all"
              >
                Ver Inicio
              </Link>
            )}

            <div className="h-8 w-px bg-gray-700 mx-2 hidden sm:block"></div>

            <button 
              onClick={cerrarSesion}
              className="text-gray-400 hover:text-dorado transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <span className="hidden sm:inline">Salir</span>
              <FaArrowRightFromBracket />
            </button>
          </div>
        )}

        {!usuario && (
          <Link 
            to="/login" 
            className="text-marron border border-marron px-5 py-2 rounded-full text-xs font-bold bg-beige hover:bg-marron hover:text-beige transition-all uppercase tracking-widest"
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;