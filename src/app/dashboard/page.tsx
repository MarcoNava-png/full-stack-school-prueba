"use client";

import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Calendar, BookOpen, Users, BarChart2, Clock, Book, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Cargando sesión...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Cursos Activos', value: '5', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Estudiantes', value: '124', icon: <Users className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
    { title: 'Horas de Clase', value: '36', icon: <Clock className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Tareas Pendientes', value: '8', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const recentActivities = [
    { id: 1, title: 'Nuevo estudiante registrado', time: 'Hace 10 minutos' },
    { id: 2, title: 'Tarea calificada: Matemáticas', time: 'Hace 2 horas' },
    { id: 3, title: 'Reunión de profesores', time: 'Mañana a las 10:00 AM' },
    { id: 4, title: 'Entrega de calificaciones', time: 'En 3 días' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 mx-auto w-full">
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bienvenido, {user?.NombreUsuario || "Usuario"}</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Aquí tienes un resumen de tu actividad reciente.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-xl sm:text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                {React.cloneElement(stat.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Próximas Clases */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold">Próximas Clases</h2>
            <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">Ver todo</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-medium truncate">Matemáticas Avanzadas</h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Lunes, 10:00 AM - 11:30 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Actividad Reciente</h2>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="border-l-2 border-blue-500 pl-3 sm:pl-4 py-1">
                <p className="font-medium text-xs sm:text-sm line-clamp-1">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-600 hover:text-blue-800 w-full text-center pt-2 border-t border-gray-100">
            Ver más actividad
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Book className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium text-center">Nuevo Curso</span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium text-center">Agregar Estudiante</span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium text-center">Reportes</span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium text-center">Calendario</span>
          </button>
        </div>
      </div>
    </div>
  );
}
