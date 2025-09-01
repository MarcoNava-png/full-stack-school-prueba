// types/AdmissionResponse.ts

export interface AdmissionResponse {
  items: AdmissionItem[];   // para GET paginado
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Reutilizable si luego la API expone la dirección del aspirante
export interface DireccionDto {
  calle: string;
  numero: string;
  codigoPostalId: number;
}

// Si más adelante devuelves los programas/planes del aspirante
export interface AspiranteProgramaDto {
  programaId: number;
  programa: string;           // nombre del programa
  fechaPostulacion: string;   // ISO date
  estatus: string;            // p.ej. "Solicitada" | "Admitido" | ...
}

// Nota: En tu Swagger de Aspirante, persona.personaGenero viene como string/null.
// En Teacher lo tienes como objeto { id, genero }.
// Dejamos uniones para soportar ambos sin romper tipos.
export interface PersonaLite {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;                 // ISO date
  estatus: string;                         // p.ej. "Activo"
  personaGenero?: string | { id: number; genero: string } | null;
  direccion?: DireccionDto;                // opcional: si decides exponerla
}

export interface AdmissionItem {
  id: number;
  fechaRegistro: string;                   // ISO date
  estatus: string;                         // p.ej. "Registrado" | ...
  persona: PersonaLite;
  programas?: AspiranteProgramaDto[];      // opcional
}

// Para el POST de aspirante (creación) tu API devuelve UN objeto.
// Usa este alias para mayor claridad:
export type AdmissionCreateResponse = AdmissionItem;
