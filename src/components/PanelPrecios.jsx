import { useState } from 'react';
import { FaX, FaCalendarDay } from 'react-icons/fa6';
import api from '../api';
import { tieneCambioProgramado, fechaLarga, fechaParaInput } from '../utils/catalogo';

const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

// Cambia los precios de varios servicios a la vez. Con fecha, el cambio queda
// programado: el sitio avisa a los clientes y ese día el precio nuevo entra
// solo. Sin fecha, se aplica en ese momento.
function PanelPrecios({ servicios, onCerrar, onGuardado }) {
  const programado = servicios.find(tieneCambioProgramado);

  const [desde, setDesde] = useState(() => (programado ? fechaParaInput(programado.precioNuevoDesde) : ''));
  // Lo que ya estaba programado aparece escrito para poder cambiarlo o borrarlo
  const [iniciales] = useState(() => Object.fromEntries(
    servicios.map((s) => [s._id, tieneCambioProgramado(s) ? String(s.precioNuevo) : '']),
  ));
  const [precios, setPrecios] = useState(iniciales);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const enFuturo = Boolean(desde && desde > hoy());
  const escritos = servicios.filter((s) => precios[s._id] !== '');

  const guardar = async () => {
    setError('');
    // Se mandan los que tienen precio (con la fecha de arriba) y los que se borraron
    const cambios = servicios
      .filter((s) => precios[s._id] !== '' || iniciales[s._id] !== '')
      .map((s) => ({ id: s._id, precioNuevo: precios[s._id] === '' ? null : Number(precios[s._id]) }));

    if (!cambios.length) {
      setError('Escribe el precio nuevo en al menos un servicio.');
      return;
    }
    if (cambios.some((c) => c.precioNuevo !== null && !(c.precioNuevo > 0))) {
      setError('Los precios deben ser números mayores a cero.');
      return;
    }
    if (!enFuturo && escritos.length && !window.confirm(
      `Los ${escritos.length} precios nuevos se aplicarán ahora mismo en la página. ¿Continuar?`,
    )) return;

    setGuardando(true);
    try {
      const res = await api.put('/servicios/precios', { desde: enFuturo ? desde : '', cambios });
      onGuardado(res.data.mensaje);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudieron guardar los precios.');
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-negro-barber/90 backdrop-blur-md z-100 flex items-center justify-center p-2 sm:p-4" role="dialog" aria-modal="true" aria-label="Cambiar precios">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] flex flex-col rounded-4xl shadow-2xl overflow-hidden">
        <div className="bg-negro-barber p-6 md:p-8 flex justify-between items-center border-b-4 border-dorado shrink-0">
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-lg md:text-xl">Cambiar precios</h2>
            <p className="text-gray-400 text-xs mt-1">Escribe el precio nuevo sólo en los servicios que cambian.</p>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar" className="text-white hover:text-dorado transition text-2xl"><FaX /></button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="bg-dorado/10 border border-dorado/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="precios-desde" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-negro-barber shrink-0">
              <FaCalendarDay className="text-dorado" /> A partir del
            </label>
            <input
              id="precios-desde"
              type="date"
              min={hoy()}
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-bold text-sm"
            />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {enFuturo
                ? `Hasta el ${fechaLarga(`${desde}T12:00:00-06:00`)} el sitio avisa del cambio; ese día entra solo.`
                : 'Sin fecha, los precios cambian en cuanto guardes.'}
            </p>
          </div>

          <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Servicio</span>
              <span className="w-16 text-right">Actual</span>
              <span className="w-28">Nuevo</span>
            </div>
            {servicios.map((s) => (
              <div key={s._id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-2.5 border-t border-gray-50">
                <span className="text-sm font-bold text-negro-barber min-w-0">
                  {s.nombre}
                  {s.activo === false && <span className="ml-2 text-[9px] font-black uppercase text-red-400">oculto</span>}
                </span>
                <span className="w-16 text-right text-sm font-black text-gray-500">${s.precio}</span>
                <div className="relative w-28">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    aria-label={`Precio nuevo de ${s.nombre}`}
                    value={precios[s._id]}
                    onChange={(e) => setPrecios({ ...precios, [s._id]: e.target.value })}
                    placeholder="—"
                    className="w-full pl-7 pr-2 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-dorado focus:outline-none font-black text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-xs font-bold text-red-700 bg-red-50 rounded-xl p-3" role="alert">{error}</p>}
        </div>

        <div className="shrink-0 border-t border-gray-100 px-6 md:px-8 py-4 flex items-center gap-3">
          <button type="button" onClick={onCerrar} className="px-5 py-3.5 text-sm font-black text-gray-400 hover:text-negro-barber transition">
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="flex-1 bg-negro-barber text-dorado py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-dorado hover:text-negro-barber transition-all disabled:opacity-50"
          >
            {guardando ? 'Guardando…' : enFuturo ? 'Programar cambios' : 'Aplicar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PanelPrecios;
