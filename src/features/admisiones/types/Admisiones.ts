// types/Admisiones.ts

export interface Admission {
  id: number;
  personaId?: string;

  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;

    // En la API de Aspirante viene ISO string
    fechaNacimiento: string;

    // Estos campos no siempre vienen en Aspirante -> los hacemos opcionales
    correoElectronico?: string;
    telefono?: string;
    fechaCreacion?: string;

    personaGeneroId?: number;
    personaGenero?: { id: number; genero: string } | null;

    personaEstadoCivilId?: number;
    estadoCivil?: { id: number; estado: string } | null;

    direccionId?: number;
    direccion?: {
      id?: number;
      calle?: string;
      numero?: string;
      codigoPostalId?: number;
      codigoPostal?: string;
    } | null;

    userId?: string;
    user?: {
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
    } | null;
  };

  // Datos propios del aspirante
  estatus: string;        // p.ej. "Registrado"
  fechaRegistro: string;  // ISO

  // Si agregas relación con programas/planes en la API, ya está tipado aquí:
  programas?: {
    programaId: number;
    programa: string;           // nombre del programa
    fechaPostulacion: string;   // ISO
    estatus: string;            // p.ej. "Solicitada" | "Admitido"
  }[];

  // Si decides devolver plan de estudios concreto
  planEstudiosId?: number;
  planEstudios?: { id: number; nombre: string } | null;

  // Otros campos que quizá agregues más adelante
  nivelEducativoId?: number;
  nivelEducativo?: string | null;
  statusAcademico?: string | null;
  status?: string | null;
}

// Si también necesitas el contenedor paginado (GET listado):
export interface AdmissionsResponse {
  items: Admission[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
