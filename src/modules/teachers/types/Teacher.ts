export interface Teacher {
  id: number;
  personaId: string;
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    correoElectronico: string;
    telefono: string;
    fechaCreacion: string;
    personaGeneroId: number;
    personaGenero: null,
    personaEstadoCivilId: number,
    estadoCivil: null,
    direccionId: number,
    direccion: null,
    userId: string,
    user: null
  },
  especialidad: string,
  departamentoId: number,
  fechaAlta: string
}