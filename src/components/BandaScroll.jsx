import { useRef, useState, useEffect } from 'react';

// Galería de trabajos con dos comportamientos según el dispositivo:
//
//  · En escritorio la sección se queda fija y el scroll vertical desplaza la
//    banda de lado, con las fotos encogiéndose al ir rápido.
//  · En móvil se usa scroll horizontal nativo. Secuestrar el scroll táctil
//    pelea contra el desplazamiento por inercia del sistema: los eventos
//    llegan a ráfagas y la banda avanza a tirones.
function BandaScroll({ trabajos, onSeleccionar }) {
  const seccion = useRef(null);
  const pista = useRef(null);

  const [avance, setAvance] = useState(0);
  const [desplazamiento, setDesplazamiento] = useState(0);
  const [escala, setEscala] = useState(1);
  // Mientras no se mida el dispositivo se asume el modo simple, que funciona
  // en todos lados
  const [modo, setModo] = useState('simple');
  // Con reducción de movimiento el video no arranca solo
  const [sinMovimiento, setSinMovimiento] = useState(false);

  const ultimaPos = useRef(0);
  const temporizadorParo = useRef(null);
  const velocidadSuave = useRef(0);

  useEffect(() => {
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    // El efecto anclado sólo en pantallas anchas con puntero fino
    const esEscritorio = window.matchMedia('(min-width: 1024px) and (pointer: fine)');

    const decidir = () => {
      setSinMovimiento(reducido.matches);
      setModo(!reducido.matches && esEscritorio.matches ? 'anclado' : 'simple');
    };

    decidir();
    reducido.addEventListener('change', decidir);
    esEscritorio.addEventListener('change', decidir);
    return () => {
      reducido.removeEventListener('change', decidir);
      esEscritorio.removeEventListener('change', decidir);
    };
  }, []);

  useEffect(() => {
    if (modo !== 'anclado') return;

    let pendiente = false;
    // Se guarda el alto de ventana: en móvil cambia al ocultarse la barra del
    // navegador y recalcularlo en cada scroll provoca saltos
    let altoVentana = window.innerHeight;

    const medir = () => {
      pendiente = false;
      const nodo = seccion.current;
      if (!nodo) return;

      if (pista.current) {
        const sobrante = pista.current.scrollWidth - window.innerWidth + 64;
        setDesplazamiento(Math.max(sobrante, 0));
      }

      const y = window.scrollY;
      const velocidad = Math.abs(y - ultimaPos.current);
      ultimaPos.current = y;

      // Promedio ponderado: un tirón suelto apenas mueve la aguja, un
      // desplazamiento sostenido sí la sube
      velocidadSuave.current = velocidadSuave.current * 0.72 + velocidad * 0.28;
      const exceso = Math.max(velocidadSuave.current - 18, 0);
      setEscala(1 - Math.min(exceso / 200, 0.12));

      clearTimeout(temporizadorParo.current);
      temporizadorParo.current = setTimeout(() => {
        velocidadSuave.current = 0;
        setEscala(1);
      }, 140);

      const { top, height } = nodo.getBoundingClientRect();
      const recorrido = height - altoVentana;
      if (recorrido <= 0) return;

      setAvance(Math.min(Math.max(-top / recorrido, 0), 1));
    };

    const alHacerScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(medir);
    };

    const alRedimensionar = () => {
      altoVentana = window.innerHeight;
      alHacerScroll();
    };

    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('resize', alRedimensionar);
    medir();

    return () => {
      window.removeEventListener('scroll', alHacerScroll);
      window.removeEventListener('resize', alRedimensionar);
      clearTimeout(temporizadorParo.current);
    };
  }, [modo]);

  const anclado = modo === 'anclado';

  const tarjetas = trabajos.map((t, i) => (
    <button
      key={t.id}
      type="button"
      onClick={(e) => onSeleccionar?.(t, e.currentTarget.getBoundingClientRect())}
      aria-label={`Ver trabajo ${i + 1} de ${trabajos.length} en grande`}
      className="group relative shrink-0 overflow-hidden bg-negro-suave focus:outline-none focus-visible:ring-4 focus-visible:ring-dorado snap-center"
      style={{
        width: t.ancho,
        height: t.alto,
        transform: anclado ? `scale(${escala})` : 'none',
        transition: anclado ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
      }}
    >
      {t.tipo === 'video' ? (
        // Silenciado y en bucle: así los navegadores permiten la reproducción
        // automática. La portada evita el recuadro negro mientras carga.
        <video
          src={t.video}
          poster={t.img}
          autoPlay={!sinMovimiento}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: t.objPos }}
        />
      ) : (
        <img
          src={t.img}
          alt=""
          loading={i < 3 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: t.objPos }}
        />
      )}
    </button>
  ));

  // ── Móvil y reducción de movimiento: scroll horizontal del sistema ──
  if (!anclado) {
    return (
      <section className="py-6" aria-label="Galería de trabajos">
        <div
          className="flex items-center gap-4 px-6 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {tarjetas}
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-beige/40 mt-2">
          Desliza de lado para ver más
        </p>
      </section>
    );
  }

  // ── Escritorio: la sección se ancla y el scroll la recorre de lado ──
  return (
    <section
      ref={seccion}
      className="relative"
      style={{ height: '320vh' }}
      aria-label="Galería de trabajos"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div
          ref={pista}
          className="flex items-center gap-6 md:gap-10 px-8 md:px-16 will-change-transform"
          style={{
            // Sin transición: el transform debe seguir al scroll exactamente.
            // Animar hacia el destino lo deja siempre un paso atrás y provoca
            // tirones cuando los eventos llegan agrupados.
            transform: `translate3d(-${avance * desplazamiento}px, 0, 0)`,
            width: 'max-content',
          }}
        >
          {tarjetas}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-0.75 bg-beige/15 overflow-hidden">
          <div className="h-full bg-dorado" style={{ width: `${avance * 100}%` }} />
        </div>

        <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-beige/40 whitespace-nowrap">
          {avance > 0.95 ? 'Fin del recorrido' : 'Desliza para recorrer'}
        </p>
      </div>
    </section>
  );
}

export default BandaScroll;
