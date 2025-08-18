'use client'

import { TeacherPayload } from "@/types/TeacherPayload";
import { TeacherResponse } from "@/types/TeacherReponse";
import { TeacherItem } from "@/types/TeacherItem";

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
