'use client'

import { CoordinatorPayload } from "@/features/coordinators/types/CoordinatorPayload";
import { CoordinatorResponse } from "@/features/coordinators/types/CoordinatorResponse";
import { apiFetch } from "@/lib/fetcher";
import { Coordinator } from "../types/Coordinator";

export async function getCoordinators(): Promise<CoordinatorResponse> {
  return await apiFetch<CoordinatorResponse>(`/coordinadores`);
}

export async function createCoordinator(data: CoordinatorPayload): Promise<Coordinator> {
  return await apiFetch<Coordinator>(`/coordinadores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateCoordinator(id: string | number, data: Partial<CoordinatorPayload>): Promise<Coordinator> {
  const res = await apiFetch<Coordinator>(`/coordinadores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}

export async function deleteCoordinator(id: string | number): Promise<{ success: boolean }> {
  const res = await apiFetch<{ success: boolean }>(`/coordinadores/${id}`, {
    method: "DELETE",
  });

  return res;
}
