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

type StudentApi = any; // <-- tipa según tu DTO real si quieres
type StudentView = {
  id: string;
  img?: string | null;
  name: string;
  surname: string;
  bloodType?: string | null;
  birthday?: string | null;
  email?: string | null;
  phone?: string | null;
  class?: { id: string; name: string; _count?: { lessons: number } };
};

function mapToView(s: StudentApi): StudentView {
  // Intenta armar nombre y apellidos desde distintos posibles campos
  const fullName: string =
    s.fullName ??
    [s.firstName ?? s.name, s.lastName ?? s.surname].filter(Boolean).join(" ");

  const [first, ...rest] = (fullName ?? "").trim().split(/\s+/);
  const surname = rest.join(" ");

  return {
    id: s.id,
    img: s.img ?? s.photoUrl ?? null,
    name: first ?? "",
    surname: surname ?? "",
    bloodType: s.bloodType ?? null,
    birthday: s.birthDate ?? s.birthday ?? null,
    email: s.email ?? null,
    phone: s.phone ?? null,
    class: s.class ?? s.group ?? s.classroom ?? {
      id: s.classId ?? "",
      name: s.className ?? "",
      _count: { lessons: s.lessonsCount ?? 0 },
    },
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

        const res = await fetch(`${API_URL}/api/students/${id}`, {
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

        const json = await res.json(); // { data: ... }
        setStudent(mapToView(json.data ?? json));
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
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.img || "/Avatar.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {`${student.name} ${student.surname}`.trim()}
                </h1>
                {role === "admin" && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {/* Puedes reemplazar esto por biografía/notas si tu API lo trae */}
                Información general del estudiante.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType ?? "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {student.birthday
                      ? new Intl.DateTimeFormat("es-MX").format(
                          new Date(student.birthday)
                        )
                      : "-"}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email ?? "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="loading...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {(student.class?.name?.charAt(0) ?? "-") + "th"}
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {student.class?._count?.lessons ?? 0}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {student.class?.name ?? "-"}
                </h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          {student.class?.id ? (
            <BigCalendarContainer type="classId" id={student.class.id} />
          ) : (
            <div className="text-sm text-gray-500 mt-2">
              Sin clase asignada.
            </div>
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
