import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ResultsKpiTilesProps {
  successProbability: number;
  etayValue?: number;
  seayValue?: number;
  breachRate: number;
}

export function ResultsKpiTiles({ 
  successProbability, 
  etayValue, 
  seayValue, 
  breachRate 
}: ResultsKpiTilesProps) {
  // Generate placeholder sparkline path
  const generateSparkline = () => {
    const points = 20;
    const height = 30;
    const width = 100;
    let path = `M 0 ${height}`;
    
    for (let i = 1; i <= points; i++) {
      const x = (i / points) * width;
      const y = height - (Math.random() * height * 0.7 + height * 0.15);
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  const kpis = [
    {
      label: 'Success Probability',
      value: `${(successProbability * 100).toFixed(1)}%`,
      sparkline: generateSparkline(),
      color: 'text-emerald-600'
    },
    {
      label: 'ETAY',
      value: etayValue ? `${etayValue.toFixed(2)}%` : '—',
      sparkline: generateSparkline(),
      color: 'text-blue-600'
    },
    {
      label: 'SEAY',
      value: seayValue ? `${seayValue.toFixed(2)}%` : '—',
      sparkline: generateSparkline(),
      color: 'text-purple-600'
    },
    {
      label: 'Breach Rate',
      value: `${(breachRate * 100).toFixed(1)}%`,
      sparkline: generateSparkline(),
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {kpi.label}
              </span>
              <div className={`text-3xl font-bold ${kpi.color}`}>
                {kpi.value}
              </div>
              {/* Sparkline */}
              <svg 
                viewBox="0 0 100 30" 
                className="w-full h-8 mt-2 opacity-40"
                preserveAspectRatio="none"
              >
                <path
                  d={kpi.sparkline}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={kpi.color}
                />
              </svg>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
