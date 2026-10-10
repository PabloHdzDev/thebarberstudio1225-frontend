// Utilidades de fecha y hora compartidas por el sitio y el panel.

// Duraciones posibles de un servicio, en minutos
export const DURACIONES = [15, 30, 45, 60, 75, 90, 105, 120];

// 75 -> "1 h 15 min", 60 -> "1 hora", 30 -> "30 min"
export const etiquetaDuracion = (minutos) => {
  const total = Number(minutos) || 0;
  const horas = Math.floor(total / 60);
  const resto = total % 60;
  if (!horas) return `${resto} min`;
  if (!resto) return horas === 1 ? '1 hora' : `${horas} horas`;
  return `${horas} h ${resto} min`;
};

// Acepta un Date o un texto "HH:MM" de 24 horas y devuelve "1:30 PM"
export const formatoHora12 = (valor) => {
  let horas;
  let minutos;

  if (valor instanceof Date) {
    horas = valor.getHours();
    minutos = valor.getMinutes();
  } else if (typeof valor === 'string' && /^\d{1,2}:\d{1,2}$/.test(valor)) {
    // Sólo "HH:MM" exacto: una fecha ISO también trae dos puntos y no debe
    // tomarse por una hora suelta
    [horas, minutos] = valor.split(':').map(Number);
  } else {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return '';
    horas = fecha.getHours();
    minutos = fecha.getMinutes();
  }

  const sufijo = horas >= 12 ? 'PM' : 'AM';
  const h12 = horas % 12 === 0 ? 12 : horas % 12;
  return `${h12}:${String(minutos).padStart(2, '0')} ${sufijo}`;
};

// Versión corta para la rejilla del calendario: "1 PM", "11 AM"
export const horaCorta = (horas) => {
  const sufijo = horas >= 12 ? 'PM' : 'AM';
  const h12 = horas % 12 === 0 ? 12 : horas % 12;
  return `${h12} ${sufijo}`;
};

// "YYYY-MM-DD" en hora local, sin que la zona horaria lo corra un día
export const claveDia = (fecha) => {
  const f = new Date(fecha);
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const dia = String(f.getDate()).padStart(2, '0');
  return `${f.getFullYear()}-${mes}-${dia}`;
};

export const mismoDia = (a, b) => claveDia(a) === claveDia(b);

// Lunes de la semana a la que pertenece la fecha
export const inicioSemana = (fecha) => {
  const f = new Date(fecha);
  f.setHours(0, 0, 0, 0);
  const dia = f.getDay(); // 0 = domingo
  const desfase = dia === 0 ? -6 : 1 - dia;
  f.setDate(f.getDate() + desfase);
  return f;
};

export const sumarDias = (fecha, dias) => {
  const f = new Date(fecha);
  f.setDate(f.getDate() + dias);
  return f;
};

// Minutos transcurridos desde la medianoche
export const minutosDelDia = (fecha) => {
  const f = new Date(fecha);
  return f.getHours() * 60 + f.getMinutes();
};

// "13:00" -> 780
export const hhmmAMinutos = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + (m || 0);
};

export const NOMBRES_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const NOMBRES_DIA_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const NOMBRES_MES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
