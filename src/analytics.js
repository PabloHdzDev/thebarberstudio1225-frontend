// Seguimiento de conversiones de Google Ads.
// La etiqueta global (gtag.js) se carga desde index.html.

const CONVERSION_ID = 'AW-18409833995';

// Etiqueta de la acción de conversión "reserva de cita".
// Se obtiene en Google Ads > Herramientas > Conversiones > (tu acción) >
// "Fragmento de evento", dentro de send_to: 'AW-18409833995/AQUI_VA_LA_ETIQUETA'
const CONVERSION_LABEL = '';

// Registra una cita agendada con éxito.
// No hace nada si falta la etiqueta o si gtag fue bloqueado por el navegador,
// para que un fallo de tracking nunca rompa el flujo de reserva.
export const registrarReservaCita = ({ valor, moneda = 'MXN' } = {}) => {
  if (!CONVERSION_LABEL) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  try {
    window.gtag('event', 'conversion', {
      send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}`,
      value: valor,
      currency: moneda,
    });
  } catch (error) {
    console.error('No se pudo registrar la conversión:', error);
  }
};
