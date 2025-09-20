// types/Admisiones.ts

/** Fechas ISO (e.g. "2025-09-05T12:30:00Z" o "2025-09-05") */
export type ISODateString = string;

/* ========= Catálogos / refs ========= */

export interface PersonaGenero {
  id: number;
  genero: string; // "Masculino" | "Femenino" | "Otro"
}

export interface PersonaEstadoCivil {
  id: number;
  estado: string; // "Soltero(a)" | "Casado(a)" | etc.
}

export interface PlanEstudiosRef {
  id: number;
  nombre: string;
}

/** Postulación del aspirante a un programa/carrera (si la expones en el detalle) */
export interface ProgramaPostulacion {
  programaId: number;
  programa: string;                  // nombre descriptivo
  fechaPostulacion: ISODateString;
  estatus: 'Solicitada' | 'En revisión' | 'Admitido' | 'Rechazado' | 'Cancelada' | string;
}

/* ========= Entidades relacionadas ========= */

export interface PersonaDireccion {
  id?: number;
  calle?: string;
  numero?: string;
  codigoPostalId?: number;
  codigoPostal?: string;
}

export interface ApplicationUserRef {
  id: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  securityStamp?: string;
  concurrencyStamp?: string;
  passwordHash?: string;
}

export interface Persona {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: ISODateString;

  // opcionales para UI/compatibilidad
  correoElectronico?: string;
  telefono?: string;
  fechaCreacion?: ISODateString;

  personaGeneroId?: number;
  personaGenero?: PersonaGenero | null;

  personaEstadoCivilId?: number;
  estadoCivil?: PersonaEstadoCivil | null;

  direccionId?: number;
  direccion?: PersonaDireccion | null;

  userId?: string;
  user?: ApplicationUserRef | null;
}

/* ========= Aspirante / Admisiones ========= */

export type AdmissionStatus =
  | 'Registrado'
  | 'Postulado'
  | 'En revisión'
  | 'Documentación'
  | 'Admitido'
  | 'Rechazado'
  | 'Cancelado'
  | string;

/**
 * Entidad de dominio para vistas de detalle/listas enriquecidas.
 * Nota: la API del listado puede devolverte objetos "AspirantePrograma" (ver AdmisionesResponse).
 */
export interface Admission {
  id: number;

  personaId?: string;
  persona: Persona;

  estatus: AdmissionStatus;
  fechaRegistro: ISODateString;

  // Postulaciones a programas (opcional según endpoints)
  programas?: ProgramaPostulacion[];

  // Plan de estudios asociado (si lo manejas en aspirante)
  planEstudiosId?: number;
  planEstudios?: PlanEstudiosRef | null;

  // Extras opcionales
  nivelEducativoId?: number;
  nivelEducativo?: string | null;
  statusAcademico?: string | null;
  status?: string | null;
}

/* ========= Respuesta paginada (si usas este shape en otros endpoints) ========= */

export interface AdmissionsResponse {
  items: Admission[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
