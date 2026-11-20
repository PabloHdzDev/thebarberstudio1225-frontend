// Temporada navideña: del 21 de noviembre al 6 de enero, con la fecha de
// Guadalajara para que cambie a la medianoche de aquí y no la del navegador.

const DESDE = { mes: 11, dia: 21 };
const HASTA = { mes: 1, dia: 6 };

const fechaEnGuadalajara = (fecha) => fecha.toLocaleDateString('en-CA', {
  timeZone: 'America/Mexico_City',
});

export const esTemporadaNavidad = (fecha = new Date()) => {
  const [, mes, dia] = fechaEnGuadalajara(fecha).split('-').map(Number);
  if (mes === DESDE.mes) return dia >= DESDE.dia;
  if (mes === HASTA.mes) return dia <= HASTA.dia;
  // Los meses entre el inicio y el fin, cruzando el año (diciembre)
  return mes > DESDE.mes || mes < HASTA.mes;
};

// Para verla antes de tiempo: ?navidad=1 la enciende y ?navidad=0 la apaga
export const navidadActiva = () => {
  const forzado = new URLSearchParams(window.location.search).get('navidad');
  if (forzado === '1') return true;
  if (forzado === '0') return false;
  return esTemporadaNavidad();
};
