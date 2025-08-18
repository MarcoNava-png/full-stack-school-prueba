import { useState, useEffect, useCallback } from 'react';
import { getTeachers, createTeacher as createTeacherApi, updateTeacher as updateTeacherApi, deleteTeacher as deleteTeacherApi } from '../teachers.module';
import { TeacherResponse } from '../types/TeacherResponse';
import { TeacherPayload } from '../types/TeacherPayload';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los profesores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const createTeacher = async (teacherData: TeacherPayload) => {
    try {
      setLoading(true);
      const newTeacher = await createTeacherApi(teacherData);
      setTeachers(prev => [newTeacher, ...prev]);
      return newTeacher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeacher = async (id: string, teacherData: Partial<TeacherPayload>) => {
    try {
      setLoading(true);
      const updatedTeacher = await updateTeacherApi(id, teacherData);
      setTeachers(prev =>
        prev.map(teacher => teacher.id.toString() === id ? updatedTeacher : teacher)
      );
      return updatedTeacher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      setLoading(true);
      await deleteTeacherApi(id);
      setTeachers(prev => prev.filter(teacher => teacher.id.toString() !== id));
    } catch (err) {
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
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
