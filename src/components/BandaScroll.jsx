import { useRef, useState, useEffect } from 'react';

// Banda horizontal de imágenes que avanza con el scroll vertical.
// La sección queda fija mientras dura el recorrido; cuando termina, la página
// sigue su curso normal. Cada imagen lleva su propia altura y desfase vertical
// para que la fila no se lea como una cuadrícula.
function BandaScroll({ trabajos, onSeleccionar }) {
  const seccion = useRef(null);
  const pista = useRef(null);
  const [avance, setAvance] = useState(0);
  const [reducido, setReducido] = useState(false);
  // Se mide en el efecto, no durante el render: ahí el ref todavía es null
  const [desplazamiento, setDesplazamiento] = useState(0);

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => setReducido(consulta.matches);
    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => consulta.removeEventListener('change', aplicar);
  }, []);

  useEffect(() => {
    if (reducido) return;

    let pendiente = false;

    const medir = () => {
      pendiente = false;
      const nodo = seccion.current;
      if (!nodo) return;

      // Cuánto hay que correr la pista para que se vea completa
      if (pista.current) {
        const sobrante = pista.current.scrollWidth - window.innerWidth + 64;
        setDesplazamiento(Math.max(sobrante, 0));
      }

      const { top, height } = nodo.getBoundingClientRect();
      const recorrido = height - window.innerHeight;
      if (recorrido <= 0) return;

      // 0 cuando la sección toca el borde superior, 1 cuando termina
      setAvance(Math.min(Math.max(-top / recorrido, 0), 1));
    };

    // El scroll dispara muy seguido; se agrupa en el siguiente fotograma
    const alHacerScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(medir);
    };

    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('resize', alHacerScroll);
    medir();

    return () => {
      window.removeEventListener('scroll', alHacerScroll);
      window.removeEventListener('resize', alHacerScroll);
    };
  }, [reducido]);

  return (
    <section
      ref={seccion}
      // La altura extra es la que da margen de scroll al recorrido horizontal
      className="relative"
      style={{ height: reducido ? 'auto' : '320vh' }}
      aria-label="Galería de trabajos"
    >
      <div
        className={`${reducido ? '' : 'sticky top-0'} h-screen flex flex-col justify-center overflow-hidden`}
      >
        <div
          ref={pista}
          className="flex items-center gap-6 md:gap-10 px-8 md:px-16 will-change-transform"
          style={{
            transform: reducido ? 'none' : `translate3d(-${avance * desplazamiento}px, 0, 0)`,
            transition: 'transform 120ms linear',
            // Sin reducción de movimiento la pista no debe cortarse
            width: reducido ? '100%' : 'max-content',
            flexWrap: reducido ? 'wrap' : 'nowrap',
            justifyContent: reducido ? 'center' : 'flex-start',
          }}
        >
          {trabajos.map((t, i) => (
            <button
              key={t.num}
              type="button"
              onClick={() => onSeleccionar?.(t)}
              aria-label={`Ver ${t.tag} en grande`}
              className="group relative shrink-0 overflow-hidden rounded-2xl bg-negro-suave focus:outline-none focus-visible:ring-4 focus-visible:ring-dorado"
              style={{
                width: t.ancho,
                height: t.alto,
                // El desfase vertical es lo que rompe la línea recta
                transform: reducido ? 'none' : `translateY(${t.desfase}px)`,
              }}
            >
              <img
                src={t.img}
                alt={t.tag}
                loading={i < 3 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: t.objPos }}
              />

              {/* El velo se abre al pasar el cursor y deja leer el nombre */}
              <div className="absolute inset-0 bg-gradient-to-t from-negro-barber/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="absolute top-4 left-4 text-[10px] font-black tracking-[0.2em] text-dorado/80">
                {t.num}
              </span>

              <span className="absolute bottom-4 left-4 right-4 text-left text-beige font-bold text-sm md:text-base translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {t.tag}
              </span>
            </button>
          ))}
        </div>

        {!reducido && (
          <>
            {/* Barra de avance del recorrido */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-[3px] bg-beige/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-dorado rounded-full"
                style={{ width: `${avance * 100}%` }}
              />
            </div>

            <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-beige/40 whitespace-nowrap">
              {avance > 0.95 ? 'Fin del recorrido' : 'Desliza para recorrer'}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default BandaScroll;
