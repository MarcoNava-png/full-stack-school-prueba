import { useState, useEffect, useCallback } from 'react';
import { TeacherResponse, TeacherItem } from '../types/TeacherResponse';
import { TeacherPayload } from '../types/TeacherPayload';
import { createTeacher, deleteTeacher, getTeachers, updateTeacher } from '../services/teachersService';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeachers();
      setTeachers(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los profesores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const createTeacherData = async (teacherData: TeacherPayload) => {
    try {
      setLoading(true);
      const newTeacher = await createTeacher(teacherData);
      setTeachers(prev => [newTeacher, ...prev]);
      return newTeacher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherData = async (id: string, teacherData: Partial<TeacherPayload>) => {
    try {
      setLoading(true);
      const updatedTeacher = await updateTeacher(id, teacherData);
      setTeachers(prev =>
        prev?.map(teacher => teacher.id.toString() === id ? updatedTeacher : teacher)
      );
      return updatedTeacher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacherById = async (id: string) => {
    try {
      setLoading(true);
      await deleteTeacher(id);
      setTeachers((prev: TeacherItem[]) =>
        prev.filter((teacher: TeacherItem) => teacher.id.toString() !== id.toString())
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacherData,
    updateTeacherData,
    deleteTeacherById,
  };
};
