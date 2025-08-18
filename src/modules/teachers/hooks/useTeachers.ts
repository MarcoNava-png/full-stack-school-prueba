import { useState, useEffect, useCallback } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../teachers.module';
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

  const createTeacher: any = async (teacherData: TeacherPayload) => {
    try {
      setLoading(true);
      const newTeacher = await createTeacher(teacherData);
      setTeachers(prev => [...prev, newTeacher]);
      return newTeacher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el profesor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeacher: any = async (id: string, teacherData: Partial<TeacherPayload>) => {
    try {
      setLoading(true);
      const updatedTeacher = await updateTeacher(id, teacherData);
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

  const deleteTeacher: any = async (id: string) => {
    try {
      setLoading(true);
      await deleteTeacher(id);
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
