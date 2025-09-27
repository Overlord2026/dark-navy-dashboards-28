import React from "react";
import { IS_PROD, APP_NAME, BUILD_ID } from "../../lib/flags";

export default function NonProdBanner() {
  if (IS_PROD) return null;
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] bg-amber-600 text-white text-xs md:text-sm px-3 py-1 flex items-center justify-between shadow"
      role="status"
      aria-live="polite"
    >
      <span className="font-medium tracking-wide">
        STAGING — {APP_NAME}
      </span>
      <span className="font-mono">BUILD {BUILD_ID}</span>
    </div>
  );
}