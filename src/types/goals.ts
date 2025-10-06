export type GoalPriority = "low" | "medium" | "high" | "top_aspiration";

export const priorityOrder: Record<GoalPriority, number> = {
  top_aspiration: 0,
  high: 1,
  medium: 2,
  low: 3
};

export function toPriority(v: number | string | null | undefined): GoalPriority {
  if (v === 0 || v === "top_aspiration") return "top_aspiration";
  if (v === 1 || v === "high") return "high";
  if (v === 2 || v === "medium") return "medium";
  return "low";
}

export function fromPriority(p: GoalPriority): number {
  return p === "top_aspiration" ? 0 : p === "high" ? 1 : p === "medium" ? 2 : 3;
}
