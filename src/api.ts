import type { GitHubRelease } from './types';

const CACHE_KEY = 'vhc-analytics-releases';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: GitHubRelease[];
  timestamp: number;
}

function getCached(): GitHubRelease[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(data: GitHubRelease[]) {
  const entry: CacheEntry = { data, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
}

export function getCacheAge(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    return Date.now() - entry.timestamp;
  } catch {
    return null;
  }
}

export async function fetchAllReleases(): Promise<GitHubRelease[]> {
  const cached = getCached();
  if (cached) return cached;

  const allReleases: GitHubRelease[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/VeeamHub/veeam-healthcheck/releases?per_page=100&page=${page}`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (!res.ok) {
      if (res.status === 403) {
        const cached = getCached();
        if (cached) return cached;
        throw new Error('GitHub API rate limit exceeded. Try again later.');
      }
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const releases: GitHubRelease[] = await res.json();
    if (releases.length === 0) break;

    allReleases.push(...releases.filter(r => !r.draft));
    if (releases.length < 100) break;
    page++;
  }

  setCache(allReleases);
  return allReleases;
}
