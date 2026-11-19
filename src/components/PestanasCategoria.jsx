import { useEffect, useRef, useState } from 'react';

// Pestañas "Todos · Cortes · Barba…" sobre una lista de servicios o productos.
// Sólo aparecen cuando hay al menos dos categorías: con una sola no ayudan.
//
// En pantallas chicas no caben todas, así que la tira se recorre de lado. Para
// que eso se note: la elegida se acomoda al centro y las orillas se difuminan
// mientras quede algo por ver hacia ese lado.
function PestanasCategoria({ categorias, activa, onCambiar, etiqueta }) {
  const tira = useRef(null);
  const botones = useRef({});
  const [orillas, setOrillas] = useState({ izq: false, der: false });

  // Degradados: sólo del lado donde todavía hay pestañas escondidas
  useEffect(() => {
    const elemento = tira.current;
    if (!elemento) return;

    const revisar = () => {
      const sobra = elemento.scrollWidth - elemento.clientWidth;
      setOrillas({
        izq: elemento.scrollLeft > 4,
        der: elemento.scrollLeft < sobra - 4,
      });
    };

    // El observador avisa al empezar y cada vez que cambia el ancho
    const observador = new ResizeObserver(revisar);
    observador.observe(elemento);
    elemento.addEventListener('scroll', revisar, { passive: true });
    return () => {
      observador.disconnect();
      elemento.removeEventListener('scroll', revisar);
    };
  }, [categorias.length]);

  // Centra la pestaña elegida. En los extremos el navegador la deja pegada a
  // su orilla, que es justo lo que se quiere: la primera y la última no se
  // centran, pero las de en medio sí.
  useEffect(() => {
    const elemento = tira.current;
    const boton = botones.current[activa];
    if (!elemento || !boton) return;

    const cajaTira = elemento.getBoundingClientRect();
    const cajaBoton = boton.getBoundingClientRect();
    const destino = elemento.scrollLeft
      + (cajaBoton.left - cajaTira.left)
      - (cajaTira.width - cajaBoton.width) / 2;

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    elemento.scrollTo({ left: destino, behavior: sinMovimiento ? 'auto' : 'smooth' });
  }, [activa]);

  if (categorias.length < 2) return null;

  const opciones = [{ valor: '', texto: 'Todos' }, ...categorias.map((c) => ({ valor: c, texto: c }))];

  return (
    <div className="flex justify-center mb-10">
      <div className="relative max-w-full rounded-full border-2 border-marron bg-beige p-1">
        <div
          ref={tira}
          role="tablist"
          aria-label={etiqueta}
          className="flex gap-1 overflow-x-auto sin-barra-scroll"
        >
          {opciones.map(({ valor, texto }) => {
            const seleccionada = activa === valor;
            return (
              <button
                key={texto}
                ref={(el) => { botones.current[valor] = el; }}
                type="button"
                role="tab"
                aria-selected={seleccionada}
                onClick={() => onCambiar(valor)}
                className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-extrabold transition-colors ${
                  seleccionada ? 'bg-marron text-beige shadow-sm' : 'text-marron hover:bg-arena/60'
                }`}
              >
                {texto}
              </button>
            );
          })}
        </div>

        <span
          aria-hidden="true"
          className={`difuminado-izq pointer-events-none absolute inset-y-1 left-1 w-10 rounded-l-full transition-opacity duration-200 ${
            orillas.izq ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <span
          aria-hidden="true"
          className={`difuminado-der pointer-events-none absolute inset-y-1 right-1 w-10 rounded-r-full transition-opacity duration-200 ${
            orillas.der ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
}

export default PestanasCategoria;
