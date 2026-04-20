import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ReleaseData } from '../types';
import { getYearlyBreakdown, formatNumber } from '../utils';

interface Props {
  releases: ReleaseData[];
}

export default function YearlyChart({ releases }: Props) {
  const data = getYearlyBreakdown(releases);

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Yearly Download Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
          <YAxis tickFormatter={formatNumber} stroke="#6b7280" fontSize={12} />
          <Tooltip
            formatter={(v) => [formatNumber(Number(v)), 'Downloads']}
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#00b336' }}
          />
          <Bar dataKey="downloads" fill="#00cc3e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
