import { UserProfile, ChangePasswordData } from '../types';

// Mock user data - Replace with actual API calls
const MOCK_USER: UserProfile = {
  id: '1',
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@ejemplo.com',
  phone: '+51 999 999 999',
  bio: 'Docente de matemáticas con 5 años de experiencia.',
  role: 'teacher',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const profileService = {
  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER), 500);
    });
  },

  // Update profile
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...MOCK_USER, ...data, updatedAt: new Date().toISOString() };
        resolve(updatedUser);
      }, 800);
    });
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{ success: boolean }> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Password changed:', data);
        resolve({ success: true });
      }, 800);
    });
  },
};
