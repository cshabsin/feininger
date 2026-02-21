import VersionClient from './VersionClient';

type Version = 'v1' | 'v2' | 'gemini3';

export async function generateStaticParams() {
  return [
    { version: 'v1' },
    { version: 'v2' },
    { version: 'gemini3' },
  ]
}

export default function VersionPage({ params }: { params: { version: Version } }) {
  return <VersionClient key={params.version} version={params.version} />;
}
