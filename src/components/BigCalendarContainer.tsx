"use client";

import { useEffect, useState } from "react";
import BigCalendar from "./BigCalender"; // mismo componente que ya usas

type Props = { type: "classId" | "teacherId" | "studentId"; id: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7169";

type CalEvent = { id: string; title: string; start: Date; end: Date };

export default function BigCalendarContainer({ type, id }: Props) {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("token") ?? "";
        // Ajusta estos endpoints a los que tengas en tu API:
        let url = "";
        if (type === "classId") url = `${API_URL}/api/classes/${id}/schedule`;
        else if (type === "teacherId")
          url = `${API_URL}/api/teachers/${id}/schedule`;
        else url = `${API_URL}/api/students/${id}/schedule`;

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        const json = res.ok ? await res.json() : { data: [] };

        const items = (json.data ?? json ?? []).map((e: any) => ({
          id: e.id ?? crypto.randomUUID(),
          title: e.title ?? e.subjectName ?? "Clase",
          start: new Date(e.start ?? e.startDate ?? e.from),
          end: new Date(e.end ?? e.endDate ?? e.to),
        }));

        setEvents(items);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [type, id]);

  if (loading) return <div className="text-sm text-gray-500">Cargando horario…</div>;
  return <BigCalendar data={events} />;
}
