import React from "react";
import { BUILD_ID } from "@/lib/flags";

export default function HealthCheck() {
  return (
    <div style={{ padding: 16, fontFamily: "monospace", fontSize: 14 }}>
      <div>Status: <strong style={{ color: "green" }}>ok</strong></div>
      <div>Build: <code>{BUILD_ID}</code></div>
      <div>Timestamp: {new Date().toISOString()}</div>
    </div>
  );
}