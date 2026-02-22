"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Image } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-24 lg:w-80 bg-neutral-900/50 backdrop-blur-xl flex flex-col p-4 gap-10 overflow-y-auto border-r border-white/5 shadow-2xl z-30">
      <div className="flex items-center gap-4 px-3 py-8 w-full mb-2">
        <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-2xl shrink-0">
           <Box className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col hidden lg:flex">
          <span className="font-black text-xl tracking-tighter leading-none text-white uppercase italic">Feininger</span>
          <span className="text-[10px] text-neutral-500 font-mono mt-1.5 uppercase tracking-[0.2em] opacity-50">Prismatism Lab</span>
        </div>
      </div>

      <nav className="flex flex-col gap-5 w-full flex-1 px-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black px-4 mb-1 hidden lg:block opacity-30">Collection</p>
        
        <Link
          href="/prismatic-sails"
          className={`flex flex-col items-start px-5 py-6 rounded-3xl transition-all duration-500 group border ${isActive('/prismatic-sails') ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-[9px] mb-1.5 opacity-30 group-hover:opacity-60 transition-opacity tracking-widest">V1</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight lg:block hidden">Prismatic Sails</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">SAILS</span>
            <span className="text-[10px] opacity-30 mt-2 font-mono uppercase tracking-tighter hidden lg:block italic group-hover:opacity-50 transition-opacity">Geometric Prismatism</span>
          </div>
        </Link>

        <Link
          href="/the-watchers"
          className={`flex flex-col items-start px-5 py-6 rounded-3xl transition-all duration-500 group border ${isActive('/the-watchers') ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-[9px] mb-1.5 opacity-30 group-hover:opacity-60 transition-opacity tracking-widest">V2</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight lg:block hidden">The Watchers</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">WATCH</span>
            <span className="text-[10px] opacity-30 mt-2 font-mono uppercase tracking-tighter hidden lg:block italic group-hover:opacity-50 transition-opacity">Human Forms</span>
          </div>
        </Link>

        <Link
          href="/calm-day-n-plus-1"
          className={`flex flex-col items-start px-5 py-6 rounded-3xl transition-all duration-500 group border ${isActive('/calm-day-n-plus-1') ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-[9px] mb-1.5 opacity-30 group-hover:opacity-60 transition-opacity tracking-widest">V3</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight lg:block hidden">Calm Day N+1</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">SEA+</span>
            <span className="text-[10px] opacity-30 mt-2 font-mono uppercase tracking-tighter hidden lg:block italic group-hover:opacity-50 transition-opacity">Generative Reference</span>
          </div>
        </Link>

        <Link
          href="/calm-day-at-sea-iii"
          className={`flex flex-col items-start px-5 py-6 rounded-3xl transition-all duration-500 group border ${isActive('/calm-day-at-sea-iii') ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
        >
          <span className="font-mono text-[9px] mb-1.5 opacity-30 group-hover:opacity-60 transition-opacity tracking-widest">REF</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight lg:block hidden">Calm Day III</span>
            <span className="font-bold text-sm leading-tight lg:hidden block">SEA 3</span>
            <span className="text-[10px] opacity-30 mt-2 font-mono uppercase tracking-tighter hidden lg:block italic group-hover:opacity-50 transition-opacity">Master Reference</span>
          </div>
        </Link>

        <div className="mt-auto pt-10 px-2">
          <Link
            href="/history"
            className={`flex items-center justify-center lg:justify-start gap-4 px-6 py-5 rounded-3xl transition-all duration-500 group border ${isActive('/history') ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-transparent'}`}
          >
            <Image className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="font-bold text-xs uppercase tracking-widest lg:block hidden">History</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};
