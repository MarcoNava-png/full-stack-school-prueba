"use client";

import { TeacherList } from '@/features/teachers';

export default function TeachersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Profesores</h1>
      <TeacherList />
    </div>
  );
}
