// src/articles/index.js
import TiposDeFade, { meta as metaFade } from './TiposDeFade';
import CorteSegunRostro, { meta as metaRostro } from './CorteSegunRostro';
import CuidadoDeBarba, { meta as metaBarba } from './CuidadoDeBarba';
import Tendencias2026, { meta as metaTendencias } from './Tendencias2026';
import BarberiaLosTulipanes, { meta as metaLosTulipanes } from './BarberiaLosTulipanes';
import ProductosParaBarba, { meta as metaProductosBarba } from './ProductosParaBarba';

export const ARTICULOS_BLOG = [
  { ...metaFade, Componente: TiposDeFade },
  { ...metaRostro, Componente: CorteSegunRostro },
  { ...metaBarba, Componente: CuidadoDeBarba },
  { ...metaProductosBarba, Componente: ProductosParaBarba },
  { ...metaTendencias, Componente: Tendencias2026 },
  { ...metaLosTulipanes, Componente: BarberiaLosTulipanes }
];