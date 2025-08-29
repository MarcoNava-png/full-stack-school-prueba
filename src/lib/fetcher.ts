export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7169'}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Error en la petición: ${res.statusText}`);
  }

  if (res.status === 204) {
    if (url.toLowerCase().endsWith("s")) {
      return [] as T;
    }
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
