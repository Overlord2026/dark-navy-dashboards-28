import React from "react";
import { BUILD_ID } from "../../lib/flags";

export default function FooterBuildTag() {
  return (
    <div className="text-[10px] md:text-xs opacity-60 font-mono">
      build {BUILD_ID}
    </div>
  );
}