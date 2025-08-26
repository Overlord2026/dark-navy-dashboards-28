const KEY = "AUTO_ANCHOR_AFTER_PUBLISH";

export function getAutoAnchorAfterPublish(): boolean {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setAutoAnchorAfterPublish(v: boolean) {
  try {
    localStorage.setItem(KEY, String(!!v));
  } catch {
    /* noop */
  }
}