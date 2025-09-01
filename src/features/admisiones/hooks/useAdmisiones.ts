// features/admissions/hooks/useAdmisiones.ts
import { useState, useEffect, useCallback } from 'react';

import type { AdmissionItem, AdmissionResponse } from '../types/AdmisionesResponse';
import type { AdmissionsItem } from '../types/AdmisionesItem';
import type { AdmissionPayload } from '../types/AdmisionesPayload';

import {
  getAdmissions,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from '../services/admisionesService';

// Map API -> ViewModel
function mapApiToVm(a: AdmissionItem): AdmissionsItem {
  const fullName = [a.persona?.nombre, a.persona?.apellidoPaterno, a.persona?.apellidoMaterno]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    id: a.id,
    name: fullName || 'Sin nombre',
    email: (a as any)?.persona?.user?.email ?? '—',         // si aún no lo trae tu API
    phone: (a as any)?.persona?.user?.phoneNumber ?? '—',   // idem
    status: a.estatus || '—',
    registerDate: a.fechaRegistro,
    img: '',
    programs: (a.programas ?? []).map(p => ({ name: p.programa })), // API usa "programa"
    // plans: ... si luego expones PlanEstudios
  };
}

export const useAdmisiones = () => {
  const [admissions, setAdmissions] = useState<AdmissionsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdmissions(); // <- AdmissionResponse
      const itemsVm = (data?.items ?? []).map(mapApiToVm);
      setAdmissions(itemsVm);             // <- ahora es AdmissionsItem[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las admisiones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  const createAdmissionData = async (payload: AdmissionPayload) => {
    try {
      setLoading(true);
      const createdApi = await createAdmission(payload); // AdmissionItem
      const createdVm = mapApiToVm(createdApi);
      setAdmissions(prev => [createdVm, ...prev]);
      return createdVm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la admisión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAdmissionData = async (id: string | number, payload: Partial<AdmissionPayload>) => {
    try {
      setLoading(true);
      const updatedApi = await updateAdmission(id, payload); // AdmissionItem
      const updatedVm = mapApiToVm(updatedApi);
      setAdmissions(prev => prev.map(x => (String(x.id) === String(id) ? updatedVm : x)));
      return updatedVm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la admisión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmissionById = async (id: string | number) => {
    try {
      setLoading(true);
      await deleteAdmission(id);
      setAdmissions(prev => prev.filter(x => String(x.id) !== String(id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la admisión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    admissions,          // <- AdmissionsItem[]
    loading,
    error,
    fetchAdmissions,
    createAdmissionData,
    updateAdmissionData,
    deleteAdmissionById,
  };
};
