"use client";

import Image from "next/image";
import Link from "next/link";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import FormContainer from "@/components/FormContainer";

// Tipo para un profesor
type TeacherItem = {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  img: string;
  subjects: { name: string }[];
  classes: { name: string }[];
};

const data: TeacherItem[] = [
  {
    id: 1,
    name: "Carlos Ramírez",
    email: "carlos.ramirez@escuela.edu",
    username: "cramirez",
    phone: "555-1234",
    address: "Calle Falsa 123",
    img: "/avatar.png",
    subjects: [{ name: "Matemáticas" }],
    classes: [{ name: "1A" }, { name: "2B" }],
  },
  {
    id: 2,
    name: "María González",
    email: "maria.gonzalez@escuela.edu",
    username: "mgonzalez",
    phone: "555-5678",
    address: "Av. Principal 456",
    img: "/avatar.png",
    subjects: [{ name: "Historia" }],
    classes: [{ name: "3A" }],
  },
];

const TeacherListPage = () => {
  const role = "admin"; // Simulación

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "ID", accessor: "teacherId", className: "hidden md:table-cell" },
    { header: "Materias", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Clases", accessor: "classes", className: "hidden md:table-cell" },
    { header: "Teléfono", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Dirección", accessor: "address", className: "hidden lg:table-cell" },
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
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.subjects.map((s: { name: string }) => s.name).join(", ")}
      </td>
      <td className="hidden md:table-cell">
        {item.classes.map((c: { name: string }) => c.name).join(", ")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
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

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={1} count={data.length} />
    </div>
  );
};

export default TeacherListPage;
