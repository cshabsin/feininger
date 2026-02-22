import VersionClient from './VersionClient';

type Version = 'prismatic-sails' | 'the-watchers' | 'calm-day-n-plus-1' | 'calm-day-at-sea-iii';

export async function generateStaticParams() {
  return [
    { version: 'prismatic-sails' },
    { version: 'the-watchers' },
    { version: 'calm-day-n-plus-1' },
    { version: 'calm-day-at-sea-iii' },
  ]
}

export default async function VersionPage({ params }: { params: Promise<{ version: Version }> }) {
  const { version } = await params;
  return <VersionClient key={version} version={version} />;
}
