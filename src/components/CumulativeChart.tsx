import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ReleaseData } from '../types';
import { getCumulativeData, formatNumber } from '../utils';

interface Props {
  releases: ReleaseData[];
}

export default function CumulativeChart({ releases }: Props) {
  const data = getCumulativeData(releases);

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Cumulative Downloads Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis tickFormatter={formatNumber} stroke="#6b7280" fontSize={12} />
          <Tooltip
            formatter={(v) => [formatNumber(Number(v)), 'Total Downloads']}
            labelFormatter={(label) => `Release: ${label}`}
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#00b336' }}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#00b336"
            strokeWidth={2}
            dot={{ fill: '#00b336', r: 4 }}
            activeDot={{ r: 6, fill: '#00cc3e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
