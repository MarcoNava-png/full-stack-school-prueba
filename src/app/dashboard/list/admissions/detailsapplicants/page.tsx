"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AdmissionsItem } from "@/features/admisiones/types/AdmisionesItem";
import { useAdmisiones } from "@/features/admisiones/hooks/useAdmisiones";

/* ---------- Tipos auxiliares ---------- */
type Stats = { contacts: number; notes: number; tasksOpen: number };

/* ---------- UI helpers ---------- */
function Callout() {
  return (
    <div className="mb-4 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-4 text-sm text-blue-800">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-blue-700">
          ℹ️
        </div>
        <div>
          <p className="font-semibold">Seguimiento de Aspirantes</p>
          <p className="mt-0.5">
            Llega aquí desde <span className="font-medium">Admisiones</span> dando{" "}
            <span className="font-medium">doble-click</span> en un aspirante para ver su
            resumen, registrar contactos o agregar notas.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-gray-700">{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " +
        (props.className || "")
      }
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className={
        "w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " +
        (props.className || "")
      }
    />
  );
}

/* ---------- Panel de detalle ---------- */
function DetailPanel({
  item,
  stats,
  onClear,
}: {
  item: AdmissionsItem;
  stats: Stats;
  onClear: () => void;
}) {
  const [tab, setTab] = useState<"resumen" | "contacto" | "nota">("resumen");

  const programNames =
    item.programs?.map((p) => p?.name).filter(Boolean).join(", ") || "—";
  const planNames =
    item.plans?.map((p) => p?.name).filter(Boolean).join(", ") || "—";
  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${dd}/${m}/${y}`;
  };

  const [contact, setContact] = useState({
    date: "",
    time: "",
    channel: "",
    summary: "",
    nextAction: "",
  });
  const [note, setNote] = useState("");

  const guardarContacto = () => {
    alert(
      `Contacto registrado para ${item.name}\n${JSON.stringify(contact, null, 2)}`
    );
    setContact({ date: "", time: "", channel: "", summary: "", nextAction: "" });
    setTab("resumen");
  };

  const guardarNota = () => {
    alert(`Nota agregada a ${item.name}:\n${note}`);
    setNote("");
    setTab("resumen");
  };

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="truncate text-lg font-semibold">{item.name || "—"}</h2>
          <p className="text-xs text-gray-500">
            {item.email || "Sin correo"} • {item.phone || "Sin teléfono"}
          </p>
        </div>
        <button
          onClick={onClear}
          className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
        >
          Limpiar
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setTab("resumen")}
          className={`rounded-lg px-3 py-2 text-sm ${
            tab === "resumen"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setTab("contacto")}
          className={`rounded-lg px-3 py-2 text-sm ${
            tab === "contacto"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Registrar contacto
        </button>
        <button
          onClick={() => setTab("nota")}
          className={`rounded-lg px-3 py-2 text-sm ${
            tab === "nota"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Nota
        </button>
      </div>

      {tab === "resumen" && (
        <div className="space-y-4">
          {/* Tarjetas: Contactos + Plan de estudios de interés */}
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Contactos" value={stats.contacts} />
            <Stat label="Plan de estudios de interés" value={planNames} />
          </div>

          {/* básicos */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Programa de estudio de interes</p>
              <p className="font-medium">{programNames}</p>
            </div>
            <div>
              <p className="text-gray-500">Plan(es)</p>
              <p className="font-medium">{planNames}</p>
            </div>
            <div>
              <p className="text-gray-500">Estatus</p>
              <p className="font-medium">{item.status || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">Registro</p>
              <p className="font-medium">{fmtDate(item.registerDate)}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href={`/dashboard/list/admissions/${item.id}`}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Ver expediente
            </Link>
            <button
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => setTab("contacto")}
            >
              Registrar contacto
            </button>
          </div>
        </div>
      )}

      {tab === "contacto" && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            guardarContacto();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={contact.date}
                onChange={(e) =>
                  setContact((s) => ({ ...s, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Hora</Label>
              <Input
                type="time"
                value={contact.time}
                onChange={(e) =>
                  setContact((s) => ({ ...s, time: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Label>Medio</Label>
            <Input
              placeholder="Teléfono, WhatsApp, Email…"
              value={contact.channel}
              onChange={(e) =>
                setContact((s) => ({ ...s, channel: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Resumen</Label>
            <Textarea
              placeholder="Resumen breve de la conversación"
              value={contact.summary}
              onChange={(e) =>
                setContact((s) => ({ ...s, summary: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Próxima acción</Label>
            <Input
              placeholder="Ej. Enviar requisitos, agendar entrevista"
              value={contact.nextAction}
              onChange={(e) =>
                setContact((s) => ({ ...s, nextAction: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setTab("resumen")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Guardar contacto
            </button>
          </div>
        </form>
      )}

      {tab === "nota" && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            guardarNota();
          }}
        >
          <div>
            <Label>Nota</Label>
            <Textarea
              placeholder="Escribe un apunte breve…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setTab("resumen")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Guardar nota
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---------- Página: carga por ID desde query ---------- */
export default function AdmissionsDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected") || "";

  // Hook que ya usas en la lista (carga el arreglo de admissions)
  const { admissions, error } = useAdmisiones();

  const [selected, setSelected] = useState<AdmissionsItem | null>(null);
  const [stats, setStats] = useState<Stats>({ contacts: 0, notes: 0, tasksOpen: 0 });

  // Cuando el hook trae datos, busca el aspirante por ID del query
  useEffect(() => {
    if (!selectedId || !admissions) return;
    const found = admissions.find((a) => String(a.id) === String(selectedId)) || null;
    setSelected(found);
    // Aquí podrías cargar métricas reales:
    // fetch(`/api/admissions/${selectedId}/stats`).then(r => r.json()).then(setStats)
  }, [selectedId, admissions]);

  const header = useMemo(
    () => (
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Seguimiento de Aspirantes</h1>
        <p className="text-sm text-gray-500">
          Selecciona un aspirante para ver su información, registrar contactos y notas.
        </p>
      </header>
    ),
    []
  );

  const clearSelection = useCallback(() => {
    setSelected(null);
    setStats({ contacts: 0, notes: 0, tasksOpen: 0 });
    const qs = new URLSearchParams(searchParams.toString());
    qs.delete("selected");
    router.replace(
      `/dashboard/list/admissions/detailsapplicants${qs.toString() ? `?${qs.toString()}` : ""}`
    );
  }, [router, searchParams]);

  return (
    <div className="w-auto pl-2">
      {header}
      <Callout />

      {error && (
        <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
          Error al cargar las admisiones: {String(error)}
        </div>
      )}

      {!selectedId ? (
        <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 rounded-2xl bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Sin selección
          </div>
          <h3 className="mb-1 text-lg font-semibold">Selecciona un aspirante</h3>
          <p className="max-w-sm text-sm text-gray-500">
            Desde la página de Admisiones, da doble-click en un aspirante para abrir su seguimiento aquí.
          </p>
          <Link
            href="/dashboard/list/admissions"
            className="mt-4 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Ir a Admisiones
          </Link>
        </div>
      ) : admissions === undefined ? (
        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Cargando aspirante…</p>
        </div>
      ) : !selected ? (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <p className="text-sm text-yellow-800">
            No se encontró el aspirante con id <b>{selectedId}</b>. Verifica que existe
            en la lista de Admisiones.
          </p>
          <Link
            href="/dashboard/list/admissions"
            className="mt-3 inline-block rounded-lg border px-3 py-2 text-sm hover:bg-yellow-100"
          >
            Volver a Admisiones
          </Link>
        </div>
      ) : (
        <DetailPanel item={selected} stats={stats} onClear={clearSelection} />
      )}
    </div>
  );
}
