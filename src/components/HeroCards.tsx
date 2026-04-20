import type { ReleaseData } from '../types';
import { formatNumber, getTotalDownloads, getAvgPerRelease, getLatestRelease } from '../utils';

interface Props {
  releases: ReleaseData[];
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6 backdrop-blur-sm">
      <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function HeroCards({ releases }: Props) {
  const total = getTotalDownloads(releases);
  const avg = getAvgPerRelease(releases);
  const latest = getLatestRelease(releases);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card label="Total Downloads" value={formatNumber(total)} sub="Across all releases" />
      <Card label="Total Releases" value={String(releases.length)} sub="Published versions" />
      <Card label="Avg Per Release" value={formatNumber(avg)} sub="Downloads / release" />
      <Card
        label="Latest Release"
        value={latest?.tag || '—'}
        sub={latest ? `${formatNumber(latest.totalDownloads)} downloads` : undefined}
      />
    </div>
  );
}
