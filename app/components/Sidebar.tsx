"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ship, Users, Waves, Box, FileCode, Play, Image } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-20 lg:w-72 bg-neutral-900/50 backdrop-blur-xl flex flex-col p-4 gap-10">
      <div className="flex items-center gap-3 px-3 py-8 w-full mb-2">
        <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-2xl">
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
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/prismatic-sails') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="Prismatic Sails"
        >
          <Ship className={`w-5 h-5 transition-transform duration-500 ${isActive('/prismatic-sails') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm">Prismatic Sails</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono">Generative Prismatism</span>
          </div>
        </Link>

        <Link
          href="/the-watchers"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/the-watchers') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="The Watchers"
        >
          <Users className={`w-5 h-5 transition-transform duration-500 ${isActive('/the-watchers') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm">The Watchers</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono">Intentional Forms</span>
          </div>
        </Link>

        <Link
          href="/calm-day-n-plus-1"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/calm-day-n-plus-1') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="Calm Day N+1"
        >
          <Ship className={`w-5 h-5 transition-transform duration-500 ${isActive('/calm-day-n-plus-1') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm">Calm Day N+1</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase">Generative Sea</span>
          </div>
        </Link>

        <Link
          href="/calm-day-at-sea-iii"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/calm-day-at-sea-iii') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="Calm Day at Sea III"
        >
          <Waves className={`w-5 h-5 transition-transform duration-500 ${isActive('/calm-day-at-sea-iii') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm line-clamp-1">Calm Day at Sea III</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase">Gemini 3.1 Reference</span>
          </div>
        </Link>

        <Link
          href="/history"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/history') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="History"
        >
          <Image className={`w-5 h-5 transition-transform duration-500 ${isActive('/history') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm">History</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase">View Generated Art</span>
          </div>
        </Link>
      </nav>
    </aside>
  );
};
