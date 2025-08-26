import React from 'react';
import CountyRuleViewer from "@/components/estate/CountyRuleViewer";

export default function EstateRonDemoPage(){
  const pv = "E-2025.08";

  return (
    <div className="p-4 space-y-3">
      <div className="text-lg font-semibold">Estate RON Demo</div>
      
      {/* Demo stepper buttons */}
      <div className="flex gap-2 flex-wrap">
        <button className="border rounded px-3 py-1">Cover Sheet</button>
        <button className="border rounded px-3 py-1">RON Session</button>
        <button className="border rounded px-3 py-1">PRE Grant</button>
        <button className="border rounded px-3 py-1">Recording</button>
        <button className="border rounded px-3 py-1">Anchor</button>
      </div>

      {/* County Rule Viewer */}
      <CountyRuleViewer policyVersion={pv} />

      <div className="text-sm text-gray-600">
        Demo steps completed. Check Receipt Viewer for content-free receipts.
      </div>
    </div>
  );
}