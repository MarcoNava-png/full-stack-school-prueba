'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Key, Loader2 } from 'lucide-react';
import { useState } from 'react';

const passwordFormSchema = z.object({
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
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //   const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: PasswordFormValues) {
    try {
      setIsLoading(true);
      // TODO: Replace with your API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      form.reset();

      //   toast({
      //     title: 'Contraseña actualizada',
      //     description: 'Tu contraseña ha sido actualizada correctamente.',
      //   });
    } catch (error) {
      //   toast({
      //     title: 'Error',
      //     description: 'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.',
      //     variant: 'destructive',
      //   });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña actual</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña actual"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva contraseña</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu nueva contraseña"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>La contraseña debe contener al menos:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>8 caracteres</li>
                    <li>1 letra mayúscula</li>
                    <li>1 número</li>
                    <li>1 carácter especial</li>
                  </ul>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nueva contraseña</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirma tu nueva contraseña"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Cambiar contraseña
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
