// app/(dashboard)/admisiones/page.tsx
import Announcements from "@/components/Announcements";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { AdmissionsList } from "@/features/admisiones/components/AdmisionesList";

export default function Page({
  searchParams,
}: { searchParams: { [k: string]: string | undefined } }) {
  return (
    // Compensa el sidebar fijo (ajusta 256px si tu sidebar mide distinto)
    //<main className="w-auto">
      //{/* ¡SIN container ni max-w! */}
      <div className="w-auto px-6 py-6">
        {/* Cabecera */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Admisiones</h1>
          <p className="text-sm text-gray-500">
            Crea nuevas personas (aspirantes) y gestiona su información básica.
          </p>
        </header>

        {/* Grid que ocupa TODO el ancho disponible */}
        <div className="
          grid gap-6
          grid-cols-1
          lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]
          items-start
        ">
          {/* IZQUIERDA (fluida) */}
          <section className="min-w-0">
            <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4">
              <AdmissionsList />
            </div>
          </section>

          {/* DERECHA (fija 360–420px) */}
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
   // </main>
  );
}




/*'use client';

import * as React from 'react';
import { AdmissionsList } from '@/features/admisiones/components/AdmisionesList';

export default function Page() {
  return (
    <div className="p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Admisiones</h1>
        <p className="text-sm text-gray-500">
          Crea nuevas personas (aspirantes) y gestiona su información básica.
        </p>
      </header>

      <AdmissionsList />
    </div>
  );
}
*/