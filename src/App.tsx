import { useState, useEffect } from 'react';
import { fetchAllReleases, getCacheAge } from './api';
import { processReleases } from './utils';
import type { ReleaseData } from './types';
import HeroCards from './components/HeroCards';
import DownloadsByRelease from './components/DownloadsByRelease';
import CumulativeChart from './components/CumulativeChart';
import MonthlyChart from './components/MonthlyChart';
import YearlyChart from './components/YearlyChart';
import TopAssets from './components/TopAssets';
import ReleaseTable from './components/ReleaseTable';
import Spinner from './components/Spinner';

export default function App() {
  const [releases, setReleases] = useState<ReleaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<number | null>(null);

  useEffect(() => {
    fetchAllReleases()
      .then(raw => {
        setReleases(processReleases(raw));
        setCacheAge(getCacheAge());
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function formatCacheAge(ms: number): string {
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-veeam flex items-center justify-center text-white font-bold text-sm">V</div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">VHC Analytics</h1>
              <p className="text-xs text-gray-500">VeeamHub/veeam-healthcheck</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {cacheAge !== null && (
              <span className="text-xs text-gray-500">Data cached {formatCacheAge(cacheAge)}</span>
            )}
            <a
              href="https://github.com/VeeamHub/veeam-healthcheck"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-veeam transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading && <Spinner />}

        {error && (
          <div className="rounded-xl bg-red-900/30 border border-red-700/50 p-6 text-center">
            <p className="text-red-400 font-medium">Failed to load data</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <HeroCards releases={releases} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CumulativeChart releases={releases} />
              <DownloadsByRelease releases={releases} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyChart releases={releases} />
              <YearlyChart releases={releases} />
            </div>

            <TopAssets releases={releases} />
            <ReleaseTable releases={releases} />
          </>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        VHC Analytics Dashboard &mdash; Data from GitHub Releases API
      </footer>
    </div>
  );
}
