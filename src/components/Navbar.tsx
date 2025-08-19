"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authService";
import Link from "next/link";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pathname = usePathname();
  const { handleLogout } = useAuth();

  const messageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close all dropdowns when route changes
  useEffect(() => {
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [pathname]);

  const handleLogoutClick = async () => {
    await logout();
    handleLogout();
    window.location.href = "/sign-in";
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-end h-12">
        {/* Right side icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">

          {/* Messages */}
          <div className="relative" ref={messageRef}>
            <button
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
              aria-haspopup="true"
              aria-expanded={showMessages}
            >
              <span className="sr-only">Ver mensajes</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {showMessages && (
              <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Mensajes</p>
                  </div>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100" role="menuitem">
                    <p className="font-medium">Nuevo mensaje de Juan</p>
                    <p className="text-xs text-gray-500 truncate">Hola, ¿cómo estás? Necesito hablar contigo sobre...</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hace 5 min</p>
                  </a>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100" role="menuitem">
                    <p className="font-medium">Recordatorio: Reunión</p>
                    <p className="text-xs text-gray-500">No olvides la reunión de hoy a las 3 PM</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hace 1 hora</p>
                  </a>
                  <div className="py-1.5 px-4">
                    <a href="#" className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700" role="menuitem">
                      Ver todos los mensajes
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
              aria-haspopup="true"
              aria-expanded={showNotifications}
            >
              <span className="sr-only">Ver notificaciones</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Notificaciones</p>
                  </div>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100" role="menuitem">
                    <p className="font-medium">Nueva tarea asignada</p>
                    <p className="text-xs text-gray-500">Matemáticas: Ejercicios de álgebra</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hace 2 horas</p>
                  </a>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100" role="menuitem">
                    <p className="font-medium">Calificación publicada</p>
                    <p className="text-xs text-gray-500">Historia: 9.5 en el examen parcial</p>
                    <p className="text-xs text-gray-400 mt-0.5">Ayer</p>
                  </a>
                  <div className="py-1.5 px-4">
                    <a href="#" className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700" role="menuitem">
                      Ver todas las notificaciones
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative ml-3" ref={profileRef}>
            <div>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu"
                aria-haspopup="true"
                aria-expanded={showProfileMenu}
              >
                <span className="sr-only">Abrir menú de usuario</span>
                <div className="relative">
                  <Image
                    className="h-8 w-8 rounded-full border-2 border-gray-300"
                    src="/avatar.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                </div>
                {!isMobile && (
                  <div className="ml-2 text-left">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">Nombre del Usuario</p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">usuario@ejemplo.com</p>
                  </div>
                )}
                <svg className="ml-1 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {showProfileMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">

                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Hola, Usuario</p>
                  <p className="text-xs text-gray-500 truncate">usuario@ejemplo.com</p>
                </div>

                <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi perfil
                  </div>
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  role="menuitem"
                >
                  <svg className="mr-2 h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
