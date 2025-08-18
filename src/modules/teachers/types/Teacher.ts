export interface Teacher {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    status: 'active' | 'inactive' | 'on_leave';
    hireDate?: Date;
}