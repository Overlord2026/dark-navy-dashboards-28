// Build information utilities
export interface BuildInfo {
  mode: string;
  flavor: string;
  sha?: string;
  builtAt?: string;
  baseUrl: string;
}

export function getBuildInfo(): BuildInfo {
  return {
    mode: import.meta.env.MODE,
    flavor: import.meta.env.VITE_BUILD_FLAVOR || import.meta.env.MODE,
    sha: import.meta.env.VITE_GIT_SHA,
    builtAt: import.meta.env.VITE_BUILD_TIME,
    baseUrl: typeof window !== 'undefined' ? window.location.origin : 'unknown'
  };
}