"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createTeacher } from '@/services/teachersService';
import { TeacherResponse } from '@/features/teachers/types/TeacherResponse';
import InputField from '../InputField';

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." })
    .max(20, { message: "El nombre de usuario debe tener como máximo 20 caracteres." }),
  email: z.string().email({ message: "Correo electrónico no válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  firstName: z.string().min(1, { message: "El nombre es obligatorio." }),
  lastName: z.string().min(1, { message: "El apellido es obligatorio." }),
  phone: z.string().min(1, { message: "El teléfono es obligatorio." }),
  address: z.string().min(1, { message: "La dirección es obligatoria." }),
  bloodType: z.string().min(1, { message: "El tipo de sangre es obligatorio." }),
  birthday: z.string().min(1, { message: "La fecha de nacimiento es obligatoria." }),
  sex: z.enum(["male", "female"], { message: "El género es obligatorio." }),
});

type Inputs = z.infer<typeof schema>;

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "update";
  data?: any;
  onSuccess?: (newTeacher: TeacherResponse) => void;
}

const TeacherFormModal = ({ 
  isOpen, 
  onClose, 
  type, 
  data, 
  onSuccess 
}: TeacherFormModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      birthday: data?.birthday ? new Date(data.birthday).toISOString().split('T')[0] : ''
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const teacherData = {
        email: formData.email,
        password: formData.password,
        nombre: formData.firstName,
        apellidoPaterno: formData.lastName,
        apellidoMaterno: "", // Add this field if needed in your form
        fechaNacimiento: formData.birthday, // Already in YYYY-MM-DD format from input
        personaGeneroId: formData.sex === "male" ? 1 : 2, // Adjust gender IDs as per your system
        especialidad: "General", // Add a specialty field if needed
      };

      const newTeacher = await createTeacher(teacherData);
      toast.success('Profesor creado exitosamente');

      if (onSuccess) {
        onSuccess(newTeacher);
      }
      onClose();
    } catch (error) {
      console.error('Error creating teacher:', error);
      toast.error('Error al crear el profesor');
    }
  });

  if (!isOpen) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <span className="h-6 w-6 flex items-center justify-center text-lg font-bold">×</span>
                  </button>
                </div>
                <form onSubmit={onSubmit} className="mt-2">
          <h1 className="text-xl font-semibold">Crea un nuevo profesor</h1>
          <span className="text-xs text-gray-400 font-medium">
            Autenticación de información
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Nombre de usuario"
              name="username"
              defaultValue={data?.username}
              register={register}
              error={errors?.username}
            />
            
            <InputField
              label="Correo"
              name="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
            />

            <InputField
              label="Contraseña"
              name="password"
              type="password"
              defaultValue={data?.password}
              register={register}
              error={errors?.password}
            />

          </div>
          <span className="text-xs text-gray-400 font-medium">
            Información Personal
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            
            <InputField
              label="Nombre Completo"
              name="firstName"
              defaultValue={data?.firstName}
              register={register}
              error={errors.firstName}
            />

            <InputField
              label="Apellidos"
              name="lastName"
              defaultValue={data?.lastName}
              register={register}
              error={errors.lastName}
            />

            <InputField
              label="Telefono"
              name="phone"
              defaultValue={data?.phone}
              register={register}
              error={errors.phone}
            />

            <InputField
              label="Dirección"
              name="address"
              defaultValue={data?.address}
              register={register}
              error={errors.address}
            />

            <InputField
              label="Tipo De Sangre"
              name="bloodType"
              defaultValue={data?.bloodType}
              register={register}
              error={errors.bloodType}
            />

            <InputField
              label="Fecha de Nacimiento"
              name="birthday"
              defaultValue={data?.birthday}
              register={register}
              error={errors.birthday}
              type="date"
            />

            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Genero</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("sex")}
                defaultValue={data?.sex}
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
              {errors.sex?.message && (
                <p className="text-xs text-red-400">
                  {errors.sex.message.toString()}
                </p>
              )}
            </div>
            
          </div>
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TeacherFormModal;