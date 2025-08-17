"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";

type StudentList = {
  id: number;
  name: string;
  username: string;
  class: { name: string };
  phone: string;
  address: string;
  img?: string;
};

const DEFAULT_AVATAR = "/avatar.png"; // <- está en /public/avatar.png

const StudentListPage = () => {
  const role = "admin";

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const data: StudentList[] = [
    { id: 1,  name: "Juan Pérez",        username: "jperez",     class: { name: "3°A" }, phone: "555-1001", address: "Calle 1, Ciudad"  },
    { id: 2,  name: "María López",       username: "mlopez",     class: { name: "4°B" }, phone: "555-1002", address: "Calle 2, Ciudad"  },
    { id: 3,  name: "Carlos Ramírez",    username: "cramirez",   class: { name: "2°C" }, phone: "555-1003", address: "Calle 3, Ciudad"  },
    { id: 4,  name: "Ana Torres",        username: "atorres",    class: { name: "1°B" }, phone: "555-1004", address: "Calle 4, Ciudad"  },
    { id: 5,  name: "Luis García",       username: "lgarcia",    class: { name: "5°A" }, phone: "555-1005", address: "Calle 5, Ciudad"  },
    { id: 6,  name: "Sofía Hernández",   username: "shernandez", class: { name: "3°B" }, phone: "555-1006", address: "Calle 6, Ciudad"  },
    { id: 7,  name: "Diego Mendoza",     username: "dmendoza",   class: { name: "2°A" }, phone: "555-1007", address: "Calle 7, Ciudad"  },
    { id: 8,  name: "Valeria Sánchez",   username: "vsanchez",   class: { name: "4°C" }, phone: "555-1008", address: "Calle 8, Ciudad"  },
    { id: 9,  name: "Pedro Morales",     username: "pmorales",   class: { name: "1°A" }, phone: "555-1009", address: "Calle 9, Ciudad"  },
    { id: 10, name: "Fernanda Castillo", username: "fcastillo",  class: { name: "5°B" }, phone: "555-1010", address: "Calle 10, Ciudad" },
    { id: 11, name: "José Rojas",        username: "jrojas",     class: { name: "3°C" }, phone: "555-1011", address: "Calle 11, Ciudad" },
    { id: 12, name: "Camila Flores",     username: "cflores",    class: { name: "2°B" }, phone: "555-1012", address: "Calle 12, Ciudad" },
  ];

  const renderRow = (item: StudentList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || DEFAULT_AVATAR}
          alt="avatar"
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.class.name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.class.name}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/list/student/${String(item.id)}`} prefetch={false}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <Image src="/view.png" alt="ver" width={16} height={16} />
              </button>
            </Link>
            <FormContainer table="student" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  const page = 1;
  const count = data.length;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Estudiantes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="student" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={page} count={count} />
    </div>
  );
};

export default StudentListPage;
