'use client'

import { TeacherPayload } from "@/types/TeacherPayload";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7169";

export async function getTeachers(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/Profesor`);
  if (!res.ok) throw new Error(`Error al obtener profesores: ${res.statusText}`);
  return res.json();
}

export async function createTeacher(data: TeacherPayload): Promise<any> {
  const res = await fetch(`${API_URL}/api/Profesor`, {
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
