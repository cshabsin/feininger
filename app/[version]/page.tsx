import { Suspense } from 'react';
import VersionClient from './VersionClient';

type Version = 'prismatic-sails' | 'the-watchers' | 'calm-day-n-plus-1' | 'calm-day-at-sea-ii' | 'calm-day-at-sea-iii';

export async function generateStaticParams() {
  return [
    { version: 'prismatic-sails' },
    { version: 'the-watchers' },
    { version: 'calm-day-n-plus-1' },
    { version: 'calm-day-at-sea-ii' },
    { version: 'calm-day-at-sea-iii' },
  ]
}

export default async function VersionPage({ params }: { params: Promise<{ version: Version }> }) {
  const { version } = await params;
  return (
    <Suspense fallback={<div className="flex-1 h-screen bg-neutral-950 flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">Loading Lab...</div>}>
      <VersionClient key={version} version={version} />
    </Suspense>
  );
}
