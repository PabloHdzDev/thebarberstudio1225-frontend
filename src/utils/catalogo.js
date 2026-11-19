// Ayudas para servicios y productos, compartidas por el sitio y el panel.

// Un servicio puede estar en varias categorías: "Corte + Barba" sale en
// "Cortes" y en "Combos". Se acepta el campo viejo de una sola categoría por
// si queda algún dato sin migrar.
export const categoriasDeElemento = (elemento) => {
  if (Array.isArray(elemento?.categorias)) return elemento.categorias.filter(Boolean);
  return elemento?.categoria ? [elemento.categoria] : [];
};

// Categorías en el orden en que aparecen en la lista (que ya viene ordenada),
// así el barbero decide el orden de las pestañas con la posición de cada servicio
export const categoriasDe = (lista) => [
  ...new Set(lista.flatMap(categoriasDeElemento)),
];

// Sin categoría elegida ("Todos") entran todos
export const estaEnCategoria = (elemento, categoria) =>
  !categoria || categoriasDeElemento(elemento).includes(categoria);

export const tieneCambioProgramado = (servicio) =>
  Boolean(servicio.precioNuevo && servicio.precioNuevoDesde);

// "1 de diciembre", siempre con la hora de Guadalajara
export const fechaLarga = (fecha) => new Date(fecha).toLocaleDateString('es-MX', {
  day: 'numeric', month: 'long', timeZone: 'America/Mexico_City',
});

// Último día con el precio actual: el anterior al cambio
export const ultimoDiaAntes = (fecha) => fechaLarga(new Date(fecha).getTime() - 1);

// Fecha del cambio como "AAAA-MM-DD" para un <input type="date">
export const fechaParaInput = (fecha) => new Date(fecha).toLocaleDateString('en-CA', {
  timeZone: 'America/Mexico_City',
});
