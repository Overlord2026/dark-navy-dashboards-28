export type Answer = { id: string; optionId: string; points?: number };
export type QuestionOption = { id: string; points: number };
export type Question = { id: string; options: QuestionOption[] };

export function calculateScore(answers: Answer[], questions: Question[]) {
  const pointMap = new Map(questions.flatMap(q => q.options.map(o => [`${q.id}:${o.id}`, o.points])));
  let total = 0;
  for (const a of answers) {
    total += pointMap.get(`${a.id}:${a.optionId}`) ?? 0;
  }
  // Max points based on schema above (96) → scaled to 100
  const scaled = Math.round((total / 96) * 100);
  return Math.max(0, Math.min(100, scaled));
}

export function bandForScore(score: number) {
  if (score >= 85) return { label: "Confident (Green)", color: "#10B981" };
  if (score >= 65) return { label: "Work In Progress (Amber)", color: "#F59E0B" };
  return { label: "At Risk (Red)", color: "#EF4444" };
}