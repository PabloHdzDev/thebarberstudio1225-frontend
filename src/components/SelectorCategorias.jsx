import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

// Marca en qué pestañas aparece un servicio o producto. Puede estar en varias:
// "Corte + Barba" puede salir en "Cortes" y en "Combos".
function SelectorCategorias({ valor, existentes, onCambiar, ejemplo }) {
  const [nueva, setNueva] = useState('');

  const incluida = (c) => valor.some((x) => x.toLowerCase() === c.toLowerCase());

  const alternar = (c) => onCambiar(
    incluida(c) ? valor.filter((x) => x.toLowerCase() !== c.toLowerCase()) : [...valor, c],
  );

  const agregar = () => {
    const limpia = nueva.trim().replace(/\s+/g, ' ');
    if (limpia && !incluida(limpia)) onCambiar([...valor, limpia]);
    setNueva('');
  };

  // Las que ya existen en el catálogo más las de este elemento
  const opciones = [...new Set([...existentes, ...valor])];

  return (
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex flex-wrap items-center justify-between gap-1">
        Categorías
        <span className="text-gray-300 font-normal normal-case tracking-normal">
          puede estar en varias; sin ninguna sale sólo en "Todos"
        </span>
      </p>

      {opciones.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {opciones.map((c) => {
            const activa = incluida(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => alternar(c)}
                aria-pressed={activa}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-colors border-2 ${
                  activa
                    ? 'bg-dorado border-dorado text-negro-barber'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-dorado'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          // Enter agrega la categoría; sin esto enviaría el formulario entero
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar(); } }}
          placeholder={ejemplo}
          aria-label="Nueva categoría"
          className="flex-1 min-w-0 p-3 bg-white border border-gray-200 rounded-xl focus:border-dorado focus:ring-1 focus:ring-dorado font-bold outline-none transition-all"
        />
        <button
          type="button"
          onClick={agregar}
          disabled={!nueva.trim()}
          className="px-4 rounded-xl bg-gray-100 text-negro-barber font-black hover:bg-dorado transition-colors disabled:opacity-40 disabled:hover:bg-gray-100"
          aria-label="Agregar categoría"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

export default SelectorCategorias;
