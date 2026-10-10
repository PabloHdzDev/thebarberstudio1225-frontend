// wa.me necesita el número con lada de país. En la base los números se
// guardan a 10 dígitos, sin el 52 de México, así que se completa aquí: sin
// esto, "3312345678" se abre como un número de Francia (+33).
export const numeroWhatsApp = (numero) => {
  const digitos = String(numero || '').replace(/\D/g, '');
  return digitos.length === 10 ? `52${digitos}` : digitos;
};

export const enlaceWhatsApp = (numero, texto) => {
  const base = `https://wa.me/${numeroWhatsApp(numero)}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
};

// Sólo vale la pena ofrecer el botón cuando hay un número completo
export const tieneWhatsApp = (numero) => numeroWhatsApp(numero).length >= 11;
