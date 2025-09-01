'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useTeachers } from '../hooks';
import { DeleteTeacherModal } from './modals/DeleteTeacherModal';
import type { TeacherItem, TeacherResponse } from '../types/TeacherResponse';
import type { TeacherPayload } from '../types/TeacherPayload';
import { TeacherFormModal } from './modals/TeacherFormModal';

export function TeacherList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    teachers,
    error,
    deleteTeacherById,
    createTeacherData,
    updateTeacherData,
  } = useTeachers();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleEdit = (teacher: TeacherItem) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (teacher: TeacherItem) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher) return;

    try {
      await deleteTeacherById(selectedTeacher.id.toString());
      setIsDeleteModalOpen(false);
      setSelectedTeacher(null);
    } catch (error: unknown) {
      console.error('Error deleting teacher:', error);
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return teachers;

    const term = searchTerm.toLowerCase();
    return teachers?.filter(teacher =>
    (teacher.persona?.nombre?.toLowerCase().includes(term) ||
      teacher.persona?.apellidoPaterno?.toLowerCase().includes(term) ||
      teacher.especialidad?.toLowerCase().includes(term))
    );
  }, [teachers, searchTerm]);

  const getFullName = (data: TeacherItem) => {
    let teacher = data;
    return [
      teacher?.persona?.nombre,
      teacher?.persona?.apellidoPaterno,
      teacher?.persona?.apellidoMaterno
    ].filter(Boolean).join(' ');
  };

  const mapToTeacherFormData = (teacher: TeacherItem): TeacherPayload => ({
    email: '',
    password: '',
    nombre: teacher.persona?.nombre || '',
    apellidoPaterno: teacher.persona?.apellidoPaterno || '',
    apellidoMaterno: teacher.persona?.apellidoMaterno || '',
    fechaNacimiento: teacher.persona?.fechaNacimiento || new Date().toISOString().split('T')[0],
    calle: teacher.persona?.direccion?.calle || '',    
    numero: teacher.persona?.direccion?.numero || '',  
    codigoPostalId: teacher.persona?.direccion?.codigoPostalId ?? 0,
    personaGeneroId: teacher.persona?.personaGeneroId || 1,
    especialidad: teacher.especialidad || ''
  });

  const handleFormSubmit = async (data: TeacherPayload) => {
    try {
      if (isEditing && selectedTeacher) {
        await updateTeacherData(selectedTeacher.id.toString(), data);
      } else {
        await createTeacherData(data);
      }
      setIsFormModalOpen(false);
      setSelectedTeacher(null);
      setIsEditing(false);
    } catch (error: unknown) {
      console.error('Error saving teacher:', error);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error al cargar los profesores: {error ? error : 'Error desconocido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lista de Profesores</h2>
        <Button
          type="button"
          variant="default"
          onClick={() => {
            setSelectedTeacher(null);
            setIsEditing(false);
            setIsFormModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Profesor
        </Button>
      </div>

      <div className="w-full md:w-1/3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Buscar profesores</label>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Asignatura</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers?.map((teacher: TeacherItem) => (
              <TableRow key={teacher.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {teacher.persona?.nombre?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getFullName(teacher) || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {'Sin teléfono'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-900">{'Sin email'}</TableCell>
                <TableCell className="text-sm text-gray-500">{teacher.especialidad || 'No especificada'}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activo
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label="Editar profesor"
                      onClick={() => handleEdit(teacher)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label="Eliminar profesor"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(teacher)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isFormModalOpen && (
        <TeacherFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedTeacher(null);
            setIsEditing(false);
          }}
          onSubmit={handleFormSubmit}
          teacher={isEditing && selectedTeacher ? mapToTeacherFormData(selectedTeacher) : undefined}
        />
      )}

      {isDeleteModalOpen && selectedTeacher && (
        <DeleteTeacherModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTeacher(null);
          }}
          onConfirm={handleDeleteConfirm}
          teacherName={ 'este profesor'}
        />
      )}
    </div>
  );
}
