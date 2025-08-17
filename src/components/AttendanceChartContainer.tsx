"use client";

import Image from "next/image";
import AttendanceChart from "./AttendanceChart";

const AttendanceChartContainer = () => {
  // Datos simulados para el gráfico
  const data = [
    { name: "Mon", present: 30, absent: 5 },
    { name: "Tue", present: 28, absent: 7 },
    { name: "Wed", present: 32, absent: 3 },
    { name: "Thu", present: 29, absent: 6 },
    { name: "Fri", present: 31, absent: 4 },
  ];

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="opciones" width={20} height={20} />
      </div>
      <AttendanceChart />
    </div>
  );
};

export default AttendanceChartContainer;
