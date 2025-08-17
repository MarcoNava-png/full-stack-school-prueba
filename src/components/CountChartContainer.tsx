"use client";
import Image from "next/image";
import CountChart from "./CountChart";

const CountChartContainer = () => {
  // ✅ Datos simulados (mock)
  const boys = 45;
  const girls = 55;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Estudiantes</h1>
        <Image src="/moreDark.png" alt="Opciones" width={20} height={20} />
      </div>

      {/* CHART */}
      <CountChart />

      {/* BOTTOM */}
      <div className="flex justify-center gap-16 mt-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-400">
            Niños ({Math.round((boys / (boys + girls)) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-400">
            Niñas ({Math.round((girls / (boys + girls)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
