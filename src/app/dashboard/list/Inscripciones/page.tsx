"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* =========================
 *  Tipos
 * ========================= */
type Persona = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento?: string | null;
  estatus?: string | null;
  personaGenero?: string | null;
};

type Estudiante = {
  id: string;
  persona: Persona;
  // fotoUrl?: string | null; // si lo manejas, descomenta
};

type Programa = { id: string; nombre: string };
type Plan = { id: string; nombre: string };

type Inscripcion = {
  id: string;
  estudiante: Estudiante;
  programa: Programa;
  plan?: Plan | null;
  periodo?: string | null;
  estatus?: string | null;
  fechaInscripcion?: string | null;
};

type Paginated<T> = {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

/* =========================
 *  Utilidades
 * ========================= */
const DEFAULT_AVATAR = "/avatars/avatar-generico.png";

function nombreCompleto(p: Persona) {
  return `${p.nombre ?? ""} ${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
}
function formatDate(d?: string | null) {
  if (!d) return "—";
  const dd = new Date(d);
  if (isNaN(dd.getTime())) return "—";
  return dd.toLocaleDateString("es-MX");
}
function isSameLocalDay(iso?: string | null) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
function badgeClassesByStatus(s?: string | null) {
  const v = (s ?? "").toLowerCase();
  if (v.includes("pend")) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  if (v.includes("cancel")) return "bg-rose-50 text-rose-700 ring-rose-600/20";
  if (v.includes("conclu") || v.includes("regist")) return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  return "bg-gray-50 text-gray-700 ring-gray-600/20";
}

function AvatarFoto({ src, alt, size = 36 }: { src?: string | null; alt: string; size?: number }) {
  const [imgSrc, setImgSrc] = React.useState(src && src.trim() ? src : DEFAULT_AVATAR);
  return (
    <div className="shrink-0 rounded-full overflow-hidden bg-gray-100" style={{ width: size, height: size }}>
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        onError={() => setImgSrc(DEFAULT_AVATAR)}
      />
    </div>
  );
}

/* =========================
 *  Datos demo (fallback)
 * ========================= */
const DEMO_BASE: Paginated<Inscripcion> = {
  items: [
    {
      id: "i1",
      estudiante: { id: "e1", persona: { id: "p1", nombre: "Cruz Angel", apellidoPaterno: "Angel", apellidoMaterno: "" } },
      programa: { id: "prog1", nombre: "LICENCIATURA EN RADIOLOGÍA E IMAGEN" },
      plan: { id: "pl1", nombre: "Plan 2020" },
      periodo: "2025-1",
      estatus: "Pendiente",
      fechaInscripcion: "",
    },
    {
      id: "i2",
      estudiante: { id: "e2", persona: { id: "p2", nombre: "Paulo", apellidoPaterno: "Guzman", apellidoMaterno: "Guzman" } },
      programa: { id: "prog2", nombre: "ING. MECÁNICA Y ELECTRÓNICA AUTOMOTRIZ" },
      plan: { id: "pl2", nombre: "Plan 2021" },
      periodo: "2025-1",
      estatus: "Pendiente",
      fechaInscripcion: "",
    },
  ],
  totalItems: 2,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 1,
};

/* =========================
 *  Cliente API
 * ========================= */
async function getInscripciones(params: {
  q?: string;
  status?: string;
  periodo?: string;
  page?: number;
  pageSize?: number;
}): Promise<Paginated<Inscripcion>> {
  const url = new URL("/api/inscripciones", typeof window === "undefined" ? "http://localhost" : window.location.origin);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.status) url.searchParams.set("status", params.status);
  if (params.periodo) url.searchParams.set("periodo", params.periodo);
  url.searchParams.set("page", String(params.page ?? 1));
  url.searchParams.set("pageSize", String(params.pageSize ?? 20));

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/* =========================
 *  Hook de datos
 * ========================= */
function useInscripciones() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>("Pendiente");
  const [periodo, setPeriodo] = React.useState<string>("");
  const [soloHoy, setSoloHoy] = React.useState<boolean>(true);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [data, setData] = React.useState<Paginated<Inscripcion> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await getInscripciones({ q, status, periodo, page, pageSize });
      setData(d);
    } catch (e) {
      const todayIso = new Date().toISOString();
      setData({
        ...DEMO_BASE,
        items: DEMO_BASE.items.map((x) => ({ ...x, fechaInscripcion: todayIso, estatus: "Pendiente" })),
      });
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [q, status, periodo, page, pageSize]);

  React.useEffect(() => {
    load();
  }, [load]);

  const next = () => setPage((p) => (data && p < data.totalPages ? p + 1 : p));
  const prev = () => setPage((p) => (p > 1 ? p - 1 : p));

  const itemsFiltrados = React.useMemo(() => {
    let items = data?.items ?? [];
    if (soloHoy) items = items.filter((i) => isSameLocalDay(i.fechaInscripcion));
    return items;
  }, [data, soloHoy]);

  return {
    q, setQ,
    status, setStatus,
    periodo, setPeriodo,
    soloHoy, setSoloHoy,
    page, setPage,
    pageSize, setPageSize,
    data, itemsFiltrados,
    loading, error,
    next, prev,
    reload: load,
  };
}

/* =========================
 *  Página
 * ========================= */
export default function Page() {
  const router = useRouter();
  const {
    q, setQ,
    status, setStatus,
    periodo, setPeriodo,
    soloHoy, setSoloHoy,
    page, pageSize, setPageSize,
    data, itemsFiltrados, loading, error,
    next, prev,
  } = useInscripciones();

  /* ==== Selección por checkboxes ==== */
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (id: string) => selectedIds.has(id);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const allVisibleIds = React.useMemo(
    () => (itemsFiltrados ?? []).map((i) => i.id),
    [itemsFiltrados]
  );

  const allSelectedOnPage = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (allSelectedOnPage) {
        // deselecciona visibles
        allVisibleIds.forEach((id) => n.delete(id));
      } else {
        // selecciona visibles
        allVisibleIds.forEach((id) => n.add(id));
      }
      return n;
    });
  };

  const selectedCount = selectedIds.size;

  const handleBulkEnroll = () => {
    if (selectedCount === 0) return;
    const ids = Array.from(selectedIds).join(",");
    // Ajusta a tu ruta real de alta masiva:
    router.push(`/dashboard/list/Inscripciones/nueva?ids=${encodeURIComponent(ids)}`);
  };

  return (
    <div className="w-auto px-6 py-6">
      {/* Cabecera */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inscripciones</h1>
          <p className="text-sm text-gray-500">
            Registros <strong>pendientes</strong> de <strong>hoy</strong> por defecto.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          {/* Botón masivo: Inscribir seleccionados */}
          <button
            onClick={handleBulkEnroll}
            disabled={selectedCount === 0}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
              selectedCount === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            title={selectedCount === 0 ? "Selecciona al menos uno" : `Inscribir ${selectedCount} seleccionados`}
          >
            Inscribir seleccionados{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>

          {/* (Opcional) acceso rápido a Admisiones */}
          <button
            onClick={() => router.push("/dashboard/admisiones")}
            className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900"
          >
            + Inscribir aspirantes
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, programa, plan…"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los estatus</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Registrada">Registrada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Concluida">Concluida</option>
          </select>

          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los períodos</option>
            <option value="2025-1">2025-1</option>
            <option value="2025-2">2025-2</option>
            <option value="2026-1">2026-1</option>
          </select>

          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => setSoloHoy(true)}
              className={`px-3 py-2 text-sm ${soloHoy ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setSoloHoy(false)}
              className={`px-3 py-2 text-sm ${!soloHoy ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Paginación: tamaño */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Por página</label>
          <select
            value={pageSize}
            onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) setPageSize(n); }}
            className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4 overflow-visible">
        {loading && <p className="px-3 py-4 text-sm text-gray-500">Cargando…</p>}
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full table-auto">
            <colgroup>
              <col className="w-[44px]" />     {/* checkbox */}
              <col className="w-[360px]" />     {/* Estudiante */}
              <col />                            {/* Programa */}
              <col className="w-[160px]" />      {/* Plan */}
              <col className="w-[120px]" />      {/* Período */}
              <col className="w-[130px]" />      {/* Estatus */}
              <col className="w-[120px]" />      {/* Fecha */}
              <col className="w-[128px]" />      {/* Acciones */}
            </colgroup>
            <thead className="text-left text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={allSelectedOnPage}
                    onChange={toggleAllVisible}
                  />
                </th>
                <th className="px-3 py-2">Estudiante</th>
                <th className="px-3 py-2">Programa</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Período</th>
                <th className="px-3 py-2">Estatus</th>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {(itemsFiltrados ?? []).map((i) => {
                const p = i.estudiante.persona;
                const nombre = nombreCompleto(p);
                const badgeCls = badgeClassesByStatus(i.estatus);
                const checked = isSelected(i.id);
                return (
                  <tr key={i.id} className="align-top">
                    {/* checkbox */}
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={checked}
                        onChange={() => toggleOne(i.id)}
                        aria-label={`Seleccionar ${nombre || i.estudiante.id}`}
                      />
                    </td>

                    {/* Estudiante */}
                    <td className="px-3 py-3 min-w-0">
                      <div className="flex items-start gap-3 min-w-0">
                        <AvatarFoto
                          src={undefined /* i.estudiante.fotoUrl si lo tienes */}
                          alt={nombre || i.estudiante.id}
                        />
                        <div className="min-w-0">
                          <p className="font-medium leading-5 break-words">
                            {nombre || "—"}
                          </p>
                          <p className="text-xs text-gray-500">ID: {i.estudiante.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Programa */}
                    <td className="px-3 py-3 max-w-0 min-w-0">
                      <p className="font-medium break-words whitespace-normal">
                        {i.programa?.nombre ?? "—"}
                      </p>
                    </td>

                    {/* Plan */}
                    <td className="px-3 py-3 max-w-0 min-w-0">
                      <p className="break-words whitespace-normal">{i.plan?.nombre ?? "—"}</p>
                    </td>

                    {/* Período */}
                    <td className="px-3 py-3">{i.periodo ?? "—"}</td>

                    {/* Estatus */}
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeCls}`}
                      >
                        {i.estatus ?? "—"}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-3 py-3">{formatDate(i.fechaInscripcion)}</td>

                    {/* Acciones */}
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                          title="Inscribir"
                          onClick={() =>
                            router.push(`/dashboard/list/Inscripciones/nueva?ids=${encodeURIComponent(i.id)}`)
                          }
                        >
                          Inscribir
                        </button>
                        <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Ver">
                          🔗
                        </button>
                        <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Eliminar">
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!itemsFiltrados || itemsFiltrados.length === 0) && !loading && (
            <div className="px-3 py-10 text-center text-sm text-gray-500">
              No hay inscripciones {status ? `con estatus "${status}"` : ""} {soloHoy ? "para hoy" : ""}.
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página <strong>{data?.pageNumber ?? 1}</strong> de{" "}
            <strong>{data?.totalPages ?? 1}</strong> · {data ? data.totalItems : 0} registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={!data || (data.pageNumber ?? 1) <= 1}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              « Anterior
            </button>
            <button
              onClick={next}
              disabled={!data || (data.pageNumber ?? 1) >= (data.totalPages ?? 1)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
