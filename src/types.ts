export interface DownloadRecord {
  id: string;
  title: string;
  filename: string;
  ext: string;
  mode: string;
  quality: string;
  size: number;
  originalUrl: string;
  thumbnail?: string;
  addedAt: string;
}

export interface VideoFormat {
  formatId: string;
  ext: string;
  resolution: string;
  filesize: number;
  note: string;
  vcodec: string;
  acodec: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  uploader: string;
  description: string;
  formats: VideoFormat[];
  originalUrl: string;
  webpage_url: string;
}

export interface TaskStatus {
  id: string;
  status: "pending" | "downloading" | "completed" | "failed";
  progress: number;
  speed: string;
  eta: string;
  error?: string;
  title: string;
  filename?: string;
}

export interface IpLookupResult {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  asn?: string;
  org?: string;
  error?: string;
}

export interface PhoneAnalysisResult {
  input: string;
  isValid: boolean;
  number?: string;
  country?: string;
  countryCallingCode?: string;
  nationalNumber?: string;
  type?: string;
  error?: string;
}

export interface DnsResult {
  hostname: string;
  addresses: string[];
}
