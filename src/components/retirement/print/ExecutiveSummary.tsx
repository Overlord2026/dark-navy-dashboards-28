import type { SwagExplainPack } from '@/lib/explainpack';
import type { RetirementAnalysisResults } from '@/types/retirement';

interface ExecutiveSummaryProps {
  explainPack: SwagExplainPack;
  result: RetirementAnalysisResults;
}

export function ExecutiveSummary({ explainPack, result }: ExecutiveSummaryProps) {
  const summary = explainPack.summary;
  
  return (
    <div className="page-break-before p-8">
      <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
      
      <div className="mb-8">
        <div className="text-6xl font-bold text-primary mb-2">
          {summary.readiness_score?.toFixed(0) || result.readinessScore.toFixed(0)}
        </div>
        <div className="text-xl text-muted-foreground">Readiness Score</div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Success Probability</div>
          <div className="text-2xl font-semibold">
            {((summary.success_probability || result.monteCarlo.successProbability) * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">SWAG Score</div>
          <div className="text-2xl font-semibold">
            {(summary.swag_score || result.monteCarlo.swagScore).toFixed(0)}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Years Sustained</div>
          <div className="text-2xl font-semibold">
            {summary.years_sustained || result.monteCarlo.yearsOfPortfolioSustainability}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Monthly Income Gap</div>
          <div className="text-2xl font-semibold">
            ${(summary.monthly_income_gap || result.monthlyIncomeGap).toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Top Recommendations</h3>
        <div className="space-y-3">
          {result.recommendations.slice(0, 3).map((rec, idx) => (
            <div key={rec.id} className="border-l-4 border-primary pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium uppercase">{rec.priority} Priority</span>
              </div>
              <div className="font-semibold">{rec.title}</div>
              <div className="text-sm text-muted-foreground">{rec.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
