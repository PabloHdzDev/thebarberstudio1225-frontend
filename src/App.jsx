import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Portafolio from './pages/Portafolio';
import Auth from './pages/Auth';
import Reservar from './pages/Reservar'
import BarberDashboard from './pages/BarberDashboard';
import UserDashboard from './pages/UserDashboard'

const RutaProtegida = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuario || usuario.rol !== 'barbero') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;