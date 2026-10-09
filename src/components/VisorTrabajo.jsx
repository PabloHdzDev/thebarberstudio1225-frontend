import { useState, useEffect, useCallback } from 'react';
import { FaX } from 'react-icons/fa6';

// Visor que crece desde la miniatura hasta el centro de la pantalla.
// Parte de las medidas exactas de la tarjeta que se tocó (su rectángulo) y
// anima hacia la posición final, así la imagen parece la misma que creció en
// vez de aparecer de la nada.
function VisorTrabajo({ trabajo, rect, onCerrar }) {
  const [abierto, setAbierto] = useState(false);

  // El primer render debe pintar la imagen en el lugar de la miniatura; sólo
  // en el siguiente fotograma se activa el estado final para que haya
  // transición y no un salto.
  useEffect(() => {
    const id = requestAnimationFrame(() => setAbierto(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Al cerrar se recorre el camino inverso antes de desmontar
  const cerrar = useCallback(() => {
    setAbierto(false);
    setTimeout(onCerrar, 380);
  }, [onCerrar]);

  useEffect(() => {
    const porTecla = (e) => { if (e.key === 'Escape') cerrar(); };
    window.addEventListener('keydown', porTecla);
    // Se bloquea el scroll de fondo mientras el visor está abierto
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', porTecla);
      document.body.style.overflow = previo;
    };
  }, [cerrar]);

  const origen = rect || { top: 0, left: 0, width: 0, height: 0 };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={trabajo.tag}
      onClick={cerrar}
    >
      {/* Fondo que se funde al mismo ritmo que crece la imagen */}
      <div
        className="absolute inset-0 bg-negro-barber/95 backdrop-blur-sm transition-opacity duration-400"
        style={{ opacity: abierto ? 1 : 0 }}
      />

      <button
        onClick={cerrar}
        aria-label="Cerrar"
        className="absolute top-6 right-6 z-10 text-beige/60 hover:text-dorado text-2xl transition-colors"
        style={{ opacity: abierto ? 1 : 0, transition: 'opacity 300ms ease 150ms' }}
      >
        <FaX />
      </button>

      <img
        src={trabajo.img}
        alt={trabajo.tag}
        onClick={(e) => e.stopPropagation()}
        className="shadow-2xl object-cover"
        style={{
          position: 'fixed',
          objectPosition: trabajo.objPos,
          top: abierto ? '50%' : `${origen.top}px`,
          left: abierto ? '50%' : `${origen.left}px`,
          width: abierto ? 'auto' : `${origen.width}px`,
          height: abierto ? '72vh' : `${origen.height}px`,
          transform: abierto ? 'translate(-50%, -52%)' : 'none',
          transition: 'top 420ms cubic-bezier(0.22, 1, 0.36, 1), left 420ms cubic-bezier(0.22, 1, 0.36, 1), width 420ms cubic-bezier(0.22, 1, 0.36, 1), height 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      <figcaption
        className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
        style={{
          opacity: abierto ? 1 : 0,
          transform: abierto ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 300ms ease 220ms, transform 300ms ease 220ms',
        }}
      >
        <span className="text-dorado text-[10px] font-black tracking-[0.3em] block mb-1">
          {trabajo.num}
        </span>
        <span className="text-beige font-bold tracking-wide">{trabajo.tag}</span>
      </figcaption>
    </div>
  );
}

export default VisorTrabajo;
