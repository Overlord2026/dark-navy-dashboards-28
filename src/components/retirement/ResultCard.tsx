interface ResultCardProps {
  p: number;
  flags: string[];
}

export default function ResultCard({ p, flags }: ResultCardProps) {
  const pct = Math.round(p * 100);
  const color = pct >= 75 ? "text-green-400" : pct >= 60 ? "text-yellow-300" : "text-red-400";
  const msg = flags.includes("raise_floor")
    ? "Guardrail: raise floor"
    : flags.includes("review_plan")
    ? "Guardrail: review plan"
    : "Within guardrails";

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-bfo-ivory">
      <div className="text-sm opacity-70">SWAG™ Analysis</div>
      <div className={`text-3xl font-extrabold ${color}`}>{pct}% success</div>
      <div className="opacity-80">{msg}</div>
    </div>
  );
}
