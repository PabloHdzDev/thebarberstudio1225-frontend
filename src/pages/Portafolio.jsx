import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaScissors } from 'react-icons/fa6';
import BandaScroll from '../components/BandaScroll';
import VisorTrabajo from '../components/VisorTrabajo';

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
  { img: img1, tag: 'Fade Clásico',      num: '01', objPos: '50% 55%', ancho: 300, alto: '56vh' },
  { img: img2, tag: 'Corte Texturizado', num: '02', objPos: '50% 38%', ancho: 230, alto: '41vh' },
  { img: img3, tag: 'Corte Clásico',     num: '03', objPos: '65% 68%', ancho: 340, alto: '62vh' },
  { img: img4, tag: 'Rizado Fade',       num: '04', objPos: '50% 32%', ancho: 240, alto: '44vh' },
  { img: img5, tag: 'Slick Back + Barba',num: '05', objPos: '50% 28%', ancho: 380, alto: '70vh' },
  { img: img6, tag: 'Bowl Fade',         num: '06', objPos: '50% 62%', ancho: 250, alto: '45vh' },
  { img: img7, tag: 'Pompadour Fade',    num: '07', objPos: '50% 28%', ancho: 320, alto: '58vh' },
  { img: img8, tag: 'Ondas Texturizadas',num: '08', objPos: '50% 33%', ancho: 230, alto: '40vh' },
  { img: img9, tag: 'Corte Limpio',      num: '09', objPos: '50% 28%', ancho: 350, alto: '64vh' },
];

const stats = [
  { num: '100%', label: 'Satisfacción' },
  { num: '4.8 ★',  label: 'Calificación' },
  { num: '100%', label: 'Dedicación' },
];

function Portafolio() {
  // Guarda el trabajo y el rectángulo de la tarjeta tocada, para que el visor
  // pueda crecer justo desde ahí
  const [ampliada, setAmpliada] = useState(null);

  return (
    <div className="min-h-screen bg-negro-barber">

      {/* ── Header ── */}
      <div className="pt-12 pb-6 px-4 text-center">
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
      <div className="max-w-sm sm:max-w-lg mx-auto px-4 mb-4 grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="text-center border border-gray-800 rounded-xl py-4 px-2">
            <div className="text-xl sm:text-2xl font-black text-dorado mb-1">{s.num}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 tracking-widest uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Banda horizontal con scroll ── */}
      <BandaScroll
        trabajos={trabajos}
        onSeleccionar={(trabajo, rect) => setAmpliada({ trabajo, rect })}
      />

      {/* ── CTA ── */}
      <div className="text-center py-16 px-4">
        <p className="text-gray-600 text-xs tracking-[0.4em] uppercase mb-5">
          ¿Listo para tu cambio?
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-dorado text-negro-barber font-black px-12 sm:px-16 py-5 sm:py-6 rounded-full text-sm sm:text-base tracking-[0.2em] uppercase hover:bg-dorado-hover hover:scale-105 transition-all duration-300 shadow-xl shadow-dorado/20"
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

      {ampliada && (
        <VisorTrabajo
          trabajo={ampliada.trabajo}
          rect={ampliada.rect}
          onCerrar={() => setAmpliada(null)}
        />
      )}

    </div>
  );
}

export default Portafolio;
