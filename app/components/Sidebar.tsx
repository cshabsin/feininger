"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Image } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-20 lg:w-72 bg-neutral-900/50 backdrop-blur-xl flex flex-col p-4 gap-10 overflow-y-auto border-r border-white/5">
      <div className="flex items-center gap-3 px-3 py-8 w-full mb-2">
        <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-2xl shrink-0">
           <Box className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col hidden lg:flex">
          <span className="font-black text-xl tracking-tighter leading-none text-white uppercase italic">Feininger</span>
          <span className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-[0.2em] opacity-50">Prismatism Lab</span>
        </div>
      </div>

      <nav className="flex flex-col gap-4 w-full flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black px-4 mb-2 hidden lg:block opacity-30">Collection</p>
        
        <Link
          href="/prismatic-sails"
          className={`flex flex-col items-start px-4 py-5 rounded-2xl transition-all duration-300 group border ${isActive('/prismatic-sails') ? 'bg-white/10 text-white shadow-2xl border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-xs mb-1 opacity-40 group-hover:opacity-60 transition-opacity">V1</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight lg:block hidden">Prismatic Sails</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">PS</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase tracking-tighter hidden lg:block italic">Geometric Prismatism</span>
          </div>
        </Link>

        <Link
          href="/the-watchers"
          className={`flex flex-col items-start px-4 py-5 rounded-2xl transition-all duration-300 group border ${isActive('/the-watchers') ? 'bg-white/10 text-white shadow-2xl border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-xs mb-1 opacity-40 group-hover:opacity-60 transition-opacity">V2</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight lg:block hidden">The Watchers</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">TW</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase tracking-tighter hidden lg:block italic">Human Forms</span>
          </div>
        </Link>

        <Link
          href="/calm-day-n-plus-1"
          className={`flex flex-col items-start px-4 py-5 rounded-2xl transition-all duration-300 group border ${isActive('/calm-day-n-plus-1') ? 'bg-white/10 text-white shadow-2xl border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-xs mb-1 opacity-40 group-hover:opacity-60 transition-opacity">V3</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight lg:block hidden">Calm Day N+1</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">CD+</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase tracking-tighter hidden lg:block italic">Generative Reference</span>
          </div>
        </Link>

        <Link
          href="/calm-day-at-sea-iii"
          className={`flex flex-col items-start px-4 py-5 rounded-2xl transition-all duration-300 group border ${isActive('/calm-day-at-sea-iii') ? 'bg-white/10 text-white shadow-2xl border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-xs mb-1 opacity-40 group-hover:opacity-60 transition-opacity">REF</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight lg:block hidden">Calm Day III</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">CD3</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase tracking-tighter hidden lg:block italic">Master Reference</span>
          </div>
        </Link>

        <div className="mt-6 pt-6 border-t border-white/5">
          <Link
            href="/history"
            className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group border ${isActive('/history') ? 'bg-white/10 text-white shadow-2xl border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
          >
            <Image className="w-4 h-4 shrink-0" />
            <span className="font-bold text-sm lg:block hidden">History</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};
