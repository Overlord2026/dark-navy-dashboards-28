
import { v4 as uuidv4 } from "uuid";
import { DiagnosticTestStatus } from "./types";
import { IconTestResult } from "@/types/diagnostics";

export function runIconTests(): IconTestResult[] {
  const results: IconTestResult[] = [];

  // Mock implementation for icon tests
  const icons = [
    { name: "dashboard", status: "pass", message: "Icon renders correctly" },
    { name: "settings", status: "pass", message: "Icon renders correctly" },
    { name: "profile", status: "pass", message: "Icon renders correctly" },
    { name: "reports", status: "warn", message: "Icon may be too small for accessibility" },
    { name: "notifications", status: "fail", message: "Icon failed to load" },
  ];

  icons.forEach(icon => {
    results.push({
      id: uuidv4(),
      iconName: icon.name,
      status: icon.status as "pass" | "fail" | "warn",
      message: icon.message,
      details: { size: "24px", color: "currentColor", tested: new Date().toISOString() }
    });
  });

  return results;
}
