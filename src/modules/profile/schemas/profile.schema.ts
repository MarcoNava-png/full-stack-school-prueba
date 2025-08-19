import { z } from 'zod';
import { ProfileFormValues, ChangePasswordData } from '../types';

export const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  lastName: z.string().min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: 'La contraseña actual es requerida',
    }),
    newPassword: z
      .string()
      .min(8, {
        message: 'La nueva contraseña debe tener al menos 8 caracteres',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Debe contener al menos una letra mayúscula',
      })
      .refine((value) => /[0-9]/.test(value), {
        message: 'Debe contener al menos un número',
      })
      .refine((value) => /[^A-Za-z0-9]/.test(value), {
        message: 'Debe contener al menos un carácter especial',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type PasswordFormData = z.infer<typeof passwordFormSchema>;
