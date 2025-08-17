"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";   // ✅ IMPORTANTE
import { logout } from "@/services/authService"; // ✅ Para cerrar sesión

const Navbar = () => {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ✅ Usamos el hook de autenticación
  const { user, handleLogout } = useAuth();

  // ⏱ Cierre automático en 5 segundos
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (showMessages) timers.push(setTimeout(() => setShowMessages(false), 5000));
    if (showNotifications) timers.push(setTimeout(() => setShowNotifications(false), 5000));
    if (showProfileMenu) timers.push(setTimeout(() => setShowProfileMenu(false), 5000));

    return () => timers.forEach(clearTimeout);
  }, [showMessages, showNotifications, showProfileMenu]);

  // ❌ Cierre si das clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Función de cerrar sesión
  const handleLogoutClick = async () => {
    await logout();   // llama al backend y elimina la cookie
    handleLogout();   // limpia el estado del hook
    window.location.href = "/login"; // redirige al login
  };

  return (
    <div className="flex items-center justify-between p-4 relative">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="Buscar" width={14} height={14} />
        <input
          type="text"
          placeholder="Buscar..."
          className="text-sm outline-none w-[200px] p-2 bg-transparent"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full relative">
        {/* Mensajes */}
        <div
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
          onClick={() => setShowMessages((prev) => !prev)}
        >
          <Image src="/message.png" alt="Mensajes" width={20} height={20} />
        </div>
        {showMessages && (
          <div
            ref={messageRef}
            className="absolute top-12 right-32 bg-white shadow-md rounded-md p-4 w-64 text-sm z-50"
          >
            <p>No tienes mensajes nuevos.</p>
          </div>
        )}

        {/* Notificaciones */}
        <div
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative"
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <Image src="/announcement.png" alt="Notificaciones" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        {showNotifications && (
          <div
            ref={notifyRef}
            className="absolute top-12 right-20 bg-white shadow-md rounded-md p-4 w-64 text-sm z-50"
          >
            <p>Tienes 1 nueva notificación.</p>
          </div>
        )}

        {/* Perfil */}
        <div className="flex flex-col items-end text-right">
          {/* ✅ Mostramos datos del usuario si está logueado */}
          <span className="text-xs font-medium">{user?.Correo || "Invitado"}</span>
          <span className="text-[10px] text-gray-500">{user ? "Activo" : "Desconectado"}</span>
        </div>

        <Image
          src="/avatar.png"
          alt="Perfil"
          width={36}
          height={36}
          className="rounded-full cursor-pointer"
          onClick={() => setShowProfileMenu((prev) => !prev)}
        />

        {showProfileMenu && (
          <div
            ref={profileRef}
            className="absolute top-14 right-2 bg-white shadow-md rounded-md p-4 w-40 text-sm z-50"
          >
            <ul className="space-y-2">
              <li className="cursor-pointer hover:text-indigo-600">Mi Perfil</li>
              <li className="cursor-pointer hover:text-indigo-600">Configuración</li>
              <li
                className="cursor-pointer hover:text-red-500"
                onClick={handleLogoutClick} // ✅ Aquí cerramos sesión
              >
                Cerrar sesión
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
