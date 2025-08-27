"use client";

import { CoordinatorList } from "@/features/coordinators";


export default function CoordinatorsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Coordinadores</h1>
      <CoordinatorList />
    </div>
  );
}
