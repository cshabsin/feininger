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
        relative flex items-center justify-center 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        -mr-px no-underline
        ${isActive(href) 
          ? 'z-20 translate-x-0 shadow-[-15px_0_40px_rgba(0,0,0,0.6)] font-bold' 
          : 'z-10 translate-x-6 hover:translate-x-3 opacity-60 hover:opacity-100'
        }
      `}
      style={{ 
        height: '140px',
        width: '36px',
        backgroundColor: isActive(href) ? '#e5e5e5' : '#333333',
        color: isActive(href) ? '#000000' : '#ffffff',
        clipPath: 'polygon(80% 0%, 100% 0%, 100% 100%, 80% 100%, 0% 90%, 0% 10%)',
      }}
    >
      <div 
        className="flex items-center justify-center whitespace-nowrap"
        style={{ transform: 'rotate(90deg)' }}
      >
        <span className="font-bold text-[11px] tracking-tight">{label}</span>
      </div>
      
      {/* Visual indicator for "active" overlap */}
      {isActive(href) && (
        <div 
          className="absolute right-[-2px] top-0 bottom-0 w-[4px] z-30" 
          style={{ backgroundColor: '#e5e5e5' }}
        />
      )}
    </Link>
  );

  return (
    <aside className="w-16 bg-neutral-950 flex flex-col items-end py-8 gap-2 overflow-visible relative border-r border-white/5">
      <div className="w-full flex justify-center mb-8 px-2 shadow-2xl">
        <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-2xl">
           <Box className="w-5 h-5 text-white" />
        </div>
      </div>

      <nav className="flex flex-col w-full items-end gap-1">
        <TabLink href="/prismatic-sails" label="Prismatic Sails" id="V1" />
        <TabLink href="/the-watchers" label="The Watchers" id="V2" />
        <TabLink href="/calm-day-n-plus-1" label="Calm Day N+1" id="V3" />
        <TabLink href="/calm-day-at-sea-iii" label="Calm Day III" id="REF" />
      </nav>

      <div className="mt-auto w-full flex justify-center px-2">
        <Link
          href="/history"
          className={`p-3 rounded-xl transition-all duration-500 ${isActive('/history') ? 'bg-white/10 text-white' : 'text-neutral-600 hover:text-neutral-300'}`}
        >
          <Image className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
};
