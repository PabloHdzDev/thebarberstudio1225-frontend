// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

// El inicio se carga de inmediato: es la puerta de entrada del sitio
import Home from './pages/Home';

// El resto llega sólo cuando se visita su ruta. El panel del barbero arrastra
// socket.io y toda la administración, así que un cliente normal nunca lo baja.
const BarberDashboard = lazy(() => import('./pages/BarberDashboard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Portafolio = lazy(() => import('./pages/Portafolio'));
const Reservar = lazy(() => import('./pages/Reservar'));
const Auth = lazy(() => import('./pages/Auth'));
const RecuperarPassword = lazy(() => import('./pages/RecuperarPassword'));
const RestablecerPassword = lazy(() => import('./pages/RestablecerPassword'));
const Blog = lazy(() => import('./pages/Blog'));
const Articulo = lazy(() => import('./pages/Articulo'));

const RutaProtegida = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || usuario.rol !== 'barbero') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Se muestra mientras llega el código de la ruta
function Cargando() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige">
      <div
        className="w-12 h-12 border-4 border-arena border-t-marron rounded-full animate-spin"
        role="status"
        aria-label="Cargando"
      />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <main id="contenido">
          <Suspense fallback={<Cargando />}>
            <Routes>
              <Route path="/admin" element={
                <RutaProtegida>
                  <BarberDashboard />
                </RutaProtegida>
              } />
              <Route path="/" element={<Home />} />
              <Route path="/perfil" element={<UserDashboard />} />
              <Route path="/portafolio" element={<Portafolio />} />
              <Route path="/reservar/:id" element={<Reservar />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/recuperar" element={<RecuperarPassword />} />
              <Route path="/restablecer/:token" element={<RestablecerPassword />} />

              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Articulo />} />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </HelmetProvider>
  );
}

export default App;
