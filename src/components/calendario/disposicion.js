// Cálculos del calendario, separados de la vista para poder probarlos solos.

import { minutosDelDia, hhmmAMinutos } from '../../utils/tiempo';

// Alto en píxeles de una hora en la rejilla. 15 min = 18 px.
export const ALTO_HORA = 72;
export const PIXELES_POR_MINUTO = ALTO_HORA / 60;
// Paso al que se ajustan los clics para crear una cita
export const PASO_MINUTOS = 15;

// Hora de inicio y fin de la rejilla: abarca el horario más temprano y más
// tarde de la semana, y se estira si alguna cita cae fuera de horario.
export const rangoVisible = (horarios, citas) => {
  let desde = Infinity;
  let hasta = -Infinity;

  (horarios || []).forEach((h) => {
    if (!h.abierto) return;
    desde = Math.min(desde, hhmmAMinutos(h.apertura));
    hasta = Math.max(hasta, hhmmAMinutos(h.cierre));
  });

  (citas || []).forEach((c) => {
    desde = Math.min(desde, minutosDelDia(c.fechaHora));
    hasta = Math.max(hasta, minutosDelDia(c.fechaHora) + (c.duracionMinutos || 30));
  });

  // Sin datos: un horario razonable de barbería
  if (!Number.isFinite(desde)) desde = 9 * 60;
  if (!Number.isFinite(hasta)) hasta = 21 * 60;

  return {
    horaInicio: Math.max(0, Math.floor(desde / 60)),
    horaFin: Math.min(24, Math.ceil(hasta / 60)),
  };
};

// Reparte las citas de un día en carriles cuando se empalman, como hace
// Google Calendar: las que coinciden en tiempo se ponen lado a lado.
export const distribuirCitas = (citas) => {
  const eventos = citas
    .map((c) => {
      const ini = minutosDelDia(c.fechaHora);
      return { cita: c, ini, fin: ini + (c.duracionMinutos || 30) };
    })
    .sort((a, b) => a.ini - b.ini || b.fin - a.fin);

  // Grupos de citas que se tocan entre sí, directa o indirectamente
  const grupos = [];
  let grupo = [];
  let finGrupo = -Infinity;

  eventos.forEach((e) => {
    if (e.ini >= finGrupo && grupo.length) {
      grupos.push(grupo);
      grupo = [];
      finGrupo = -Infinity;
    }
    grupo.push(e);
    finGrupo = Math.max(finGrupo, e.fin);
  });
  if (grupo.length) grupos.push(grupo);

  const resultado = [];
  grupos.forEach((g) => {
    // Cada carril recuerda cuándo termina su última cita
    const carriles = [];
    g.forEach((e) => {
      let carril = carriles.findIndex((finCarril) => finCarril <= e.ini);
      if (carril === -1) {
        carril = carriles.length;
        carriles.push(e.fin);
      } else {
        carriles[carril] = e.fin;
      }
      e.carril = carril;
    });
    g.forEach((e) => resultado.push({ ...e, totalCarriles: carriles.length }));
  });

  return resultado;
};

// Convierte la posición vertical del clic en minutos del día, ajustados al paso
export const minutosDesdeY = (y, horaInicio) => {
  const crudo = horaInicio * 60 + y / PIXELES_POR_MINUTO;
  return Math.floor(crudo / PASO_MINUTOS) * PASO_MINUTOS;
};

// ¿La franja [inicio, inicio+duracion) choca con alguna cita del día?
export const buscarChoque = (citasDelDia, inicio, duracion, ignorarId) => {
  const ini = inicio.getTime();
  const fin = ini + duracion * 60000;
  return citasDelDia.find((c) => {
    if (c._id === ignorarId || c.estado === 'cancelada') return false;
    const cIni = new Date(c.fechaHora).getTime();
    const cFin = cIni + (c.duracionMinutos || 30) * 60000;
    return ini < cFin && fin > cIni;
  });
};
