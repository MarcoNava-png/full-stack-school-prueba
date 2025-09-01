'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';

import { useAdmisiones } from '../hooks/useAdmisiones';
import { DeleteAdmisionesModal } from './modals/DeleteAdmisionesModals';
import type { AdmissionsItem } from '../types/AdmisionesItem';
import type { AdmissionPayload } from '../types/AdmisionesPayload';
import { AdmissionFormModal } from './modals/AdmisionesFormModal';

export function AdmissionsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    admissions,
    error,
    deleteAdmissionById,
    createAdmissionData,
    updateAdmissionData,
  } = useAdmisiones();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (admission: AdmissionsItem) => {
    setSelectedAdmission(admission);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (admission: AdmissionsItem) => {
    setSelectedAdmission(admission);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmission) return;
    try {
      await deleteAdmissionById(selectedAdmission.id);
      setIsDeleteModalOpen(false);
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error deleting admission:', error);
    }
  };

const filteredAdmissions = useMemo<AdmissionsItem[]>(() => {
  const list = admissions ?? []; // asegúrate de tener array
  if (!searchTerm.trim()) return list;

  const term = searchTerm.toLowerCase();
  return list.filter(a =>
    a.name?.toLowerCase().includes(term) ||
    a.status?.toLowerCase().includes(term) ||
    a.email?.toLowerCase().includes(term) ||
    a.programs?.some((p: { name: string }) => p.name?.toLowerCase().includes(term)) // tip explícito
  );
}, [admissions, searchTerm]);

  const getInitial = (a: AdmissionsItem) =>
    (a.name?.trim()?.charAt(0)?.toUpperCase() || '?');

  // Si quieres prellenar el modal con partes del nombre, partimos el full name
  const splitFullName = (full: string) => {
    const parts = (full || '').trim().split(/\s+/);
    if (parts.length === 0) return { nombre: '', apellidoPaterno: '', apellidoMaterno: '' };
    if (parts.length === 1) return { nombre: parts[0], apellidoPaterno: '', apellidoMaterno: '' };
    if (parts.length === 2) return { nombre: parts[0], apellidoPaterno: parts[1], apellidoMaterno: '' };
    // nombre = todo menos los 2 últimos tokens
    return {
      nombre: parts.slice(0, -2).join(' '),
      apellidoPaterno: parts.slice(-2, -1)[0],
      apellidoMaterno: parts.slice(-1)[0],
    };
  };

  const mapToAdmissionFormData = (a: AdmissionsItem): AdmissionPayload => {
    const { nombre, apellidoPaterno, apellidoMaterno } = splitFullName(a.name || '');
    return {
      email: a.email || '',
      password: '', // opcional al editar
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento: new Date().toISOString().split('T')[0], // no lo tenemos en el VM, default hoy
      calle: '',                  // no existe en VM; deja vacío o busca por id antes de editar
      numero: '',
      codigoPostalId: 0,
      personaGeneroId: 1,
      // planEstudiosId: undefined, programaIds: undefined // si los usas
    };
  };

  const handleFormSubmit = async (data: AdmissionPayload) => {
    try {
      if (isEditing && selectedAdmission) {
        await updateAdmissionData(selectedAdmission.id, data);
      } else {
        await createAdmissionData(data);
      }
      setIsFormModalOpen(false);
      setSelectedAdmission(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving admission:', error);
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
              Error al cargar las admisiones: {error ?? 'Error desconocido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lista de Aspirantes</h2>
        <Button
          type="button"
          variant="default"
          onClick={() => {
            setSelectedAdmission(null);
            setIsEditing(false);
            setIsFormModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Aspirante
        </Button>
      </div>

      <div className="w-full md:w-1/3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Buscar aspirantes</label>
          <input
            type="text"
            placeholder="Buscar por nombre, estatus o programa..."
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
              <TableHead>Estatus</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredAdmissions ?? []).map((a: AdmissionsItem) => (
                <TableRow key={a.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                    <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {getInitial(a)}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                        {a.name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500">
                        {a.phone || 'Sin teléfono'}
                        </div>
                    </div>
                    </div>
                </TableCell>

                <TableCell className="text-sm text-gray-900">
                    {a.email || 'Sin email'}
                </TableCell>

                <TableCell>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {a.status || '—'}
                    </span>
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                    {a.registerDate ? new Date(a.registerDate).toLocaleDateString() : '—'}
                </TableCell>

                <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label="Editar aspirante"
                        onClick={() => handleEdit(a)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label="Eliminar aspirante"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(a)}
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
        <AdmissionFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedAdmission(null);
            setIsEditing(false);
          }}
          onSubmit={handleFormSubmit}
          admission={isEditing && selectedAdmission ? mapToAdmissionFormData(selectedAdmission) : undefined}
        />
      )}

      {isDeleteModalOpen && selectedAdmission && (
        <DeleteAdmisionesModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedAdmission(null);
          }}
          onConfirm={handleDeleteConfirm}
          admissionName={selectedAdmission.name || 'este aspirante'}
        />
      )}
    </div>
  );
}
