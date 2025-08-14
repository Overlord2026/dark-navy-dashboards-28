import { Link } from "react-router-dom";

export default function ToolsIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Tools & Calculators</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Value Calculator"
          body="Quantify fees, taxes, coordination value, and planning alpha."
          to="/tools/value-calculator"
        />
        <Card
          title="Target Analyzer"
          body="Project to a target age with work rate, spending, and income sources."
          to="/tools/target-analyzer"
        />
        <Card
          title="Retirement Scorecard™"
          body="Quick confidence score plus action items."
          to="/scorecard"
        />
      </div>
    </main>
  );
}

function Card({ title, body, to }: { title: string; body: string; to: string }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-white/12 bg-[#0f1b27] p-5 hover:bg-white/5"
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="opacity-80 text-sm mt-1">{body}</div>
      <div className="mt-3 text-sm text-[#d9a52b]">Open →</div>
    </Link>
  );
}