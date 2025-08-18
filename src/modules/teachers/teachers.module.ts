export const TeachersModule = {
  name: 'TeachersModule',
  routes: {
    base: '/dashboard/list/teachers',
    detail: (id: string | number) => `${id}`,
    create: 'create',
    edit: (id: string | number) => `${id}/edit`
  }
} as const;

export * from './services/teachersService';

export * from './hooks/useTeachers';

export * from './components/TeacherList';
export * from './components/modals/DeleteTeacherModal';
export * from './components/modals/TeacherFormModal';