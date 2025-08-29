'use client'

import { TeacherPayload } from "@/features/teachers/types/TeacherPayload";
import { TeacherResponse, TeacherItem } from "@/features/teachers/types/TeacherResponse";
import { apiFetch } from "@/lib/fetcher";

export async function getTeachers(): Promise<TeacherResponse> {
  return await apiFetch<TeacherResponse>(`/Profesor`);
}

export async function createTeacher(data: TeacherPayload): Promise<TeacherItem> {
  return await apiFetch<TeacherItem>(`/Profesor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateTeacher(id: string | number, data: Partial<TeacherPayload>): Promise<TeacherItem> {
  const res = await apiFetch<TeacherItem>(`/Profesor/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}

export async function deleteTeacher(id: string | number): Promise<{ success: boolean }> {
  return await apiFetch<{ success: boolean }>(`/Profesor/${id}`, {
    method: "DELETE",
  });
}
