/** Single source of truth for the build tag used across the app. */
export const BUILD_ID: string =
  // prefer Vite define if present
  (typeof (globalThis as any).__BUILD_ID__ !== "undefined" ? String((globalThis as any).__BUILD_ID__) : "") ||
  // fallback: ISO timestamp (short)
  (import.meta?.env?.VITE_BUILD_ID as string) ||
  new Date().toISOString();

export default BUILD_ID;
