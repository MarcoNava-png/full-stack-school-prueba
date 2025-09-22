"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/fetcher";

/* =========================
 *  Tipos
 * ========================= */
type AspiranteApiItem = {
  idAspirante: number;
  personaId: number;
  nombreCompleto: string;
  email: string;
  aspiranteEstatus: string;
  fechaRegistro: string;
  planEstudios: string;
};

type PaginatedAspirantes = {
  items: AspiranteApiItem[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

/* =========================
 *  Cliente API
 * ========================= */
async function getAspirantes(params: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedAspirantes> {
  const query = [
    `page=${params.page ?? 1}`,
    `pageSize=${params.pageSize ?? 20}`
  ].join("&");
  const url = `/api/Aspirante?${query}`;
  return await apiFetch(url);
}

async function inscribirAspirantes(ids: number[]) {
  const fechaInscripcion = new Date().toISOString();
  for (const personaId of ids) {
    await apiFetch("/api/inscripciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        idEstudiante: Number(personaId),
        idGrupoMateria: 3,
        fechaInscripcion,
        estado: "Admitido"
      })
    });
  }
}

/* =========================
 *  Hook de datos
 * ========================= */
function useAspirantes() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [data, setData] = React.useState<PaginatedAspirantes | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await getAspirantes({ page, pageSize });
      setData(d);
    } catch (e) {
      setData(null);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  React.useEffect(() => {
    load();
  }, [load]);

  const next = () => setPage((p) => (data && p < data.totalPages ? p + 1 : p));
  const prev = () => setPage((p) => (p > 1 ? p - 1 : p));

  return {
    page, setPage,
    pageSize, setPageSize,
    data,
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
    page, setPage,
    pageSize, setPageSize,
    data, loading, error,
    next, prev,
    reload,
  } = useAspirantes();

  /* ==== Selección por checkboxes ==== */
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (id: number) => selectedIds.has(String(id));

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(String(id))) n.delete(String(id));
      else n.add(String(id));
      return n;
    });
  };

  const allVisibleIds = React.useMemo(
    () => (data?.items ?? []).map((i) => i.idAspirante),
    [data]
  );

  const allSelectedOnPage =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.has(String(id)));

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (allSelectedOnPage) {
        allVisibleIds.forEach((id) => n.delete(String(id)));
      } else {
        allVisibleIds.forEach((id) => n.add(String(id)));
      }
      return n;
    });
  };

  const selectedCount = selectedIds.size;

  const handleBulkEnroll = async () => {
    if (selectedCount === 0) return;
    const aspiranteIds = Array.from(selectedIds).map((id) => Number(id));
    await inscribirAspirantes(aspiranteIds);
    reload();
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
          <button
            onClick={handleBulkEnroll}
            disabled={selectedCount === 0}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
              selectedCount === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            title={
              selectedCount === 0
                ? "Selecciona al menos uno"
                : `Inscribir ${selectedCount} seleccionados`
            }
          >
            Inscribir seleccionados
            {selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>

          <button
            onClick={() => router.push("/dashboard/admisiones")}
            className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900"
          >
            + Inscribir aspirantes
          </button>
        </div>
      </header>

      {/* Tabla */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4 overflow-visible">
        {loading && <p className="px-3 py-4 text-sm text-gray-500">Cargando…</p>}
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full table-auto">
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
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Plan de Estudios</th>
                <th className="px-3 py-2">Estatus</th>
                <th className="px-3 py-2">Fecha Registro</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {(data?.items ?? []).map((item) => (
                <tr key={item.idAspirante}>
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={isSelected(item.idAspirante)}
                      onChange={() => toggleOne(item.idAspirante)}
                      aria-label={`Seleccionar ${item.nombreCompleto}`}
                    />
                  </td>
                  <td className="px-3 py-3">{item.nombreCompleto}</td>
                  <td className="px-3 py-3">{item.email}</td>
                  <td className="px-3 py-3">{item.planEstudios}</td>
                  <td className="px-3 py-3">{item.aspiranteEstatus}</td>
                  <td className="px-3 py-3">
                    {new Date(item.fechaRegistro).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                      title="Inscribir"
                      onClick={async () => {
                        await inscribirAspirantes([item.idAspirante]);
                        reload();
                      }}
                    >
                      Inscribir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.items || data.items.length === 0) && !loading && (
            <div className="px-3 py-10 text-center text-sm text-gray-500">
              No hay aspirantes.
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página <strong>{data?.pageNumber ?? 1}</strong> de{" "}
            <strong>{data?.totalPages ?? 1}</strong> ·{" "}
            {data ? data.totalItems : 0} registros
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
