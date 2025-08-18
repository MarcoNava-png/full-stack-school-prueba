"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import FormContainer from "@/components/FormContainer";
import { getTeachers } from "@/services/teachersService";
import { TeacherItem } from "@/types/TeacherItem";
import { TeacherResponse } from "@/types/TeacherReponse";

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
  const role = "admin"; // Simulación

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
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="Ver" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormContainer table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Profesores</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filtrar" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Ordenar" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={teachers} />
      <Pagination page={1} count={teachers.length} />
    </div>
  );
};

export default TeacherListPage;
