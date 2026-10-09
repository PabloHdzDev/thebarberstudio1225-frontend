import { useState, useEffect, useRef } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

// El mapa de Google pesa cientos de KB y trae decenas de cookies de terceros.
// Se monta sólo cuando el usuario se acerca a la sección, no al abrir el sitio.
function MapaDiferido({ src, titulo }) {
  const [visible, setVisible] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo) return;

    // Sin soporte del navegador, se carga directo para no dejar un hueco
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      // Se adelanta 200px para que el mapa ya esté listo al llegar
      { rootMargin: '200px' }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={contenedor} className="w-full h-full">
      {visible ? (
        <iframe
          src={src}
          title={titulo}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-negro-suave text-gray-400">
          <FaLocationDot className="text-2xl" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest">Cargando mapa</span>
        </div>
      )}
    </div>
  );
}

export default MapaDiferido;
