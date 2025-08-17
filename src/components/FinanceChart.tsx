"use client"

import Image from "next/image"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Enero',
    Ingresos: 4000,
    Egresos: 2400,
    amt: 2400,
  },
  {
    name: 'Febrero',
    Ingresos: 3000,
    Egresos: 1398,
    amt: 2210,
  },
  {
    name: 'Marzo',
    Ingresos: 2000,
    Egresos: 9800,
    amt: 2290,
  },
  {
    name: 'Abril',
    Ingresos: 2780,
    Egresos: 3908,
    amt: 2000,
  },
];


const FinanceChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
            {/* TITLE */}
            <div className='flex justify-between items-center'>
              <h1 className="text-lg font-semibold">Finanzas</h1>
              <Image src="/more.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd"/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={20} />
          <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={10}/>
          <Tooltip />
          <Legend align='center' verticalAlign="top" wrapperStyle={{paddingTop:"10px", paddingBottom:"30px" }}/>
          <Line type="monotone" dataKey="Ingresos" stroke="#C3EBFA" strokeWidth={5} />
          <Line type="monotone" dataKey="Egresos" stroke="#CFCEFF" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;