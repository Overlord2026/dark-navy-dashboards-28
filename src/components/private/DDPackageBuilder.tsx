import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildDDPackage, getDDPackages, type DDPackageResult } from '@/engines/private/ddPack';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, FileText, Archive, CheckCircle } from 'lucide-react';

interface DDPackageBuilderProps {
  fundId: string;
}

export function DDPackageBuilder({ fundId }: DDPackageBuilderProps) {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [currentPackage, setCurrentPackage] = useState<DDPackageResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingPackages();
  }, [fundId]);

  const loadExistingPackages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existingPackages = await getDDPackages(user.id, fundId);
      setPackages(existingPackages);
    } catch (error) {
      console.warn('Failed to load existing packages:', error);
    }
  };

  const handleGeneratePackage = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await buildDDPackage({
        userId: user.id,
        fundId
      });

      setCurrentPackage(result);
      
      // Reload packages list
      await loadExistingPackages();

      toast({
        title: "DD Package Generated",
        description: `Due diligence package created for ${fundId}`,
        action: (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.open(result.pdfUrl, '_blank')}>
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open(result.zipUrl, '_blank')}>
              <Archive className="h-4 w-4 mr-1" />
              ZIP
            </Button>
          </div>
        )
      });
    } catch (error) {
      console.error('DD package generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate DD package",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Due Diligence Package Builder</CardTitle>
          <CardDescription>
            Generate comprehensive compliance-ready due diligence documentation for {fundId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={handleGeneratePackage}
              disabled={loading}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate DD Package
            </Button>
            
            {currentPackage && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Package ready</span>
              </div>
            )}
          </div>

          {/* Package Contents Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Package Contents</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Performance Analysis</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• PM3 Score & Breakdown</li>
                  <li>• Risk-Adjusted Returns</li>
                  <li>• Benchmark Comparison</li>
                  <li>• Drawdown Analysis</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Liquidity Assessment</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Liquidity IQ™ Score</li>
                  <li>• Redemption History</li>
                  <li>• Gate Probability</li>
                  <li>• NAV→Cash Timeline</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Operational Due Diligence</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Manager Information</li>
                  <li>• Compliance Checks</li>
                  <li>• Service Provider Review</li>
                  <li>• Risk Management</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Documentation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Legal Documents</li>
                  <li>• Financial Statements</li>
                  <li>• Marketing Materials</li>
                  <li>• Regulatory Filings</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package History */}
      {packages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Packages</CardTitle>
            <CardDescription>
              Previously generated DD packages for {fundId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packages.map((pkg, index) => {
                const artifactUrls = JSON.parse(pkg.artifact_urls || '{}');
                return (
                  <div key={pkg.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">
                        DD Package #{packages.length - index}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Generated on {formatDate(pkg.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {JSON.parse(pkg.snapshot).complianceChecks?.length || 0} Checks
                      </Badge>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(artifactUrls.pdfUrl, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(artifactUrls.zipUrl, '_blank')}
                      >
                        <Archive className="h-4 w-4 mr-1" />
                        ZIP
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}