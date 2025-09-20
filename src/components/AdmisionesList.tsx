// features/admisiones/components/AdmisionesList.tsx
"use client";

import * as React from "react";

/** ---- Tipos ---- */
export type Applicant = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  program?: string;
  campus?: string;
  cycle?: string;
  owner?: string;
  stage?: string;
};

export type AdmissionsListProps = {
  /** Se dispara al hacer doble click en una fila */
  onRowDoubleClick?: (a: Applicant) => void;
};

/**
 * Lista de aspirantes.
 * - Reemplaza el estado local `rows` por tu fetch real o props.
 */
export function AdmissionsList({ onRowDoubleClick }: AdmissionsListProps) {
  // TODO: sustituye por tu data real (fetch/props)
  const [rows] = React.useState<Applicant[]>([
    {
      id: "A-001",
      name: "María López",
      email: "maria@example.com",
      phone: "555-111-2222",
      program: "Ing. Sistemas",
      campus: "Norte",
      cycle: "2025-1",
      owner: "Ana Ruiz",
      stage: "Prospecto",
    },
    {
      id: "A-002",
      name: "José Pérez",
      email: "jose@example.com",
      phone: "555-333-4444",
      program: "Derecho",
      campus: "Centro",
      cycle: "2025-1",
      owner: "Luis Mora",
      stage: "Documentación",
    },
  ]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600">
            <th className="px-3 py-2 font-medium">Nombre</th>
            <th className="px-3 py-2 font-medium">Programa</th>
            <th className="px-3 py-2 font-medium">Campus</th>
            <th className="px-3 py-2 font-medium">Ciclo</th>
            <th className="px-3 py-2 font-medium">Etapa</th>
            <th className="px-3 py-2 font-medium">Responsable</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr
              key={a.id}
              onDoubleClick={() => onRowDoubleClick?.(a)}
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-3 py-2 font-medium text-gray-900">{a.name}</td>
              <td className="px-3 py-2 text-gray-700">{a.program}</td>
              <td className="px-3 py-2 text-gray-700">{a.campus}</td>
              <td className="px-3 py-2 text-gray-700">{a.cycle}</td>
              <td className="px-3 py-2 text-gray-700">{a.stage}</td>
              <td className="px-3 py-2 text-gray-700">{a.owner}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
