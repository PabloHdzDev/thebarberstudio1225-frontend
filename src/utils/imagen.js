// Cloudinary puede convertir y redimensionar al vuelo con parámetros en la URL.
// f_auto entrega WebP o AVIF según el navegador, q_auto ajusta la compresión.
// Así los PNG pesados que ya están subidos se sirven optimizados sin resubirlos.
export const optimizar = (url, ancho = 600) => {
  if (typeof url !== 'string') return url;
  if (!url.includes('/image/upload/')) return url;
  // Si alguien ya puso transformaciones a mano, no se tocan
  if (url.includes('/upload/f_') || url.includes('/upload/q_')) return url;

  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${ancho},c_limit/`);
};
