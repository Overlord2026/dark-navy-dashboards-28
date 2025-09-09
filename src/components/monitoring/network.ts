// src/components/monitoring/network.ts
// Network error wiring for the app shell (fetch patch + global listeners)
// Returns a teardown() to restore defaults.

export type NetErrPayload = {
  type: "http" | "fetch" | "unhandledrejection" | "window.error";
  error?: unknown;
  detail?: any;
};

export function setupNetworkErrorHandling(opts?: {
  onError?: (p: NetErrPayload) => void;
  trackNonOK?: boolean; // treat non-2xx HTTP as errors; default true
}) {
  const { onError, trackNonOK = true } = opts ?? {};

  const handle = (payload: NetErrPayload) => {
    // Broadcast and optionally call a callback; your UI can toast on this event
    window.dispatchEvent(new CustomEvent("network-error", { detail: payload }));
    try { onError?.(payload); } catch {}
    // Log for dev visibility
    // eslint-disable-next-line no-console
    console.error("[network-error]", payload);
  };

  // 1) Patch fetch
  const originalFetch = window.fetch.bind(window);
  async function patchedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      const res = await originalFetch(input, init);
      if (trackNonOK && !res.ok) {
        handle({
          type: "http",
          detail: { url: String(input as any), status: res.status, statusText: res.statusText },
        });
      }
      return res;
    } catch (e) {
      handle({ type: "fetch", error: e, detail: { url: String(input as any) } });
      throw e;
    }
  }
  (window as any).__originalFetch__ = originalFetch;
  window.fetch = patchedFetch as typeof window.fetch;

  // 2) Global promise rejections
  const unhandled = (ev: PromiseRejectionEvent) =>
    handle({ type: "unhandledrejection", error: ev.reason });
  window.addEventListener("unhandledrejection", unhandled);

  // 3) Window error
  const onerror = (ev: ErrorEvent) =>
    handle({
      type: "window.error",
      error: ev.error ?? ev.message,
      detail: { filename: ev.filename, lineno: ev.lineno, colno: ev.colno },
    });
  window.addEventListener("error", onerror);

  // Teardown
  return function teardown() {
    if ((window as any).__originalFetch__) {
      window.fetch = (window as any).__originalFetch__;
      delete (window as any).__originalFetch__;
    }
    window.removeEventListener("unhandledrejection", unhandled);
    window.removeEventListener("error", onerror);
  };
}