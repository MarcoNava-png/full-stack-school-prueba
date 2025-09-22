"use client";

import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7169";

type StudentApi = {
  idEstudiante: number;
  matricula: string;
  nombreCompleto: string;
  telefono: string | null;
  planEstudios: string;
  materias?: string[];
};

type StudentView = {
  id: number;
  matricula: string;
  nombreCompleto: string;
  telefono: string | null;
  planEstudios: string;
  materias: string[];
};

function mapToView(s: StudentApi): StudentView {
  return {
    id: s.idEstudiante,
    matricula: s.matricula,
    nombreCompleto: s.nombreCompleto,
    telefono: s.telefono,
    planEstudios: s.planEstudios,
    materias: s.materias ?? [],
  };
}

export default function SingleStudentPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [student, setStudent] = useState<StudentView | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("usuario");
        if (userStr) setRole(JSON.parse(userStr)?.role ?? null);

        if (!id) return;

        const res = await fetch(`http://localhost:7169/api/estudiantes/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!res.ok) {
          setStudent(null);
          return;
        }

        const json = await res.json();
        setStudent(mapToView(json));
      } catch {
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (!student) return <div className="p-6">Estudiante no encontrado.</div>;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex gap-4">
        {/* USER INFO CARD */}
        <div className="bg-[#233f6a] text-white py-6 px-4 rounded-md flex flex-col items-center min-w-[220px] max-w-[220px]">
          <Image
            src={"/Avatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h1 className="text-lg font-semibold text-left w-full break-words">
            {student.nombreCompleto}
          </h1>
          <div className="mt-4 w-full text-sm">
            <div className="mb-2">
              Matrícula:{" "}
              <span className="font-mono">{student.matricula}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span>
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="inline-block mr-1"
                >
                  <path d="M3 5a5 5 0 1 1 10 0c0 2.5-2.5 6-5 6s-5-3.5-5-6zm5-3a3 3 0 0 0-3 3c0 1.5 1.5 4 3 4s3-2.5 3-4a3 3 0 0 0-3-3z" />
                </svg>
              </span>
              {student.telefono ?? "-"}
            </div>
            <div>
              Plan de estudios: <span>{student.planEstudios}</span>
            </div>
          </div>
        </div>
        {/* Materias */}
        <div className="bg-white p-6 rounded-md flex-1">
          <h2 className="font-semibold mb-2">Materias</h2>
          {student.materias.length > 0 ? (
            <ul className="list-disc pl-6">
              {student.materias.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">Sin materias asignadas.</span>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            {student.class?.id && (
              <>
                <Link
                  className="p-3 rounded-md bg-lamaSkyLight"
                  href={`/list/lessons?classId=${student.class.id}`}
                >
                  Student&apos;s Lessons
                </Link>
                <Link
                  className="p-3 rounded-md bg-lamaPurpleLight"
                  href={`/list/teachers?classId=${student.class.id}`}
                >
                  Student&apos;s Teachers
                </Link>
                <Link
                  className="p-3 rounded-md bg-pink-50"
                  href={`/list/exams?classId=${student.class.id}`}
                >
                  Student&apos;s Exams
                </Link>
                <Link
                  className="p-3 rounded-md bg-lamaSkyLight"
                  href={`/list/assignments?classId=${student.class.id}`}
                >
                  Student&apos;s Assignments
                </Link>
              </>
            )}
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results?studentId=${student.id}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}
   
         