'use client';

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
