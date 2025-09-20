// features/admisiones/components/AdmissionsListWithNavigation.tsx
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdmissionsList } from "@/features/admisiones/components/AdmisionesList";
import type { AdmissionsItem } from "@/features/admisiones/types/AdmisionesItem";

/**
 * Componente CLIENTE que solo renderiza la lista y navega
 * al módulo de seguimiento al hacer doble click.
 */
export function AdmissionsListWithNavigation() {
  const router = useRouter();

  const handleRowDoubleClick = useCallback((a: AdmissionsItem) => {
    // Empuja a TU ruta real (según tu screenshot)
    router.push(
      `/dashboard/list/admissions/detailsapplicants?selected=${encodeURIComponent(
        a.id
      )}`
    );
  }, [router]);

  return <AdmissionsList onRowDoubleClick={handleRowDoubleClick} />;
}
