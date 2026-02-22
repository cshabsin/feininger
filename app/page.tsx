"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    redirect('/the-watchers');
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-950">
      <p className="text-neutral-500 animate-pulse">Initializing...</p>
    </div>
  );
}
