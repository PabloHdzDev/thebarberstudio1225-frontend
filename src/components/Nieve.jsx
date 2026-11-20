import { useEffect, useRef } from 'react';

// Nieve cayendo, dibujada en un solo lienzo para que no pese en celulares.
//
// El fondo del sitio es claro (beige, gris y blanco), así que los copos no son
// blancos: con un azul grisáceo frío se ven tanto sobre el fondo claro como
// sobre la barra negra de arriba.
const COLOR = '164, 186, 208';
const CANTIDAD_MOVIL = 34;
const CANTIDAD_ESCRITORIO = 70;

const alAzar = (min, max) => min + Math.random() * (max - min);

function Nieve() {
  const lienzo = useRef(null);

  useEffect(() => {
    // Si el celular tiene activado "reducir movimiento", no se dibuja nada
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = lienzo.current;
    const pincel = canvas.getContext('2d');
    let copos = [];
    let ancho = 0;
    let alto = 0;
    let animacion = null;
    let ultimo = 0;

    const nuevoCopo = (arriba = false) => ({
      x: Math.random() * ancho,
      // Al empezar se reparten por toda la pantalla; después entran por arriba
      y: arriba ? -10 : Math.random() * alto,
      radio: alAzar(1.2, 3.6),
      // Los más grandes caen más rápido: da sensación de profundidad
      velocidad: alAzar(14, 42),
      vaiven: alAzar(6, 20),
      fase: Math.random() * Math.PI * 2,
      opacidad: alAzar(0.45, 0.9),
    });

    const medir = () => {
      // En pantallas de mucha densidad se dibuja al doble, no más, para no
      // gastar de más
      const densidad = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      canvas.width = ancho * densidad;
      canvas.height = alto * densidad;
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${alto}px`;
      pincel.setTransform(densidad, 0, 0, densidad, 0, 0);

      const cantidad = ancho < 640 ? CANTIDAD_MOVIL : CANTIDAD_ESCRITORIO;
      copos = Array.from({ length: cantidad }, () => nuevoCopo());
    };

    const dibujar = (ahora) => {
      // Segundos desde el cuadro anterior: así cae igual en pantallas de 60 y
      // de 120 cuadros por segundo. Se limita por si la pestaña estuvo quieta.
      const lapso = Math.min((ahora - ultimo) / 1000, 0.05);
      ultimo = ahora;

      pincel.clearRect(0, 0, ancho, alto);
      for (const copo of copos) {
        copo.y += copo.velocidad * lapso;
        copo.fase += lapso;
        const x = copo.x + Math.sin(copo.fase) * copo.vaiven;

        if (copo.y - copo.radio > alto) Object.assign(copo, nuevoCopo(true));

        pincel.beginPath();
        pincel.arc(x, copo.y, copo.radio, 0, Math.PI * 2);
        pincel.fillStyle = `rgba(${COLOR}, ${copo.opacidad})`;
        pincel.fill();
      }
      animacion = requestAnimationFrame(dibujar);
    };

    const arrancar = () => {
      if (animacion) return;
      ultimo = performance.now();
      animacion = requestAnimationFrame(dibujar);
    };

    const detener = () => {
      if (animacion) cancelAnimationFrame(animacion);
      animacion = null;
    };

    // Con la pestaña en segundo plano no tiene caso seguir gastando batería
    const alCambiarVisibilidad = () => (document.hidden ? detener() : arrancar());

    medir();
    arrancar();
    window.addEventListener('resize', medir);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);

    return () => {
      detener();
      window.removeEventListener('resize', medir);
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    };
  }, []);

  return (
    <canvas
      ref={lienzo}
      aria-hidden="true"
      // Fija sobre la página y sin capturar clics: no estorba en nada
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}

export default Nieve;
