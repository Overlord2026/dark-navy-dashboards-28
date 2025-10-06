export type GoalPriority = "low" | "medium" | "high";

export function toPriority(v: number | string | null | undefined): GoalPriority {
  if (v === 3 || v === "high") return "high";
  if (v === 2 || v === "medium") return "medium";
  return "low";
}

export function fromPriority(p: GoalPriority): number {
  return p === "high" ? 3 : p === "medium" ? 2 : 1;
}
