const Announcements = () => {
  return (
    <div className='bg-white p-4 rounded-md'>
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Anuncios</h1>
            <span className="text-xs text-gray-400">Ver Todos</span>
        </div>
        <div className="flex flex-col gap-4 mt-4"></div>
        <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Presentacion del Nuevo Modelo</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-05-09</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi iusto nesciunt similique culpa, magni autem error totam aliquid suscipit.</p>
        </div>
        <div className="flex flex-col gap-4 mt-4"></div>
        <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Presentacion de Gabinete</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-05-10</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi iusto nesciunt similique culpa, magni autem error totam aliquid suscipit.</p>
        </div>
        <div className="flex flex-col gap-4 mt-4"></div>
        <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Asamblea General</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-05-12</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi iusto nesciunt similique culpa, magni autem error totam aliquid suscipit.</p>
        </div>
        <div className="flex flex-col gap-4 mt-4"></div>
        <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Toma de Protesta</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-05-13</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi iusto nesciunt similique culpa, magni autem error totam aliquid suscipit.</p>
        </div>
    </div>
  );
};

export default Announcements;