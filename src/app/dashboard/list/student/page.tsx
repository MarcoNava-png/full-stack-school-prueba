"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";

type StudentApiItem = {
  idEstudiante: number;
  matricula: string;
  nombreCompleto: string;
  telefono: string | null;
  planEstudios: string;
};

const DEFAULT_AVATAR = "/avatar.png";

const StudentListPage = () => {
  const role = "admin";
  const [data, setData] = useState<StudentApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const columns = [
    { header: "Matrícula", accessor: "matricula" },
    { header: "Nombre", accessor: "nombreCompleto" },
    { header: "Teléfono", accessor: "telefono", className: "hidden md:table-cell" },
    { header: "Plan de Estudios", accessor: "planEstudios", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const result = await apiFetch(`/api/estudiantes?page=${page}&pageSize=${pageSize}`);
        setData(result.items || []);
        setTotalItems(result.totalItems || 0);
      } catch (e) {
        setData([]);
        setTotalItems(0);
      }
      setLoading(false);
    };
    fetchStudents();
  }, [page, pageSize]);

  const renderRow = (item: StudentApiItem) => (
    <tr key={item.idEstudiante} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td>{item.matricula}</td>
      <td>
        <div className="flex items-center gap-4">
          <Image
            src={DEFAULT_AVATAR}
            alt="avatar"
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.nombreCompleto}</h3>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.telefono ?? "—"}</td>
      <td className="hidden md:table-cell">{item.planEstudios}</td>
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/list/student/${String(item.idEstudiante)}`} prefetch={false}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <Image src="/view.png" alt="ver" width={16} height={16} />
              </button>
            </Link>
            <FormContainer table="student" type="delete" id={item.idEstudiante} />
          </div>
        </td>
      )}
    </tr>
  );

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
      <Pagination page={page} count={totalItems} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
};

export default StudentListPage;
