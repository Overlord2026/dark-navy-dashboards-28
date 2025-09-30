import React from "react";
import { BUILD_ID } from "@/config/flags";

export default function FooterBuildTag() {
  const tag = BUILD_ID || "unknown";
  return (
    <div className="text-[10px] md:text-xs opacity-60 font-mono">
      build {tag}
    </div>
  );
}