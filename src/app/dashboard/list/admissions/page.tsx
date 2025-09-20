// app/dashboard/list/admissions/page.tsx
import Announcements from "@/components/Announcements";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { AdmissionsListWithNavigation } from "@/components/AdmissionsListWithNavigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [k: string]: string | undefined };
}) {
  return (
    <div className="w-auto pl-2">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Admisiones</h1>
        <p className="text-sm text-gray-500">
          Crea nuevas personas (aspirantes) y gestiona su información básica.
        </p>
      </header>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] items-start">
        {/* IZQUIERDA: pone la lista dentro del puente cliente */}
        <section className="min-w-0">
          <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4">
            <AdmissionsListWithNavigation />
          </div>
        </section>

        {/* DERECHA: estos pueden ser Server Components/async sin problema */}
        <aside className="min-w-0 space-y-6">
          <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4">
            <EventCalendarContainer searchParams={searchParams} />
          </div>
          <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4">
            <Announcements />
          </div>
        </aside>
      </div>
    </div>
  );
}
