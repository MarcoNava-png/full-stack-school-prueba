export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ProfileFormValues = Omit<UserProfile, 'id' | 'role' | 'createdAt' | 'updatedAt'>;
