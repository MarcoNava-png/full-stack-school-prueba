"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { id: string }; // id del estudiante
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7169";

// Normalizamos distintos shapes posibles del backend
function getStatus(v: any): "present" | "absent" | "late" | "unknown" {
  const s = (v?.status ?? v?.attendanceStatus ?? v?.state ?? "").toString().toLowerCase();
  if (["present", "p", "asistio", "asistencia"].includes(s)) return "present";
  if (["absent", "a", "falta"].includes(s)) return "absent";
  if (["late", "l", "tarde", "retraso"].includes(s)) return "late";
  return "unknown";
}

export default function StudentAttendanceCard({ id }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token") ?? "";
        // Ajusta este endpoint al tuyo si es diferente:
        const res = await fetch(`${API_URL}/api/students/${id}/attendance?range=30`, {
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          cache: "no-store",
        });
        const json = res.ok ? await res.json() : { data: [] };
        setItems(Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const stats = useMemo(() => {
    const total = items.length;
    const present = items.filter((x) => getStatus(x) === "present").length;
    const absent = items.filter((x) => getStatus(x) === "absent").length;
    const late = items.filter((x) => getStatus(x) === "late").length;
    const rate = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, rate };
  }, [items]);

  if (loading) return <div className="text-sm text-gray-500">Cargando asistencia…</div>;

  return (
    <div>
      <h2 className="text-sm text-gray-500">Asistencia últimos 30 días</h2>
      <div className="text-2xl font-semibold">{stats.rate}%</div>
      <div className="h-2 bg-gray-200 rounded-full mt-2">
        <div
          className="h-2 bg-lamaSky rounded-full"
          style={{ width: `${stats.rate}%`, transition: "width .3s ease" }}
        />
      </div>
      <div className="mt-3 text-xs text-gray-600 flex gap-4">
        <span>Presente: {stats.present}</span>
        <span>Faltas: {stats.absent}</span>
        <span>Tarde: {stats.late}</span>
        <span>Total: {stats.total}</span>
      </div>
    </div>
  );
}
