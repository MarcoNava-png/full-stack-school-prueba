"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth(true); // ✅ si no hay sesión, redirige

  // 🔄 Mientras valida la sesión, muestra un loader (evita redirección prematura)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Cargando sesión...</p>
      </div>
    );
  }

  // ✅ Si hay usuario, muestra el dashboard
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenido, {user?.NombreUsuario || "Usuario"}</h1>
      <p className="mt-2 text-gray-600">Este es tu panel de control.</p>
    </div>
  );
}
