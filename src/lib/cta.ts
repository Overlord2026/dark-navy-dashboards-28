export function scrollToId(id: string, offset = 80) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function track(event: string, data: Record<string, any> = {}) {
  // no-op stub; plug into your analytics later
  // window.analytics?.track?.(event, data);
  console.debug("[track]", event, data);
}