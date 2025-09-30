import type { SwagExplainPack } from '@/lib/explainpack';
import type { RetirementAnalysisResults } from '@/types/retirement';

interface AnalysisResultsProps {
  summary: SwagExplainPack['summary'];
  result: RetirementAnalysisResults;
}

export function AnalysisResults({ summary, result }: AnalysisResultsProps) {
  const mc = result.monteCarlo;
  
  return (
    <div className="page-break-before p-8">
      <h2 className="text-3xl font-bold mb-6">Analysis Results</h2>
      
      {/* Monte Carlo KPIs */}
      <section className="mb-8 page-break-avoid">
        <h3 className="text-xl font-semibold mb-4">Monte Carlo Simulation Results</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Success Probability</div>
            <div className="text-3xl font-bold text-primary">
              {((summary.success_probability || mc.successProbability) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">SWAG Score</div>
            <div className="text-3xl font-bold">
              {(summary.swag_score || mc.swagScore).toFixed(0)}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Years Sustained</div>
            <div className="text-3xl font-bold">
              {summary.years_sustained || mc.yearsOfPortfolioSustainability}
            </div>
          </div>
        </div>
        
        <h4 className="font-medium mb-3">Terminal Portfolio Value Percentiles</h4>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">10th Percentile (Worst Case)</div>
            <div className="text-2xl font-semibold text-destructive">
              ${mc.worstCase10th.toLocaleString()}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">50th Percentile (Median)</div>
            <div className="text-2xl font-semibold">
              ${mc.medianPortfolioValue.toLocaleString()}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">90th Percentile (Best Case)</div>
            <div className="text-2xl font-semibold text-success">
              ${mc.bestCase90th.toLocaleString()}
            </div>
          </div>
        </div>
        
        {(summary.etay_value || summary.seay_value) && (
          <div>
            <h4 className="font-medium mb-3">Alternative Asset Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              {summary.etay_value && (
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">ETAY</div>
                  <div className="text-2xl font-semibold">
                    {(summary.etay_value * 100).toFixed(2)}%
                  </div>
                </div>
              )}
              
              {summary.seay_value && (
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">SEAY</div>
                  <div className="text-2xl font-semibold">
                    {(summary.seay_value * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      
      {/* Recommendations */}
      <section className="page-break-avoid">
        <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
        <div className="space-y-4">
          {result.recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-lg">{rec.title}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${
                  rec.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                  rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-700' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {rec.priority}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              
              {rec.implementation.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Implementation Steps:</div>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {rec.implementation.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {rec.impactAmount > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Estimated Impact:</span>
                  <span className="ml-2 font-semibold">${rec.impactAmount.toLocaleString()}/year</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
