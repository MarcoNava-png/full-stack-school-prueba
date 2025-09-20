// types/AdmissionsItem.ts
/* export interface AdmissionsItem {
  id: number;
  name: string;                 // "Nombre ApellidoPaterno ApellidoMaterno"
  email: string;                // si no viene en la API, deja "—"
  phone: string;                // si no viene en la API, deja "—"
  status: string;               // p.ej. "Registrado"
  registerDate: string;         // ISO - viene de fechaRegistro
  img: string;                  // url o '', según tu UI
  programs: { name: string }[]; // programas a los que postuló
  plans?: { name: string }[];   // opcional, si usas Plan de Estudios
}
  */

// types/AdmisionesResponse.ts

export type ISODateString = string;

/* ===========================
   Subtipos (coinciden con back)
   =========================== */

// types/AdmisionesItem.ts
export interface AdmissionsItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  registerDate: string;
  img: string;
  programs: { id?: number; name: string }[];
  plans?: { id?: number; name: string }[];
}


export interface DireccionDto {
  calle: string;
  numero: string;
  codigoPostalId: number;
}

/** Usuario ligero opcional colgado en Persona (si algún día lo expones) */
export interface UserLite {
  email?: string;
  phoneNumber?: string;
}

/** PersonaLite: coincide con lo que muestra tu Swagger (id, nombre, apellidos, fechaNacimiento, estatus, personaGenero) */
export interface PersonaLite {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: ISODateString;
  estatus: string;

  personaGenero?: string | { id: number; genero: string } | null;
  direccion?: DireccionDto;

  // Campos opcionales para no romper mappers en el front
  correoElectronico?: string | null;
  telefono?: string | null;
  user?: UserLite | null;
}

/** AspiranteDto tal como lo devuelve tu back dentro de "aspirante" */
export interface AspiranteDto {
  id: number;
  fechaRegistro: ISODateString;
  estatus: string;
  persona: PersonaLite;
}

/** ProgramaDto tal como lo devuelve tu back (según ejemplo de Swagger) */
export interface ProgramaDto {
  id: number;
  nombre: string;
  nivel?: number;
  departamento?: {
    id: number;
    nombre: string;
  };
}

/* =========================================
   Item de la lista (AspiranteProgramaDto)
   =========================================
   Tu back manda: {
     aspirante: { ...AspiranteDto },
     programa: { ...ProgramaDto } | null,
     fechaPostulacion: ISO
   }
*/
export interface AdmissionItem {
  aspirante: AspiranteDto;
  programa: ProgramaDto | null;
  fechaPostulacion: ISODateString;
}

/* ===========================
   Respuesta paginada del GET
   =========================== */
export interface AdmissionResponse {
  items: AdmissionItem[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  /** Si tu PagedResult no trae totalPages, déjalo opcional */
  totalPages?: number;
}

/** Para el POST que devuelve un solo registro con la misma forma */
export type AdmissionCreateResponse = AdmissionItem;


