import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaScissors, FaX } from 'react-icons/fa6';
import BandaScroll from '../components/BandaScroll';

import img1 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.07.46 AM.jpeg';
import img2 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.08.19 AM.jpeg';
import img3 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.08.47 AM.jpeg';
import img4 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.10.27 AM.jpeg';
import img5 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.10.27 AM (1).jpeg';
import img6 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.10.27 AM (2).jpeg';
import img7 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.13.19 AM.jpeg';
import img8 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.14.06 AM.jpeg';
import img9 from '../assets/portfolio/WhatsApp Image 2026-06-16 at 8.14.31 AM.jpeg';

const trabajos = [
  { img: img1, tag: 'Fade Clásico',      num: '01', objPos: '50% 55%', ancho: 300, alto: 420, desfase: -30 },
  { img: img2, tag: 'Corte Texturizado', num: '02', objPos: '50% 38%', ancho: 230, alto: 310, desfase:  60 },
  { img: img3, tag: 'Corte Clásico',     num: '03', objPos: '65% 68%', ancho: 340, alto: 470, desfase: -10 },
  { img: img4, tag: 'Rizado Fade',       num: '04', objPos: '50% 32%', ancho: 240, alto: 330, desfase:  80 },
  { img: img5, tag: 'Slick Back + Barba',num: '05', objPos: '50% 28%', ancho: 380, alto: 520, desfase: -50 },
  { img: img6, tag: 'Bowl Fade',         num: '06', objPos: '50% 62%', ancho: 250, alto: 340, desfase:  50 },
  { img: img7, tag: 'Pompadour Fade',    num: '07', objPos: '50% 28%', ancho: 320, alto: 440, desfase: -20 },
  { img: img8, tag: 'Ondas Texturizadas',num: '08', objPos: '50% 33%', ancho: 230, alto: 300, desfase:  70 },
  { img: img9, tag: 'Corte Limpio',      num: '09', objPos: '50% 28%', ancho: 350, alto: 480, desfase: -40 },
];

const stats = [
  { num: '100%', label: 'Satisfacción' },
  { num: '4.8 ★',  label: 'Calificación' },
  { num: '100%', label: 'Dedicación' },
];

function Portafolio() {
  const [ampliada, setAmpliada] = useState(null);

  return (
    <div className="min-h-screen bg-negro-barber">

      {/* ── Header ── */}
      <div className="pt-16 pb-10 px-4 text-center">
        <p className="text-camel tracking-[0.5em] text-xs uppercase mb-6 font-medium">
          Barber Imperio
        </p>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
          NUESTRO
        </h1>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-dorado leading-none tracking-tighter mb-8">
          TRABAJO
        </h1>
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="h-px w-12 sm:w-24 bg-dorado/40" />
          <FaScissors className="text-dorado text-sm rotate-45" />
          <div className="h-px w-12 sm:w-24 bg-dorado/40" />
        </div>
        <p className="text-gray-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
          Cada corte es una obra de arte. Precisión, estilo y carácter en cada servicio.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-sm sm:max-w-lg mx-auto px-4 mb-14 grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="text-center border border-gray-800 rounded-xl py-4 px-2">
            <div className="text-xl sm:text-2xl font-black text-dorado mb-1">{s.num}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 tracking-widest uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Banda horizontal con scroll ── */}
      <BandaScroll trabajos={trabajos} onSeleccionar={setAmpliada} />

      {/* ── CTA ── */}
      <div className="text-center py-16 px-4">
        <p className="text-gray-600 text-xs tracking-[0.4em] uppercase mb-5">
          ¿Listo para tu cambio?
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-dorado text-negro-barber font-black px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-dorado-hover transition-colors duration-300"
        >
          AGENDA TU CITA
        </Link>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 text-xs hover:text-dorado transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Volver al inicio
          </Link>
        </div>
      </div>

      {/* ── Visor ── */}
      {ampliada && (
        <div
          className="fixed inset-0 z-100 bg-negro-barber/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAmpliada(null)}
          role="dialog"
          aria-modal="true"
          aria-label={ampliada.tag}
        >
          <button
            onClick={() => setAmpliada(null)}
            aria-label="Cerrar"
            className="absolute top-6 right-6 text-beige/60 hover:text-dorado text-2xl transition-colors"
          >
            <FaX />
          </button>

          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={ampliada.img}
              alt={ampliada.tag}
              className="max-h-[75vh] w-auto rounded-2xl shadow-2xl"
              style={{ objectPosition: ampliada.objPos }}
            />
            <figcaption className="text-center mt-5">
              <span className="text-dorado text-[10px] font-black tracking-[0.3em] block mb-1">
                {ampliada.num}
              </span>
              <span className="text-beige font-bold tracking-wide">{ampliada.tag}</span>
            </figcaption>
          </figure>
        </div>
      )}

    </div>
  );
}

export default Portafolio;
