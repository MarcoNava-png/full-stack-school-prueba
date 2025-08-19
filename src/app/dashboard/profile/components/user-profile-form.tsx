'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const profileFormSchema = z.object({
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

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function UserProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

  // TODO: Replace with actual user data from your auth context or API
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@ejemplo.com',
    phone: '+51 999 999 999',
    bio: 'Docente de matemáticas con 5 años de experiencia.',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      // TODO: Replace with your API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
    //   toast({
    //     title: 'Perfil actualizado',
    //     description: 'Tu perfil se ha actualizado correctamente.',
    //   });
    } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Ocurrió un error al actualizar el perfil. Por favor, inténtalo de nuevo.',
    //     variant: 'destructive',
    //   });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Tus nombres" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Tus apellidos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+51 999 999 999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografía</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos sobre ti..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Una breve descripción sobre ti que se mostrará en tu perfil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
