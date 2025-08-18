'use client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7169";

export async function getPeople(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/personas`);
  if (!res.ok) throw new Error(`Error al obtener personas: ${res.statusText}`);
  return res.json();
}

export async function getPerson(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/personas/${id}`);
  if (!res.ok) throw new Error(`Error al obtener persona: ${res.statusText}`);
  return res.json();
}

export async function createPerson(data: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/personas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error al crear persona: ${res.statusText}`);
  }

  return res.json();
}

export async function updatePerson(id: string, data: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/personas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar persona: ${res.statusText}`);
  }

  return res.json();
}

export async function deletePerson(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/personas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Error al eliminar persona: ${res.statusText}`);
  }

  return res.json();
}

export async function assignRolesToTeacher(id: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/personas/${id}/roles/profesor`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Error al asignar roles: ${res.statusText}`);
  return res.json();
}

export async function unassignRolesToTeacher(id: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/personas/${id}/roles/profesor`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error al desasignar roles: ${res.statusText}`);
    return res.json();
}

export async function assignRolesToStudentId(id: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/personas/${id}/roles/estudiante`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Error al desasignar roles: ${res.statusText}`);
    return res.json();
}

export async function unassignRolesToStudentMatricula(matricula: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/personas/roles/estudiante/${matricula}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error al desasignar roles: ${res.statusText}`);
    return res.json();
}