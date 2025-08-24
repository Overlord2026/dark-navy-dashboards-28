/**
 * Regulatory Data Signatures (RDS) for goal tracking and compliance
 */

type Anchor = { chain_id: string; tx_ref: string; ts: number };

type RDS = {
  type: "Goal-RDS" | "Goal-Update-RDS" | "Month-RDS" | "Professional-RDS" | "Decision-RDS";
  inputs_hash: string;
  policy_version: string;
  payload: Record<string, unknown>;
  timestamp: string;
  cross_chain_locator?: Anchor[];
};

const policy_version = "v1.0";

function hash(obj: unknown) {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 24);
}

export function recordGoalRDS(payload: Record<string, unknown>) {
  const r: RDS = {
    type: "Goal-RDS",
    inputs_hash: hash(payload),
    policy_version,
    payload,
    timestamp: new Date().toISOString()
  };
  console.log("[RDS]", r);
  return r;
}

export function recordGoalUpdateRDS(payload: Record<string, unknown>) {
  const r: RDS = {
    type: "Goal-Update-RDS",
    inputs_hash: hash(payload),
    policy_version,
    payload,
    timestamp: new Date().toISOString()
  };
  console.log("[RDS]", r);
  return r;
}

export function recordMonthRDS(payload: Record<string, unknown>) {
  const r: RDS = {
    type: "Month-RDS",
    inputs_hash: hash(payload),
    policy_version,
    payload,
    timestamp: new Date().toISOString()
  };
  console.log("[RDS]", r);
  return r;
}

export function recordProfessionalRDS(payload: Record<string, unknown>) {
  const r: RDS = {
    type: "Professional-RDS",
    inputs_hash: hash(payload),
    policy_version,
    payload,
    timestamp: new Date().toISOString()
  };
  console.log("[RDS]", r);
  return r;
}

export function recordDecisionRDS(payload: Record<string, unknown>) {
  const r: RDS = {
    type: "Decision-RDS",
    inputs_hash: hash(payload),
    policy_version,
    payload,
    timestamp: new Date().toISOString()
  };
  console.log("[RDS]", r);
  return r;
}