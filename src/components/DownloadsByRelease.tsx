import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ReleaseData } from '../types';
import { formatNumber } from '../utils';

interface Props {
  releases: ReleaseData[];
}

export default function DownloadsByRelease({ releases }: Props) {
  const data = [...releases]
    .sort((a, b) => b.totalDownloads - a.totalDownloads)
    .slice(0, 15)
    .map(r => ({ name: r.tag, downloads: r.totalDownloads }));

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Downloads by Release</h2>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" tickFormatter={formatNumber} stroke="#6b7280" fontSize={12} />
          <YAxis type="category" dataKey="name" width={120} stroke="#6b7280" fontSize={12} />
          <Tooltip
            formatter={(v) => [formatNumber(Number(v)), 'Downloads']}
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#00b336' }}
          />
          <Bar dataKey="downloads" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={`hsl(${145 - i * 3}, 80%, ${45 + i * 2}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
