import type { SwagInput, SwagPlan } from "../_shared/swag-types.ts";

export function parseToSwag(input: unknown): { plan: SwagPlan; raw: SwagInput } {
  const raw: SwagInput = (input && typeof input === "object") ? (input as SwagInput) : {};
  const plan: SwagPlan = {
    id: String(raw["id"] ?? "SWAG-DEMO"),
    name: String(raw["name"] ?? "Demo Plan"),
    ...raw
  };
  return { plan, raw };
}