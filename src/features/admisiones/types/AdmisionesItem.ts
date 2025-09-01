// types/AdmissionsItem.ts
export interface AdmissionsItem {
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
