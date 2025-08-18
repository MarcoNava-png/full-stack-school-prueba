"use client";

import Image from "next/image";
import React, { useState } from "react";
import { login } from "@/services/authService";

const LoginForm: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(usuario, contrasena);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl mb-2">
            <Image src="/Logousag.png" alt="Logo del sistema" width={500} height={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mt-1">Accede a tu panel de control</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario o correo</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Ej. admin@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition duration-150"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
