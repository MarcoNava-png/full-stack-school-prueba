// types/AdmissionPayload.ts

export interface AdmissionPayload {
  email: string;
  password: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;   // "YYYY-MM-DD"
  calle: string;
  numero: string;
  codigoPostalId: number;    // Id válido en tu catálogo de CPs
  personaGeneroId: number;

  // Opcional: para vincular al plan/programa (elige uno según tu API)
  planEstudiosId?: number;   // si el POST acepta 1 plan
  programaIds?: number[];    // si el POST acepta varios programas
}
