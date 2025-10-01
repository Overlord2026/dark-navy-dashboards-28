import React from "react";
import { BUILD_ID, FLAGS } from "@/config/flags";

export default function NonProdBanner() {
  if (FLAGS.IS_PRODUCTION || !FLAGS.showNonProdBanner) return null;
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] bg-amber-600 text-white text-xs md:text-sm px-3 py-1 flex items-center justify-center shadow"
      role="status"
      aria-live="polite"
    >
      <span className="font-medium tracking-wide">
        STAGING — BUILD {BUILD_ID}
      </span>
    </div>
  );
}