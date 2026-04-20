import type { GitHubRelease, ReleaseData, AssetData, MonthlyData, YearlyData } from './types';

export function processReleases(raw: GitHubRelease[]): ReleaseData[] {
  return raw
    .map(r => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      publishedAt: new Date(r.published_at || r.created_at),
      totalDownloads: r.assets.reduce((sum, a) => sum + a.download_count, 0),
      assetCount: r.assets.length,
      assets: r.assets.map(a => ({
        name: a.name,
        downloads: a.download_count,
        size: a.size,
        releaseTag: r.tag_name,
      })),
      url: r.html_url,
    }))
    .sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
}

export function getTotalDownloads(releases: ReleaseData[]): number {
  return releases.reduce((sum, r) => sum + r.totalDownloads, 0);
}

export function getAvgPerRelease(releases: ReleaseData[]): number {
  if (releases.length === 0) return 0;
  return Math.round(getTotalDownloads(releases) / releases.length);
}

export function getLatestRelease(releases: ReleaseData[]): ReleaseData | null {
  if (releases.length === 0) return null;
  return releases[releases.length - 1];
}

export function getTopAssets(releases: ReleaseData[], limit = 10): AssetData[] {
  return releases
    .flatMap(r => r.assets)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

export function getMonthlyBreakdown(releases: ReleaseData[]): MonthlyData[] {
  const map = new Map<string, number>();
  for (const r of releases) {
    const key = `${r.publishedAt.getFullYear()}-${String(r.publishedAt.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, (map.get(key) || 0) + r.totalDownloads);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, downloads]) => ({ month, downloads }));
}

export function getYearlyBreakdown(releases: ReleaseData[]): YearlyData[] {
  const map = new Map<string, number>();
  for (const r of releases) {
    const key = String(r.publishedAt.getFullYear());
    map.set(key, (map.get(key) || 0) + r.totalDownloads);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, downloads]) => ({ year, downloads }));
}

export function getCumulativeData(releases: ReleaseData[]) {
  let cumulative = 0;
  return releases.map(r => {
    cumulative += r.totalDownloads;
    return {
      tag: r.tag,
      date: r.publishedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      cumulative,
    };
  });
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
