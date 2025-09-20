/*'use client';

import { apiFetch } from '@/lib/fetcher';
import type { AdmissionPayload } from '@/features/admisiones/types/AdmisionesPayload';
import type { AdmissionResponse, AdmissionItem } from '@/features/admisiones/types/AdmisionesResponse';


// * GET listado de admisiones (aspirantes) paginado.
// * Ajusta si tu backend usa query params (page, pageSize). Aquí lo dejamos simple como en teacherServices.

export async function getAdmissions(): Promise<AdmissionResponse> {
  return await apiFetch<AdmissionResponse>(`/Aspirante`);
}


// * POST crear admisión (aspirante).
// * Espera un AdmissionPayload con email, password, datos personales y dirección,
// * y opcionalmente planEstudiosId o programaIds si tu API ya lo soporta.

export async function createAdmission(data: AdmissionPayload): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}


// * PUT actualizar admisión (aspirante).
// * Si tu API no tiene PUT /Aspirante/{id} todavía, este método devolverá 404.
// * Puedes cambiarlo a PATCH si ese es tu contrato.

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


// * DELETE eliminar admisión (aspirante).

export async function deleteAdmission(id: string | number): Promise<{ success: boolean }> {
  return await apiFetch<{ success: boolean }>(`/Aspirante/${id}`, {
    method: 'DELETE',
  });
}


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


export async function getAdmissionById(id: string | number): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${id}`);
}
*/

'use client';

import { apiFetch } from '@/lib/fetcher';
import type { AdmissionPayload } from '../types/AdmisionesPayload';
import type { AdmissionResponse, AdmissionItem } from '../types/AdmisionesResponse';

/* Utilidad: quitar keys undefined del body */
function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/* ========= Admisiones ========= */

/** GET listado paginado (usa los query params esperados por tu controller) */
export async function getAdmissions(params?: { page?: number; pageSize?: number }): Promise<AdmissionResponse> {
  const qs = params ? `?page=${params.page ?? 1}&pageSize=${params.pageSize ?? 10}` : '';
  return await apiFetch<AdmissionResponse>(`/Aspirante${qs}`);
}

/** POST crear aspirante (puede incluir programaId si es requerido por el back) */
export async function createAdmission(data: AdmissionPayload): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stripUndefined(data)),
  });
}

/**
 * PUT actualizar aspirante.
 * Nota: si tu backend NO tiene PUT /Aspirante/{id}, este método devolverá 404.
 * Ajusta a PATCH o al endpoint real cuando lo tengas.
 */
export async function updateAdmission(
  id: string | number,
  data: Partial<AdmissionPayload>
): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stripUndefined(data)),
  });
}

/** DELETE eliminar aspirante */
export async function deleteAdmission(id: string | number): Promise<{ success: boolean }> {
  return await apiFetch<{ success: boolean }>(`/Aspirante/${id}`, {
    method: 'DELETE',
  });
}

/** GET detalle por id (solo si existe ese endpoint en tu API) */
export async function getAdmissionById(id: string | number): Promise<AdmissionItem> {
  return await apiFetch<AdmissionItem>(`/Aspirante/${id}`);
}

/* ========= Catálogos (para selects en UI) ========= */

export interface StudyPlanOption { id: number; nombre: string }
export interface ProgramOption   { id: number; nombre: string }

/** Planes de estudio (ajusta la ruta a la real de tu API si difiere) */
export async function getStudyPlans(): Promise<StudyPlanOption[]> {
  try {
    const res = await apiFetch<{ items?: StudyPlanOption[] } | StudyPlanOption[]>(
      `/PlanesEstudio`
    );
    return Array.isArray(res) ? res : (res.items ?? []);
  } catch {
    return [];
  }
}

/** Programas/Carreras (ajusta la ruta si tu API usa otra) */
export async function getPrograms(): Promise<ProgramOption[]> {
  try {
    const res = await apiFetch<{ items?: ProgramOption[] } | ProgramOption[]>(
      `/Programas`
    );
    return Array.isArray(res) ? res : (res.items ?? []);
  } catch {
    return [];
  }
}
