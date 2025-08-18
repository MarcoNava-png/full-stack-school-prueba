'use client'

import { TeacherPayload } from "@/modules/teachers/types/TeacherPayload";
import { TeacherResponse } from "@/modules/teachers/types/TeacherResponse";
import { apiFetch } from "@/lib/fetcher";

export async function getTeachers(): Promise<TeacherResponse[]> {
  const res = await apiFetch<TeacherResponse[]>(`/Profesor`);
  return res;
}

export async function createTeacher(data: TeacherPayload): Promise<TeacherResponse> {
  const res = await apiFetch<TeacherResponse>(`/Profesor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}

export async function updateTeacher(id: string | number, data: Partial<TeacherPayload>): Promise<TeacherResponse> {
  const res = await apiFetch<TeacherResponse>(`/Profesor/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}

export async function deleteTeacher(id: string | number): Promise<{ success: boolean }> {
  const res = await apiFetch<{ success: boolean }>(`/Profesor/${id}`, {
    method: "DELETE",
  });

  return res;
}
