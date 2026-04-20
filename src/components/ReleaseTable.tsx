import { useState, useMemo } from 'react';
import type { ReleaseData } from '../types';
import { formatNumber } from '../utils';

interface Props {
  releases: ReleaseData[];
}

type SortKey = 'tag' | 'publishedAt' | 'totalDownloads' | 'assetCount';

export default function ReleaseTable({ releases }: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('publishedAt');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = releases.filter(
      r => r.tag.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
    );
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'tag') cmp = a.tag.localeCompare(b.tag);
      else if (sortKey === 'publishedAt') cmp = a.publishedAt.getTime() - b.publishedAt.getTime();
      else if (sortKey === 'totalDownloads') cmp = a.totalDownloads - b.totalDownloads;
      else if (sortKey === 'assetCount') cmp = a.assetCount - b.assetCount;
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [releases, search, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortAsc ? ' \u25B2' : ' \u25BC') : '';

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-white">All Releases</h2>
        <input
          type="text"
          placeholder="Search releases..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-veeam w-full sm:w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('tag')}>
                Release{arrow('tag')}
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white hidden sm:table-cell" onClick={() => handleSort('publishedAt')}>
                Published{arrow('publishedAt')}
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('totalDownloads')}>
                Downloads{arrow('totalDownloads')}
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-right hidden md:table-cell" onClick={() => handleSort('assetCount')}>
                Assets{arrow('assetCount')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.tag} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-3 px-3">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-veeam hover:underline font-medium">
                    {r.tag}
                  </a>
                  <span className="block text-gray-500 text-xs mt-0.5">{r.name !== r.tag ? r.name : ''}</span>
                </td>
                <td className="py-3 px-3 text-gray-400 hidden sm:table-cell">
                  {r.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="py-3 px-3 text-white text-right font-mono">{formatNumber(r.totalDownloads)}</td>
                <td className="py-3 px-3 text-gray-400 text-right hidden md:table-cell">{r.assetCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">No releases match your search.</p>
      )}
    </div>
  );
}
