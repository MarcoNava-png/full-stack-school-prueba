// features/admisiones/components/AdmissionsListWithNavigation.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export function AdmissionsListWithNavigation() {
  const router = useRouter();
  const [aspirantes, setAspirantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAspirantes = async () => {
    setLoading(true);
    try {
      // Cambia la URL para que coincida con la del backend
      const data = await apiFetch("/api/Aspirante?page=1&pageSize=50");
      setAspirantes(data.items || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchAspirantes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAspirantes = useMemo(() => {
    if (!searchTerm.trim()) return aspirantes;
    const term = searchTerm.toLowerCase();
    return aspirantes.filter((a: any) =>
      a.nombreCompleto?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.planEstudios?.toLowerCase().includes(term) ||
      a.aspiranteEstatus?.toLowerCase().includes(term)
    );
  }, [aspirantes, searchTerm]);

  // Opcional: doble click para navegar
  // const router = useRouter();
  // const handleRowDoubleClick = (a: any) => {
  //   router.push(`/dashboard/list/admissions/detailsapplicants?selected=${encodeURIComponent(a.idAspirante)}`);
  // };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lista de Aspirantes</h2>
        <Button
          type="button"
          onClick={() => router.push("/dashboard/admisiones/nuevo")}
          className="bg-black text-white hover:bg-[#233f6a]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Aspirante
        </Button>
      </div>

      <div className="w-full md:w-1/3 mb-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Buscar aspirantes</label>
          <input
            type="text"
            placeholder="Buscar por nombre, estatus, programa o plan..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-md p-2 text-sm ring-1 ring-gray-300"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Programa de interés</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredAspirantes ?? []).map((a: any) => (
              <TableRow
                key={a.idAspirante}
                className="hover:bg-gray-50"
                // onDoubleClick={() => handleRowDoubleClick(a)}
              >
                <TableCell className="font-medium">{a.nombreCompleto}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.planEstudios}</TableCell>
                <TableCell>{a.planEstudios}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {a.aspiranteEstatus || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  {a.fechaRegistro ? a.fechaRegistro.slice(0, 10) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {/* Opcional: botones de editar/eliminar */}
                  {/* <Button ... onClick={() => { ... }}><Pencil /></Button> */}
                  {/* <Button ... onClick={() => { ... }}><Trash2 /></Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
     