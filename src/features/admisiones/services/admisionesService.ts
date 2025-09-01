'use client';

import { apiFetch } from '@/lib/fetcher';
import type { AdmissionPayload } from '@/features/admisiones/types/AdmisionesPayload';
import type { AdmissionResponse, AdmissionItem } from '@/features/admisiones/types/AdmisionesResponse';

/**
 * GET listado de admisiones (aspirantes) paginado.
 * Ajusta si tu backend usa query params (page, pageSize). Aquí lo dejamos simple como en teacherServices.
 */
export async function getAdmissions(): Promise<AdmissionResponse> {
  return await apiFetch<AdmissionResponse>(`/Aspirante`);
}

/**
 * POST crear admisión (aspirante).
 * Espera un AdmissionPayload con email, password, datos personales y dirección,
 * y opcionalmente planEstudiosId o programaIds si tu API ya lo soporta.
 */
export async function createAdmission(data: AdmissionPayload): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * PUT actualizar admisión (aspirante).
 * Si tu API no tiene PUT /Aspirante/{id} todavía, este método devolverá 404.
 * Puedes cambiarlo a PATCH si ese es tu contrato.
 */
export async function updateAdmission(
  id: string | number,
  data: Partial<AdmissionPayload>
): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * DELETE eliminar admisión (aspirante).
 */
export async function deleteAdmission(id: string | number): Promise<{ success: boolean }> {
  return await apiFetch<{ success: boolean }>(`/Aspirante/${id}`, {
    method: 'DELETE',
  });
}

/* ============================
   Helpers opcionales (Programas)
   ============================ */

/**
 * Agregar 1..n Programas a un aspirante.
 * Requiere un endpoint como: POST /Aspirante/{id}/Programas
 * Body: { programaIds: number[] }
 */
export async function addProgramsToAdmission(
  admissionId: number,
  programIds: number[]
): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${admissionId}/Programas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programaIds: programIds }),
  });
}

/**
 * Actualizar estatus de un Programa específico para un aspirante.
 * Requiere endpoint: PUT /Aspirante/{id}/Programas/{programaId}/estatus
 * Body: { estatus: string }
 */
export async function updateAdmissionProgramStatus(
  admissionId: number,
  programId: number,
  estatus: string
): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${admissionId}/Programas/${programId}/estatus`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estatus }),
  });
}

/**
 * (Opcional) Obtener detalle por id si lo implementas:
 * GET /Aspirante/{id}
 */
export async function getAdmissionById(id: string | number): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${id}`);
}
