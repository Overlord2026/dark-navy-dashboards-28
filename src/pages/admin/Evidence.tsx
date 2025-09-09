import React from "react";
import EvidenceHUD from "@/components/evidence/EvidenceHUD";

export default function Evidence() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Evidence Console</h2>
      <EvidenceHUD />
    </div>
  );
}