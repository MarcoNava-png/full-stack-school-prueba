import Image from "next/image";

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 w-full md:w-auto rounded-full ring-[1.5px] ring-gray-300 px-3 py-1">
        <Image src="/search.png" alt="Search Icon" width={14} height={14} />
        <input 
            type="text" 
            placeholder="Search..." 
            className="text-sm outline-none w-full md:w-[200px] bg-transparent"
        />
    </div>
  );
};

export default TableSearch;
