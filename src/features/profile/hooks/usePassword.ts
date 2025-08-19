import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileService } from '../services/profile.service';
import { passwordFormSchema, PasswordFormData } from '../schemas/profile.schema';

export function usePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePassword = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);
      const result = await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      
      if (result.success) {
        form.reset();
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
      }
      
      return result;
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, error: 'No se pudo cambiar la contraseña' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isSuccess,
    changePassword,
  };
}
