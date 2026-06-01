// src/articles/index.js
import TiposDeFade, { meta as metaFade } from './TiposDeFade';
import CorteSegunRostro, { meta as metaRostro } from './CorteSegunRostro';
import CuidadoDeBarba, { meta as metaBarba } from './CuidadoDeBarba';
import Tendencias2026, { meta as metaTendencias } from './Tendencias2026';
import BarberiaZapopan, { meta as metaZapopan } from './BarberiaZapopan';

export const ARTICULOS_BLOG = [
  { ...metaFade, Componente: TiposDeFade },
  { ...metaRostro, Componente: CorteSegunRostro },
  { ...metaBarba, Componente: CuidadoDeBarba },
  { ...metaTendencias, Componente: Tendencias2026 },
  { ...metaZapopan, Componente: BarberiaZapopan }
];