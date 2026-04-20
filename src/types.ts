export interface GitHubAsset {
  id: number;
  name: string;
  content_type: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  created_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: GitHubAsset[];
  html_url: string;
  body: string | null;
}

export interface ReleaseData {
  tag: string;
  name: string;
  publishedAt: Date;
  totalDownloads: number;
  assetCount: number;
  assets: AssetData[];
  url: string;
}

export interface AssetData {
  name: string;
  downloads: number;
  size: number;
  releaseTag: string;
}

export interface MonthlyData {
  month: string;
  downloads: number;
}

export interface YearlyData {
  year: string;
  downloads: number;
}
