
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

export default function Education() {
  return (
    <ThreeColumnLayout activeMainItem="education" title="Education Center">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Education Center</h1>
        <p className="text-lg mb-4">
          Welcome to the Education Center. This page is currently under development.
        </p>
        <div className="bg-primary-foreground p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p>
            Educational resources and courses will be available here shortly. Check back soon for financial education materials.
          </p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
