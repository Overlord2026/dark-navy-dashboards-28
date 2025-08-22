import { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Calculator, FileText, Award, Shield, CheckCircle, Upload, AlertTriangle, BookOpen } from 'lucide-react';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';

const suitabilityChecks = [
  { factor: 'Age & Time Horizon', description: 'Appropriate for investor age and retirement timeline', icon: CheckCircle },
  { factor: 'Liquidity Needs', description: 'Surrender charges align with access requirements', icon: Shield },
  { factor: 'Fee Structure', description: 'Total costs justified by features and benefits', icon: Calculator },
  { factor: 'Issuer Rating', description: 'Carrier financial strength meets standards', icon: Award },
  { factor: '1035 Replacement', description: 'Exchange benefits outweigh costs and surrender charges', icon: FileText },
  { factor: 'Investment Objective', description: 'Product aligns with stated risk tolerance and goals', icon: CheckCircle }
];

export function Annuities() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [suitabilityResults, setSuitabilityResults] = useState<any>(null);

  const annuityTools = CATALOG_TOOLS.filter(tool => 
    tool.solutions.includes('annuities')
  );

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('annuities-solutions');
    }
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Annuities Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our annuities platform is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Annuities Solutions - Education, Calculators & Compliance"
        description="Complete annuities platform with education, calculators, proposal review, and fiduciary guidance. SPIA, DIA, MYGA, FIA, VA analysis tools."
        keywords={['annuities', 'annuity calculator', 'SPIA', 'DIA', 'MYGA', 'FIA', 'variable annuity', 'retirement income']}
      />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Annuities Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Education, calculators, and compliance tools—everything you need to recommend annuities with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {PUBLIC_CONFIG.DEMOS_ENABLED && (
                <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See 60-Second Demo
                </Button>
              )}
              
              <ShareButton
                title="Annuities Solutions"
                text="Complete annuities platform with education, calculators, and compliance tools"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Simplified for time */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Education', icon: BookOpen, description: 'Learn SPIA, DIA, MYGA, FIA, VA types' },
              { title: 'Calculators', icon: Calculator, description: 'Income projections and comparisons' },
              { title: 'Review', icon: FileText, description: 'Upload proposals for suitability checks' },
              { title: 'Index', icon: Award, description: 'Fiduciary product shortlist' }
            ].map((section) => (
              <Card key={section.title} className="text-center">
                <CardHeader>
                  <section.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Coming Soon</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Launcher */}
      {selectedDemo && (
        <div key={selectedDemo}>
          <DemoLauncher demoId={selectedDemo} />
        </div>
      )}
    </div>
  );
}