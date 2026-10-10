import { useState, useMemo } from 'react';
import { FaMagnifyingGlass, FaCheck, FaUser, FaGift } from 'react-icons/fa6';

const NIVELES = {
  nuevo:     { label: 'Nuevo',     color: 'bg-gray-100 text-gray-500' },
  regular:   { label: 'Regular',   color: 'bg-blue-100 text-blue-700' },
  frecuente: { label: 'Frecuente', color: 'bg-amber-100 text-amber-700' },
  vip:       { label: 'VIP',       color: 'bg-yellow-400 text-black' },
};

// Selector de cliente con búsqueda. Sustituye a la lista desplegable, que con
// decenas de clientes obligaba a recorrerla entera para encontrar a alguien.
function SelectorCliente({ usuarios, valor, onSeleccionar }) {
  const [buscar, setBuscar] = useState('');

  const elegido = useMemo(
    () => usuarios.find((u) => u._id === valor),
    [usuarios, valor]
  );

  const coincidencias = useMemo(() => {
    const texto = buscar.trim().toLowerCase();
    if (!texto) return usuarios.slice(0, 6);
    return usuarios
      .filter((u) =>
        (u.nombre || '').toLowerCase().includes(texto) ||
        (u.whatsapp || '').includes(texto) ||
        (u.email || '').toLowerCase().includes(texto))
      .slice(0, 8);
  }, [usuarios, buscar]);

  // Ya hay cliente elegido: se muestra la ficha en vez del buscador
  if (elegido) {
    const nivel = NIVELES[elegido.nivel] || NIVELES.nuevo;
    return (
      <div>
        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
          Cliente
        </label>
        <div className="mt-1 flex items-center gap-3 p-4 bg-dorado/10 border-2 border-dorado rounded-xl">
          <div className="w-11 h-11 rounded-full bg-dorado/25 flex items-center justify-center text-dorado font-black shrink-0">
            {elegido.nombre.charAt(0).toUpperCase()}
          </div>

          {/* El nivel va debajo del nombre: en el panel lateral, con la
              etiqueta y el botón a la derecha, el nombre se partía a media palabra */}
          <div className="flex-1 min-w-0">
            <p className="font-black text-negro-barber flex items-center gap-2">
              <span className="line-clamp-2 wrap-break-word min-w-0">{elegido.nombre}</span>
              {elegido.premioPendiente && (
                <FaGift className="text-dorado text-xs shrink-0" title="Tiene premio disponible" />
              )}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${nivel.color}`}>
                {nivel.label}
              </span>
              <span>{elegido.whatsapp} · {elegido.totalVisitas || 0} visitas</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => { onSeleccionar(''); setBuscar(''); }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-negro-barber border border-gray-300 px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="buscar-cliente" className="text-xs font-black uppercase text-gray-400 tracking-widest">
        Buscar cliente
      </label>

      <div className="relative mt-1">
        <FaMagnifyingGlass
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          aria-hidden="true"
        />
        <input
          id="buscar-cliente"
          type="text"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Escribe un nombre o número..."
          autoComplete="off"
          className="w-full pl-11 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold"
        />
      </div>

      <div className="mt-2 border-2 border-gray-100 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
        {coincidencias.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6 px-4">
            Nadie coincide con “{buscar}”. Si es cliente nuevo, marca la casilla de arriba.
          </p>
        ) : (
          coincidencias.map((u) => {
            const nivel = NIVELES[u.nivel] || NIVELES.nuevo;
            return (
              <button
                key={u._id}
                type="button"
                onClick={() => onSeleccionar(u._id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-dorado/10 transition-colors border-b border-gray-50 last:border-0 focus:outline-none focus-visible:bg-dorado/20"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-black text-sm shrink-0">
                  {u.nombre.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-negro-barber text-sm leading-snug flex items-center gap-1.5">
                    <span className="line-clamp-2 wrap-break-word min-w-0">{u.nombre}</span>
                    {u.premioPendiente && <FaGift className="text-dorado text-[10px] shrink-0" />}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{u.whatsapp}</p>
                </div>

                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${nivel.color}`}>
                  {nivel.label}
                </span>

                <FaCheck className="hidden sm:block text-gray-200 text-xs shrink-0" aria-hidden="true" />
              </button>
            );
          })
        )}
      </div>

      {!buscar && usuarios.length > 6 && (
        <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
          <FaUser className="text-[10px]" aria-hidden="true" />
          Mostrando 6 de {usuarios.length}. Escribe para buscar entre todos.
        </p>
      )}
    </div>
  );
}

export default SelectorCliente;
