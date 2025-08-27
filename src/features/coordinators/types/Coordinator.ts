export interface Coordinator {
  id: number,
  especialidad: string,
  persona: {
    id: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    fechaNacimiento: string,
    personaGeneroId: number,
    userId: string,
    estatus: number,
    personaGenero: {
      id: number,
      genero: string
    },
    user: {
      id: string,
      userName: string,
      normalizedUserName: string,
      email: string,
      normalizedEmail: string,
      emailConfirmed: boolean,
      passwordHash: string,
      securityStamp: string,
      concurrencyStamp: string,
      phoneNumber: string,
      phoneNumberConfirmed: boolean,
      twoFactorEnabled: boolean,
      lockoutEnd: string,
      lockoutEnabled: boolean,
      accessFailedCount: number
    }
  }
}