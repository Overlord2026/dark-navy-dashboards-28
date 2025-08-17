import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Settings, 
  TestTube,
  Shield,
  Gauge,
  Users,
  Upload,
  LucideIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HandoffPage = () => {
  const [handoffData, setHandoffData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateHandoff = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/handoff');
      const data = await response.json();
      setHandoffData(data);
      toast({
        title: "Handoff Documentation Generated",
        description: "Development handoff ready for review",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate handoff documentation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <Settings className="w-4 h-4 text-yellow-600" />;
  };

  const getFeatureIcon = (feature: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      navigation: Users,
      dashboard: Gauge,
      calculators: TestTube,
      collaboration: Users,
      documents: Upload,
      security: Shield,
      quality: CheckCircle
    };
    return icons[feature] || Settings;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6 space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Development Handoff</h1>
        <p className="text-muted-foreground">
          Generate comprehensive handoff documentation for stakeholder review
        </p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={generateHandoff}
          disabled={isLoading}
          className="px-8"
        >
          <FileText className="w-4 h-4 mr-2" />
          {isLoading ? 'Generating...' : 'Generate Handoff Documentation'}
        </Button>
      </div>

      {handoffData && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {handoffData.summary.completedFeatures}/{handoffData.summary.totalFeatures}
                  </div>
                  <p className="text-sm text-muted-foreground">Features Complete</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {handoffData.summary.testCoverage}
                  </div>
                  <p className="text-sm text-muted-foreground">Test Coverage</p>
                </div>
                <div className="text-center">
                  <Badge variant="default" className="text-lg py-1">
                    {handoffData.summary.securityStatus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Security</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg py-1">
                    {handoffData.summary.accessibilityStatus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Accessibility</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Status */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(handoffData.featureStatus).map(([key, feature]: [string, any]) => {
                  const IconComponent = getFeatureIcon(key);
                  return (
                    <div key={key} className="flex items-start gap-3 p-3 border rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">{key}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(feature.status)}
                            <Badge variant="outline">{feature.status}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{feature.notes}</p>
                        <div className="text-xs text-blue-600 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Test: {feature.testLink}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Test Links */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Test Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Primary User Flows</h4>
                  <div className="grid gap-2">
                    {handoffData.testLinks.primaryFlows.map((flow, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <span className="font-medium">{flow.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({flow.url})</span>
                        </div>
                        <Badge variant="default">Working</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Audit & Quality Tools</h4>
                  <div className="grid gap-2">
                    {handoffData.testLinks.auditTools.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <span className="font-medium">{tool.name}</span>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                        <Badge variant="secondary">Available</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HQ Paste Block */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HQ Paste Block
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(handoffData.hqPasteBlock, 'HQ Paste Block')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {handoffData.hqPasteBlock}
              </pre>
            </CardContent>
          </Card>

          {/* Architecture Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Frontend</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {handoffData.architecture.frontend.framework}</li>
                    <li>• {handoffData.architecture.frontend.styling}</li>
                    <li>• {handoffData.architecture.frontend.stateManagement}</li>
                    <li>• {handoffData.architecture.frontend.components}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Backend</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {handoffData.architecture.backend.database}</li>
                    <li>• {handoffData.architecture.backend.authentication}</li>
                    <li>• {handoffData.architecture.backend.apis}</li>
                    <li>• {handoffData.architecture.backend.fileStorage}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deployment</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {handoffData.architecture.deployment.hosting}</li>
                    <li>• {handoffData.architecture.deployment.cicd}</li>
                    <li>• {handoffData.architecture.deployment.monitoring}</li>
                    <li>• {handoffData.architecture.deployment.analytics}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default HandoffPage;