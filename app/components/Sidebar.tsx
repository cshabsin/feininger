"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Image } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  const TabLink = ({ href, label, id }: { href: string, label: string, id: string }) => (
    <Link
      href={href}
      className={`
        relative flex items-center justify-center py-12 px-2 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        rounded-l-2xl border-y border-l
        writing-mode-vertical rotate-180
        -mr-px
        ${isActive(href) 
          ? 'bg-neutral-200 text-black border-white/20 z-20 translate-x-0 shadow-[-15px_0_40px_rgba(0,0,0,0.6)] scale-y-110 font-black' 
          : 'bg-neutral-800 text-neutral-400 border-white/10 z-10 translate-x-6 hover:translate-x-3 hover:text-neutral-200'
        }
      `}
      style={{ 
        writingMode: 'vertical-rl',
        height: '180px'
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="font-mono text-[10px] opacity-30 tracking-[0.3em] uppercase">{id}</span>
        <span className="font-black text-xs uppercase tracking-[0.2em] whitespace-nowrap">{label}</span>
      </div>
      
      {/* Visual indicator for "active" overlap */}
      {isActive(href) && (
        <div className="absolute right-[-2px] top-0 bottom-0 w-[4px] bg-neutral-200 z-30" />
      )}
    </Link>
  );

  return (
    <aside className="w-20 bg-neutral-950 flex flex-col items-end py-8 gap-4 overflow-visible relative border-r border-white/5">
      <div className="w-full flex justify-center mb-12 px-2">
        <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-2xl">
           <Box className="w-6 h-6 text-white" />
        </div>
      </div>

      <nav className="flex flex-col w-full items-end">
        <TabLink href="/prismatic-sails" label="Prismatic Sails" id="V1" />
        <TabLink href="/the-watchers" label="The Watchers" id="V2" />
        <TabLink href="/calm-day-n-plus-1" label="Calm Day N+1" id="V3" />
        <TabLink href="/calm-day-at-sea-iii" label="Calm Day III" id="REF" />
      </nav>

      <div className="mt-auto w-full flex justify-center px-2">
        <Link
          href="/history"
          className={`p-4 rounded-xl transition-all duration-500 ${isActive('/history') ? 'bg-white/10 text-white' : 'text-neutral-600 hover:text-neutral-300'}`}
        >
          <Image className="w-6 h-6" />
        </Link>
      </div>
    </aside>
  );
};
