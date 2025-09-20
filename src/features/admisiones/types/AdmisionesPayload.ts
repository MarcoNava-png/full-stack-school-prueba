// types/AdmissionPayload.ts

export interface AdmissionPayload {
  email: string;
  password?: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  calle: string;
  numero: string;
  personaGeneroId: number;
  codigoPostalId: number;
  programaId?: number;
}
