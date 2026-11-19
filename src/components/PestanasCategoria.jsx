// Pestañas "Todos · Cortes · Barba…" sobre una lista de servicios o productos.
// Sólo aparecen cuando hay al menos dos categorías: con una sola no ayudan.

function PestanasCategoria({ categorias, activa, onCambiar, etiqueta }) {
  if (categorias.length < 2) return null;

  const opciones = [{ valor: '', texto: 'Todos' }, ...categorias.map((c) => ({ valor: c, texto: c }))];

  return (
    <div className="flex justify-center mb-10">
      <div
        role="tablist"
        aria-label={etiqueta}
        className="flex max-w-full gap-1 overflow-x-auto rounded-full border-2 border-marron bg-beige-claro p-1"
      >
        {opciones.map(({ valor, texto }) => {
          const seleccionada = activa === valor;
          return (
            <button
              key={texto}
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
    </div>
  );
}

export default PestanasCategoria;
