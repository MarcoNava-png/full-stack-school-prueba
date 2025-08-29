import { useState, useEffect, useCallback } from 'react';
import { CoordinatorResponse } from '../types/CoordinatorResponse';
import { CoordinatorPayload } from '../types/CoordinatorPayload';
import { createCoordinator, deleteCoordinator, getCoordinators, updateCoordinator } from '../services/coordinatorsService';
import { Coordinator } from '../types/Coordinator';

export const useCoordinators = () => {
  const [Coordinators, setCoordinators] = useState<Coordinator[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoordinators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCoordinators();
      setCoordinators(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los profesores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoordinators();
  }, [fetchCoordinators]);

  const createCoordinatorData = async (CoordinatorData: CoordinatorPayload) => {
    try {
      setLoading(true);
      const newCoordinator = await createCoordinator(CoordinatorData);
      setCoordinators(prev => [newCoordinator, ...prev || []]);
      return newCoordinator;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCoordinatorData = async (id: string, CoordinatorData: Partial<CoordinatorPayload>) => {
    try {
      setLoading(true);
      const updatedCoordinator = await updateCoordinator(id, CoordinatorData);
      setCoordinators(prev =>
        prev?.map(Coordinator => Coordinator.id.toString() === id ? updatedCoordinator : Coordinator)
      );
      return updatedCoordinator;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoordinatorById = async (id: string) => {
    try {
      setLoading(true);
      await deleteCoordinator(id);
      setCoordinators(prev => prev?.filter(coordinator => coordinator.id.toString() !== id.toString()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    Coordinators,
    loading,
    error,
    fetchCoordinators,
    createCoordinatorData,
    updateCoordinatorData,
    deleteCoordinatorById,
  };
};
