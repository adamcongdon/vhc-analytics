import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ReleaseData } from '../types';
import { getTopAssets, formatNumber } from '../utils';

interface Props {
  releases: ReleaseData[];
}

export default function TopAssets({ releases }: Props) {
  const assets = getTopAssets(releases, 10);
  const data = assets.map(a => ({
    name: a.name.length > 30 ? a.name.slice(0, 27) + '...' : a.name,
    fullName: a.name,
    downloads: a.downloads,
    release: a.releaseTag,
  }));

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Top 10 Downloaded Assets</h2>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ left: 30, right: 20 }}>
          <XAxis type="number" tickFormatter={formatNumber} stroke="#6b7280" fontSize={12} />
          <YAxis type="category" dataKey="name" width={200} stroke="#6b7280" fontSize={11} />
          <Tooltip
            formatter={(v) => [formatNumber(Number(v)), 'Downloads']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#fff', fontSize: 12 }}
            itemStyle={{ color: '#00b336' }}
          />
          <Bar dataKey="downloads" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={`hsl(${150 - i * 5}, 75%, ${50 + i}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
