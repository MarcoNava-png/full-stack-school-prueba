'use client'

import { TeacherPayload } from "@/features/teachers/types/TeacherPayload";
import { TeacherResponse } from "@/features/teachers/types/TeacherResponse";
import { TeacherItem } from "@/features/teachers/types/TeacherItem";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7169";

export async function getTeachers(): Promise<TeacherResponse[]> {
  const res = await fetch(`${API_URL}/Profesor`);
  if (!res.ok) throw new Error(`Error al obtener profesores: ${res.statusText}`);
  return res.json();
}

export async function createTeacher(data: TeacherPayload): Promise<any> {
  const res = await fetch(`${API_URL}/Profesor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error al crear profesor: ${res.statusText}`);
  }

  return res.json();
}

export async function updateTeacher(teacher: TeacherItem): Promise<TeacherItem> {
  const res = await fetch(`${API_URL}/Profesor/${teacher.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacher),
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar profesor: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteTeacher(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/Profesor/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error al eliminar profesor: ${res.statusText}`);
  return res.json();
}
