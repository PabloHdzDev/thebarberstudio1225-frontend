import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';

// Maneja el ciclo completo de una lista paginada: página, búsqueda, filtros,
// carga y errores. Cualquier pestaña del panel lo reutiliza pasándole su
// endpoint; la forma de la respuesta del backend es siempre la misma.
export function useListaPaginada(endpoint, opcionesIniciales = {}) {
  const {
    filtrosIniciales = {},
    limite = 12,
    activo = true,
  } = opcionesIniciales;

  const [datos, setDatos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [buscar, setBuscar] = useState('');
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Evita que una respuesta lenta pise a otra más reciente
  const peticionActual = useRef(0);

  const cargar = useCallback(async (pag = 1, texto = buscar, filtrosUsados = filtros) => {
    if (!activo) return;

    const miTurno = ++peticionActual.current;
    setCargando(true);
    setError(null);

    try {
      const params = { pagina: pag, limite, ...filtrosUsados };
      if (texto) params.buscar = texto;

      const res = await api.get(endpoint, { params });
      if (miTurno !== peticionActual.current) return;

      // Acepta tanto la forma paginada como un arreglo simple
      const cuerpo = res.data;
      if (Array.isArray(cuerpo)) {
        setDatos(cuerpo);
        setTotal(cuerpo.length);
        setTotalPaginas(1);
        setPagina(1);
      } else {
        setDatos(cuerpo.datos || []);
        setTotal(cuerpo.total || 0);
        setTotalPaginas(cuerpo.totalPaginas || 1);
        setPagina(cuerpo.pagina || pag);
      }
    } catch (err) {
      if (miTurno !== peticionActual.current) return;
      setError(err.response?.data?.mensaje || 'No se pudo cargar la lista');
      setDatos([]);
    } finally {
      if (miTurno === peticionActual.current) setCargando(false);
    }
  }, [endpoint, limite, activo, buscar, filtros]);

  // La búsqueda espera a que el usuario deje de escribir, para no disparar
  // una petición por cada tecla
  useEffect(() => {
    if (!activo) return;
    const temporizador = setTimeout(() => cargar(1, buscar, filtros), 350);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscar, filtros, activo, endpoint]);

  const cambiarFiltro = (clave, valor) => {
    setFiltros((prev) => ({ ...prev, [clave]: valor }));
  };

  const irAPagina = (nueva) => {
    const destino = Math.min(Math.max(1, nueva), totalPaginas);
    cargar(destino, buscar, filtros);
  };

  // Para refrescar tras crear, editar o borrar sin perder la página actual
  const recargar = () => cargar(pagina, buscar, filtros);

  // Reemplaza un elemento en memoria, sin volver a pedir toda la lista
  const actualizarElemento = (id, nuevo) => {
    setDatos((prev) => prev.map((d) => (d._id === id ? nuevo : d)));
  };

  return {
    datos, total, pagina, totalPaginas,
    buscar, setBuscar,
    filtros, cambiarFiltro,
    cargando, error,
    irAPagina, recargar, actualizarElemento,
  };
}
