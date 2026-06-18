import { Link } from 'react-router-dom';
import { FaArrowLeft, FaScissors } from 'react-icons/fa6';

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
  { img: img1, tag: 'Fade Clásico',         num: '01', col: '1/3', row: '1/3', objPos: '50% 55%' },
  { img: img2, tag: 'Corte Texturizado',     num: '02', col: '3/4', row: '1/2', objPos: '50% 38%' },
  { img: img3, tag: 'Corte Clásico',         num: '03', col: '3/4', row: '2/3', objPos: '65% 68%' },
  { img: img4, tag: 'Rizado Fade',           num: '04', col: '1/2', row: '3/4', objPos: '50% 32%' },
  { img: img5, tag: 'Slick Back + Barba',    num: '05', col: '2/3', row: '3/5', objPos: '50% 28%' },
  { img: img6, tag: 'Bowl Fade',             num: '06', col: '3/4', row: '3/4', objPos: '50% 62%' },
  { img: img7, tag: 'Pompadour Fade',        num: '07', col: '1/2', row: '4/5', objPos: '50% 28%' },
  { img: img8, tag: 'Ondas Texturizadas',    num: '08', col: '3/4', row: '4/5', objPos: '50% 33%' },
  { img: img9, tag: 'Corte Limpio',          num: '09', col: '1/4', row: '5/6', objPos: '50% 28%' },
];

const stats = [
  { num: '100%', label: 'Satisfacción' },
  { num: '4.8 ★',  label: 'Calificación' },
  { num: '100%', label: 'Dedicación' },
];

function GalleryItem({ img, tag, num, objPos = '50% 40%' }) {
  return (
    <div className="relative group overflow-hidden rounded-xl bg-gray-900 w-full h-full cursor-pointer">
      <img
        src={img}
        alt={tag}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ objectPosition: objPos }}
      />

      {/* Number badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-xs font-black text-white/60 tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
          {num}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
          <div className="w-6 h-0.5 bg-dorado mb-2" />
          <span className="text-white font-bold text-sm sm:text-base tracking-wide">
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}

function Portafolio() {
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

      {/* ── Gallery ── */}
      <div className="px-3 sm:px-5 lg:px-8 max-w-7xl mx-auto">

        {/* Mobile (2-col simple grid) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
          {trabajos.map((item) => (
            <div
              key={item.num}
              className={`h-48 sm:h-64 rounded-xl overflow-hidden ${item.num === '09' ? 'col-span-2 h-44 sm:h-56' : ''}`}
            >
              <GalleryItem img={item.img} tag={item.tag} num={item.num} objPos={item.objPos} />
            </div>
          ))}
        </div>

        {/* Desktop bento grid (3-col) */}
        <div
          className="hidden lg:grid lg:grid-cols-3 gap-3"
          style={{ gridAutoRows: '310px' }}
        >
          {trabajos.map((item) => (
            <div
              key={item.num}
              style={{ gridColumn: item.col, gridRow: item.row }}
            >
              <GalleryItem img={item.img} tag={item.tag} num={item.num} objPos={item.objPos} />
            </div>
          ))}
        </div>
      </div>

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

    </div>
  );
}

export default Portafolio;
