import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// --- ESTA ES LA MAGIA ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Si hay un token, se lo pegamos a la petición
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Si el token venció o el barbero bloqueó la cuenta, el backend responde 401.
// Sin esto, la pantalla seguiría mostrando la sesión activa hasta que algo truene.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const ruta = error.config?.url || '';
    // En login y registro un 401 es "credenciales incorrectas", no sesión vencida
    const esAutenticacion = ruta.includes('/auth/login') || ruta.includes('/auth/registro');
    const habiaSesion = Boolean(localStorage.getItem('token'));

    if (error.response?.status === 401 && habiaSesion && !esAutenticacion) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;