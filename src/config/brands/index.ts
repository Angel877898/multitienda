import type { Brand } from "../types";
import { sanacionInterior } from "./sanacion-interior";
import { guiasTusExamenes } from "./guias-tus-examenes";

// ============================================================================
//  REGISTRO DE MARCAS
//  Una marca = un archivo en esta carpeta. Para añadir una nueva:
//    1. Copia uno de los archivos y cambia datos, colores y productos.
//    2. Impórtala y agrégala a este arreglo.
//    3. Pon su símbolo en public/brands/<id>/mark.svg y sus PDFs en private/<id>/.
// ============================================================================

export const brands: Brand[] = [sanacionInterior, guiasTusExamenes];
