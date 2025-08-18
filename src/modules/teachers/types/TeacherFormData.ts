export interface TeacherFormData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    status: 'active' | 'inactive' | 'on_leave';
    hireDate?: string;
}