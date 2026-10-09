import { FaMagnifyingGlass, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

// Barra de búsqueda y filtros. Los filtros se describen como datos para que
// cada pestaña declare los suyos sin repetir el marcado.
export function ControlesLista({ buscar, onBuscar, placeholder = 'Buscar...', filtros = [], total, etiquetaTotal }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
      {typeof total === 'number' && (
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">
          {total} {etiquetaTotal || (total === 1 ? 'resultado' : 'resultados')}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 lg:ml-auto">
        <div className="relative">
          <FaMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
            aria-hidden="true"
          />
          <input
            type="search"
            value={buscar}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-dorado focus:outline-none w-full sm:w-60"
          />
        </div>

        {filtros.map((f) => (
          <select
            key={f.clave}
            value={f.valor}
            onChange={(e) => f.onChange(e.target.value)}
            aria-label={f.etiqueta}
            className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:border-dorado focus:outline-none"
          >
            {f.opciones.map((o) => (
              <option key={o.valor} value={o.valor}>{o.texto}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

export function Paginacion({ pagina, totalPaginas, onCambiar, cargando }) {
  if (totalPaginas <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100"
      aria-label="Paginación"
    >
      <button
        type="button"
        disabled={pagina <= 1 || cargando}
        onClick={() => onCambiar(pagina - 1)}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-gray-100 text-gray-500 hover:bg-dorado/20 hover:text-negro-barber transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronLeft aria-hidden="true" /> Anterior
      </button>

      <span className="text-xs text-gray-400 font-bold" aria-live="polite">
        Página {pagina} de {totalPaginas}
      </span>

      <button
        type="button"
        disabled={pagina >= totalPaginas || cargando}
        onClick={() => onCambiar(pagina + 1)}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-gray-100 text-gray-500 hover:bg-dorado/20 hover:text-negro-barber transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Siguiente <FaChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}

export function EstadoLista({ cargando, error, vacio, mensajeVacio = 'No hay resultados.' }) {
  if (cargando) {
    return (
      <div className="flex justify-center py-16">
        <div
          className="w-8 h-8 border-4 border-gray-200 border-t-dorado rounded-full animate-spin"
          role="status"
          aria-label="Cargando"
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-12 font-bold text-sm">{error}</p>;
  }

  if (vacio) {
    return <p className="text-center text-gray-400 py-12">{mensajeVacio}</p>;
  }

  return null;
}
