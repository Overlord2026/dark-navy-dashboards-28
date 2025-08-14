import { Link } from "react-router-dom";

export default function ToolsIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Tools & Calculators</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Professional-grade financial planning tools to help you make informed decisions about your wealth.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <ToolCard 
          to="/tools/value-calculator" 
          title="Value Calculator"
          body="Quantify coordination value, fees, taxes, and planning alpha for your family office setup." 
        />
        <ToolCard 
          to="/tools/target-analyzer" 
          title="Target Analyzer"
          body="Project to a target age with work rate, spending, and income scenarios." 
        />
        <ToolCard 
          to="/scorecard" 
          title="Retirement Scorecard™"
          body="Quick confidence score with personalized action items for retirement readiness." 
        />
        <ToolCard 
          to="/tools/retirement-confidence-scorecard" 
          title="Retirement Confidence"
          body="Comprehensive assessment of your retirement preparedness and strategy." 
        />
        <ToolCard 
          to="/analyzer/retirement-income-gap" 
          title="Income Gap Analyzer"
          body="Identify potential shortfalls in your retirement income planning." 
        />
        <ToolCard 
          to="/value-calculator" 
          title="Quick Value Calculator"
          body="Fast calculation of your financial planning value proposition." 
        />
      </div>
    </main>
  );
}

function ToolCard({ to, title, body }: { to: string; title: string; body: string }) {
  return (
    <Link 
      to={to} 
      className="block rounded-xl border border-border bg-card p-6 hover:bg-accent transition-colors group"
    >
      <div className="text-lg font-semibold text-foreground group-hover:text-accent-foreground">
        {title}
      </div>
      <div className="text-muted-foreground text-sm mt-2 leading-relaxed">
        {body}
      </div>
      <div className="mt-4 text-sm text-primary font-medium">
        Open →
      </div>
    </Link>
  );
}