import VersionClient from './VersionClient';

type Version = 'v1' | 'v2' | 'gemini3';

export async function generateStaticParams() {
  return [
    { version: 'v1' },
    { version: 'v2' },
    { version: 'gemini3' },
  ]
}

export default async function VersionPage({ params }: { params: Promise<{ version: Version }> }) {
  const { version } = await params;
  return <VersionClient key={version} version={version} />;
}
