import { useEffect, useRef } from 'react';

// Nieve cayendo, dibujada en un solo lienzo para que no pese en celulares.
//
// Los copos se dibujan a mano con sus seis brazos y sus ramitas, en vez de usar
// el carácter ❄: así se ven igual en todos los celulares (hay teléfonos que lo
// pintan como emoji azul) y se pueden teñir del color que haga falta.
//
// El fondo del sitio es claro (beige, gris y blanco), así que los copos no son
// blancos: con un azul grisáceo frío se ven tanto sobre el fondo claro como
// sobre la barra negra de arriba.
const COLOR = '164, 186, 208';
const CANTIDAD_MOVIL = 26;
const CANTIDAD_ESCRITORIO = 52;
// Debajo de este tamaño el copo se dibuja como punto: a lo lejos no se
// alcanzarían a ver los brazos y sólo ensuciarían la pantalla
const MINIMO_CON_BRAZOS = 3.6;

const alAzar = (min, max) => min + Math.random() * (max - min);

// Un copo de seis brazos, cada uno con dos ramitas. Se arma todo como un solo
// trazo y se pinta de una vez, que es mucho más rápido que brazo por brazo.
const trazarCopo = (pincel, tamano) => {
  pincel.beginPath();
  for (let brazo = 0; brazo < 6; brazo++) {
    pincel.rotate(Math.PI / 3);
    pincel.moveTo(0, 0);
    pincel.lineTo(0, -tamano);
    pincel.moveTo(0, -tamano * 0.55);
    pincel.lineTo(tamano * 0.32, -tamano * 0.82);
    pincel.moveTo(0, -tamano * 0.55);
    pincel.lineTo(-tamano * 0.32, -tamano * 0.82);
  }
  pincel.stroke();
};

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

    const nuevoCopo = (arriba = false) => {
      const tamano = alAzar(2.4, 9);
      // Entre más grande, más rápido cae y más se nota: da sensación de
      // profundidad, como si unos estuvieran cerca y otros lejos
      const cercania = (tamano - 2.4) / 6.6;
      return {
        x: Math.random() * ancho,
        // Al empezar se reparten por toda la pantalla; después entran por arriba
        y: arriba ? -tamano * 2 : Math.random() * alto,
        tamano,
        velocidad: 13 + cercania * 42 + alAzar(0, 8),
        vaiven: alAzar(6, 20),
        fase: Math.random() * Math.PI * 2,
        giro: Math.random() * Math.PI * 2,
        vueltas: alAzar(-0.5, 0.5),
        opacidad: 0.32 + cercania * 0.45 + alAzar(0, 0.12),
      };
    };

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
      pincel.lineCap = 'round';

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
        copo.giro += copo.vueltas * lapso;
        if (copo.y - copo.tamano > alto) Object.assign(copo, nuevoCopo(true));

        const x = copo.x + Math.sin(copo.fase) * copo.vaiven;
        const color = `rgba(${COLOR}, ${copo.opacidad})`;

        if (copo.tamano < MINIMO_CON_BRAZOS) {
          pincel.beginPath();
          pincel.arc(x, copo.y, copo.tamano * 0.45, 0, Math.PI * 2);
          pincel.fillStyle = color;
          pincel.fill();
          continue;
        }

        // save/restore deja la transformación como estaba para el copo
        // siguiente; girar aquí es lo que hace que el copo dé vueltas al caer
        pincel.save();
        pincel.translate(x, copo.y);
        pincel.rotate(copo.giro);
        pincel.strokeStyle = color;
        pincel.lineWidth = Math.max(0.75, copo.tamano * 0.15);
        trazarCopo(pincel, copo.tamano);
        pincel.restore();
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
