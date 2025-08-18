"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import FormContainer from "@/components/FormContainer";
import { getTeachers, updateTeacher } from "@/services/teachersService";
import { TeacherItem } from "@/types/TeacherItem";
import { TeacherResponse } from "@/types/TeacherResponse";
import EditTeacherModal from "@/components/modals/EditTeacherModal";
import TeacherFormModal from "@/components/modals/TeacherFormModal";
import DeleteTeacherModal from "@/components/modals/DeleteTeacherModal";

const mapTeacherResponse = (teacher: TeacherResponse): TeacherItem => ({
  id: teacher.id,
  name: `${teacher.persona.nombre} ${teacher.persona.apellidoPaterno} ${teacher.persona.apellidoMaterno}`.trim(),
  email: teacher.persona.correoElectronico,
  phone: teacher.persona.telefono,
  speciality: teacher.especialidad,
  joinDate: teacher.fechaAlta,
  img: "/avatar.png",
  subjects: [],
  classes: []
});

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = "admin"; // Simulación

  const handleEdit = (teacher: TeacherItem) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleDeleteTeacher = async (teacherId: string | number) => {
    try {
      // Update local state to remove the deleted teacher
      setTeachers(teachers.filter(teacher => 
        String(teacher.id) !== String(teacherId)
      ));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setError('Error al eliminar el profesor');
    }
  };

  const handleUpdateTeacher = async (updatedTeacher: TeacherItem) => {
    try {
      // Update in the API
      await updateTeacher(updatedTeacher);

      // Update local state
      setTeachers(teachers.map(teacher =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      ));

      setIsEditModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error updating teacher:', error);
      setError('Error al actualizar el profesor');
    }
  };

  const handleTeacherCreated = async (newTeacher: TeacherResponse) => {
    try {
      setIsSubmitting(true);
      // Map the new teacher to the TeacherItem format
      const mappedTeacher = mapTeacherResponse(newTeacher);
      // Add the new teacher to the beginning of the list
      setTeachers(prevTeachers => [mappedTeacher, ...prevTeachers]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error handling new teacher:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        const mappedTeachers = data.map(mapTeacherResponse);
        setTeachers(mappedTeachers);
      } catch (err) {
        setError('Error al cargar los profesores');
        console.error('Error fetching teachers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (isLoading) return <div className="p-4">Cargando profesores...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Especialidad", accessor: "speciality", className: "hidden md:table-cell" },
    { header: "Fecha de Ingreso", accessor: "joinDate", className: "hidden md:table-cell" },
    { header: "Materias", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Clases", accessor: "classes", className: "hidden lg:table-cell" },
    { header: "Teléfono", accessor: "phone", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Acciones", accessor: "action" }] : []),
  ];

  const renderRow = (item: TeacherItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.speciality}</td>
      <td className="hidden md:table-cell">
        {new Date(item.joinDate).toLocaleDateString()}
      </td>
      <td className="hidden md:table-cell">
        {item.subjects?.map((s) => s.name).join(", ") || 'N/A'}
      </td>
      <td className="hidden lg:table-cell">
        {item.classes?.map((c) => c.name).join(", ") || 'N/A'}
      </td>
      <td className="hidden lg:table-cell">{item.phone || 'N/A'}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky"
          >
            <Image src="/view.png" alt="Editar" width={16} height={16} />
          </button>
          {role === "admin" && (
            <>
              <button
                onClick={() => {
                  setSelectedTeacher(item);
                  setIsDeleteModalOpen(true);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100"
              >
                <Image src="/delete.png" alt="Eliminar" width={16} height={16} />
              </button>
              <DeleteTeacherModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                teacher={selectedTeacher} 
                onDelete={handleDeleteTeacher} 
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profesores</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Agregar Profesor'}
        </button>
      </div>

      <Table columns={columns} renderRow={renderRow} data={teachers} />
      <Pagination page={1} count={teachers.length} />

      {isEditModalOpen && selectedTeacher && (
        <EditTeacherModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTeacher(null);
          }}
          teacher={selectedTeacher}
          onSave={handleUpdateTeacher}
        />
      )}

      <TeacherFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        type="create"
        onSuccess={handleTeacherCreated}
      />
    </div>
  );
};

export default TeacherListPage;
