// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Portafolio from './pages/Portafolio';
import Auth from './pages/Auth';
import Reservar from './pages/Reservar';
import BarberDashboard from './pages/BarberDashboard';
import UserDashboard from './pages/UserDashboard';
import Blog from './pages/Blog';
import Articulo from './pages/Articulo';
import ScrollToTop from './components/ScrollToTop';

const RutaProtegida = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuario || usuario.rol !== 'barbero') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
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
          
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Articulo />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;