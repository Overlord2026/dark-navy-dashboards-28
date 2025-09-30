import type { SwagExplainPack } from '@/lib/explainpack';

interface CoverPageProps {
  explainPack: SwagExplainPack;
}

export function CoverPage({ explainPack }: CoverPageProps) {
  return (
    <div className="cover-page page-break-after flex flex-col items-center justify-center min-h-screen text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-bold mb-2">myBFOCFO</h1>
        <p className="text-xl text-muted-foreground">Boutique Family Office</p>
      </div>
      
      <h2 className="text-4xl font-bold mb-8">
        SWAG Retirement Analysis
      </h2>
      
      <div className="text-2xl mb-12">
        Scenario: <span className="font-semibold">{explainPack.scenario}</span>
      </div>
      
      <div className="space-y-2 text-lg text-muted-foreground">
        <div>Analysis ID: {explainPack.analysis_id}</div>
        <div>Generated: {new Date(explainPack.generated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
        <div>Version: {explainPack.policy_version}</div>
        <div>Build: {explainPack.build_id}</div>
      </div>
    </div>
  );
}
