export type SwagPlan = { id: string; name?: string; [k: string]: unknown };
export type SwagInput = Record<string, unknown>;

export function isSwagPlan(x: unknown): x is SwagPlan {
  return !!x && typeof x === "object" && typeof (x as any).id === "string";
}