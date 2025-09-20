'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AdmissionPayload } from '../../types/AdmisionesPayload';

/* ===== Schemas (sin planEstudios*) ===== */
const baseSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un correo electrónico válido.' }),
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  apellidoPaterno: z.string().min(2, { message: 'El apellido paterno es requerido.' }),
  apellidoMaterno: z.string().min(2, { message: 'El apellido materno es requerido.' }),
  calle: z.string().min(3, { message: 'La calle es requerida.' }),
  numero: z.string().min(1, { message: 'El número es requerido.' }),
  fechaNacimiento: z.string().min(1, { message: 'La fecha de nacimiento es requerida.' }),
  personaGeneroId: z.coerce.number().min(1, { message: 'Por favor selecciona un género.' }),
  codigoPostalId: z.coerce.number().int().min(1, { message: 'El código postal (ID) es requerido.' }),

  // opcional: si lo mandas, el back lo usará; si no, ignóralo
  programaId: z.coerce.number().int().min(1).optional(),
});

const createSchema = baseSchema.extend({
  password: z
    .string()
    .min(8, { message: 'Mínimo 8 caracteres.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z]).*$/, { message: 'Incluye mayúscula y minúscula.' }),
});
const editSchema = baseSchema.extend({ password: z.string().optional() });

type AdmissionFormValues = z.infer<typeof createSchema> | z.infer<typeof editSchema>;

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdmissionPayload) => Promise<void>;
  admission?: AdmissionPayload;
  isSubmitting?: boolean;
}

export function AdmissionFormModal({
  isOpen,
  onClose,
  onSubmit,
  admission,
  isSubmitting = false,
}: AdmissionFormModalProps) {
  const isEdit = Boolean(admission);

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      email: '',
      password: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: new Date().toISOString().split('T')[0],
      calle: '',
      numero: '',
      personaGeneroId: 1,
      codigoPostalId: 0,
      programaId: undefined,
    },
  });

  useEffect(() => {
    if (admission) {
      form.reset({
        email: admission.email ?? '',
        password: '',
        nombre: admission.nombre ?? '',
        apellidoPaterno: admission.apellidoPaterno ?? '',
        apellidoMaterno: admission.apellidoMaterno ?? '',
        fechaNacimiento: admission.fechaNacimiento ?? new Date().toISOString().split('T')[0],
        calle: admission.calle ?? '',
        numero: admission.numero ?? '',
        personaGeneroId: admission.personaGeneroId ?? 1,
        codigoPostalId: admission.codigoPostalId ?? 0,
        programaId: (admission as any).programaId, // opcional si lo traes al editar
      });
    } else {
      form.reset({
        email: '',
        password: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: new Date().toISOString().split('T')[0],
        calle: '',
        numero: '',
        personaGeneroId: 1,
        codigoPostalId: 0,
        programaId: undefined,
      });
    }
  }, [admission, form, isOpen]);

  const handleSubmit = async (data: AdmissionFormValues) => {
    // no mandes keys undefined
    const cleaned: AdmissionPayload = Object.fromEntries(
      Object.entries(data as AdmissionPayload).filter(([, v]) => v !== undefined)
    ) as AdmissionPayload;

    await onSubmit(cleaned);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="
          w-[98vw] h-[96vh] max-w-none max-h-none
          p-0 bg-white rounded-xl shadow-xl
          overflow-hidden flex flex-col
        "
      >
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Aspirante' : 'Nuevo Aspirante'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1">
            {isEdit ? 'Actualiza la información' : 'Completa los datos requeridos'}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 min-h-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 h-full">
                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Nombre *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre" className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Apellido Paterno */}
                <FormField
                  control={form.control}
                  name="apellidoPaterno"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Apellido Paterno *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Apellido paterno" className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Apellido Materno */}
                <FormField
                  control={form.control}
                  name="apellidoMaterno"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Apellido Materno *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Apellido materno" className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Fecha de Nacimiento */}
                <FormField
                  control={form.control}
                  name="fechaNacimiento"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Fecha Nacimiento *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Género */}
                <FormField
                  control={form.control}
                  name="personaGeneroId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Género *</FormLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-lg text-sm">
                            <SelectValue placeholder="Género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Masculino</SelectItem>
                          <SelectItem value="2">Femenino</SelectItem>
                          <SelectItem value="3">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Calle */}
                <FormField
                  control={form.control}
                  name="calle"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Calle *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Calle" className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Número */}
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Número *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número" className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Código Postal */}
                <FormField
                  control={form.control}
                  name="codigoPostalId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Código Postal (ID) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={1}
                          placeholder="C.P."
                          className="h-10 rounded-lg text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Programa (opcional) */}
                <FormField
                  control={form.control}
                  name="programaId"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Programa (ID) <span className="text-xs text-gray-500">(opcional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                          }
                          min={1}
                          placeholder="Ej. 4"
                          className="h-10 rounded-lg text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email - Ancho */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2 col-span-2 sm:col-span-3 lg:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Correo Electrónico *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="correo@ejemplo.com" className="h-10 rounded-lg text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Password - solo crear */}
                {!isEdit && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2 col-span-2 sm:col-span-3 lg:col-span-2">
                        <FormLabel className="text-sm font-medium text-gray-700">Contraseña *</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} placeholder="••••••••" className="h-10 rounded-lg text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border-gray-300 hover:bg-gray-50 text-sm font-medium flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={form.handleSubmit(handleSubmit)}
              className="h-11 px-5 rounded-lg text-sm font-medium flex-1 sm:flex-none min-w-[140px]
             bg-black text-white hover:bg-black"  /* Fondo blanco, texto negro */
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Guardando...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <span className="truncate">
                  {isEdit ? 'Actualizar' : 'Agregar'}
                  <span className="hidden sm:inline"> Aspirante</span>
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
