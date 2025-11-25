import Flag from '../assets/Navigation/Flag/UK.svg?react';
import Hamburger from '../assets/Navigation/Hamburger.svg?react'
import Alaram from '../assets/Navigation/alarm.svg?react'
import { ChevronDown, Search } from 'lucide-react';

export const TopNavbar = () => {
  return (
    <header className="bg-[#FFFFFF] w-[1201px] h-[70px] justify-between flex items-center border border-black">
      <div className="flex items-center gap-6">
        <Hamburger className='cursor-pointer ml-7'/>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className='text-gray-400' size={18}/>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="bg-[#F5F6FA] rounded-full pl-10 pr-4 py-2.5 w-[400px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <Alaram />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white flex items-center justify-center rounded-full">
            6
          </span>
        </button>

        <div className="flex items-center gap-4 cursor-pointer">
          <Flag />
          <div className='flex gap-1'>
            <span className='text-[#646464]'>English</span>
            <ChevronDown className='text-[#646464] w-8 h-4'/>
          </div>
        </div>

        <div className='flex items-center gap-3 cursor-pointer mr-10'>
          <div className='w-9 h-9 rounded-full bg-gray-600'/>
          <div className='flex flex-col'>
            <span className='text-[#404040]'>Moni Roy</span>
            <span className='text-[#565656]'>Admin</span>
          </div>
          <div className="w-6 h-6 rounded-full border border-[#5C5C5C] flex items-center justify-center">
            <ChevronDown className="text-[#646464] w-3 h-3"/>
          </div>
        </div>
      </div>
    </header>
  );
};
