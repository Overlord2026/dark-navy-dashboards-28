
import { v4 as uuidv4 } from "uuid";
import { DiagnosticTestStatus } from "./types";
import { RoleSimulationTestResult } from "@/types/diagnostics";

export function runRoleSimulationTests(): RoleSimulationTestResult[] {
  const results: RoleSimulationTestResult[] = [];
  
  // Mock role simulation tests
  const roleSimulations = [
    { role: "admin", scenario: "Access admin dashboard", status: "pass", message: "Admin can access admin dashboard" },
    { role: "admin", scenario: "Modify user permissions", status: "pass", message: "Admin can modify user permissions" },
    { role: "advisor", scenario: "View client portfolios", status: "pass", message: "Advisor can view client portfolios" },
    { role: "advisor", scenario: "Access admin settings", status: "fail", message: "Advisor correctly blocked from admin settings" },
    { role: "client", scenario: "View own portfolio", status: "pass", message: "Client can view their portfolio" },
    { role: "client", scenario: "View other client data", status: "fail", message: "Client correctly blocked from other clients' data" },
  ];
  
  roleSimulations.forEach(sim => {
    results.push({
      id: uuidv4(),
      role: sim.role,
      scenario: sim.scenario,
      status: sim.status as "pass" | "fail" | "warn",
      message: sim.message,
      details: { timestamp: new Date().toISOString() }
    });
  });

  return results;
}
