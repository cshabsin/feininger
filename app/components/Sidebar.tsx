"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ship, Users, Waves, Box, FileCode, Play, Image } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-20 lg:w-72 border-r border-white/5 bg-neutral-900/50 backdrop-blur-xl flex flex-col p-4 gap-8">
      <div className="flex items-center gap-3 px-3 py-6 border-b border-white/5 w-full mb-2">
        <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-inner">
           <Box className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col hidden lg:flex">
          <span className="font-bold text-lg tracking-tight leading-none text-white">Feininger</span>
          <span className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-widest">Prismatism Lab</span>
        </div>
      </div>

      <nav className="flex flex-col gap-3 w-full flex-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold px-3 mb-1 hidden lg:block opacity-50">Collection</p>
        
        <Link
          href="/v1"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/v1') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="V1: Sails"
        >
          <Ship className={`w-5 h-5 transition-transform duration-500 ${isActive('/v1') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm">V1: Sails</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono">Generative Prismatism</span>
          </div>
        </Link>

        <Link
          href="/v2"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/v2') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="V2: Figures"
        >
          <Users className={`w-5 h-5 transition-transform duration-500 ${isActive('/v2') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm">V2: Figures</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono">Intentional Forms</span>
          </div>
        </Link>

        <Link
          href="/gemini3"
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive('/gemini3') ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
          title="Gemini 3.1 Pro"
        >
          <Waves className={`w-5 h-5 transition-transform duration-500 ${isActive('/gemini3') ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="font-bold text-sm line-clamp-1">Gemini 3.1</span>
            <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase">Reference Art</span>
          </div>
        </Link>

        <div className="h-px bg-white/5 my-2 mx-3 hidden lg:block" />

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
