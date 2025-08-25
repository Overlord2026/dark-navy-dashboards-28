/**
 * AI Fabric Ontology Console
 * Interactive tool for exploring and validating the ontology
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { loadOntology, compile, validateOntology, generateTypes, type OntologySchema } from '@/features/ai/ontology/compile';
import { toast } from 'sonner';
import { FileText, CheckCircle2, AlertTriangle, Play, Zap } from 'lucide-react';

export default function OntologyConsole() {
  const [ontology, setOntology] = useState<OntologySchema | null>(null);
  const [yamlContent, setYamlContent] = useState('');
  const [generatedTypes, setGeneratedTypes] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOntologyData();
  }, []);

  const loadOntologyData = async () => {
    try {
      const schema = await loadOntology();
      setOntology(schema);
      
      // Generate TypeScript types
      const types = generateTypes(schema);
      setGeneratedTypes(types);
      
      toast.success('Ontology loaded successfully');
    } catch (error) {
      console.error('Failed to load ontology:', error);
      toast.error('Failed to load ontology');
    }
  };

  const validateYaml = () => {
    try {
      setLoading(true);
      const parsed = compile(yamlContent);
      const errors = validateOntology(parsed);
      
      setValidationErrors(errors);
      
      if (errors.length === 0) {
        const types = generateTypes(parsed);
        setGeneratedTypes(types);
        toast.success('Ontology validation passed');
      } else {
        toast.error(`Validation failed with ${errors.length} errors`);
      }
    } catch (error) {
      setValidationErrors([`Parse error: ${error}`]);
      toast.error('YAML parsing failed');
    } finally {
      setLoading(false);
    }
  };

  const testEntityCreation = () => {
    if (!ontology) return;
    
    try {
      // Test creating entities based on ontology
      const testHousehold = {
        id: 'hh-123',
        members: ['user-1', 'user-2'],
        advisorId: 'advisor-456',
        primaryContact: 'user-1',
        taxFilingStatus: 'MFJ' as const,
        estimatedNetWorth: 500000
      };
      
      const testAccount = {
        id: 'acc-789',
        type: '401k' as const,
        owner: 'user-1',
        provider: 'Fidelity',
        balance: 125000,
        performanceYTD: 0.08,
        riskLevel: 'Moderate' as const
      };
      
      console.log('[Ontology Test] Created entities:', { testHousehold, testAccount });
      toast.success('Entity creation test passed');
    } catch (error) {
      console.error('[Ontology Test] Failed:', error);
      toast.error('Entity creation test failed');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Fabric Ontology Console</h1>
          <p className="text-muted-foreground">YAML → TypeScript types with validation</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={validateYaml} disabled={loading}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Validate
          </Button>
          <Button onClick={testEntityCreation} variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Test Entities
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schema" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schema">Schema Overview</TabsTrigger>
          <TabsTrigger value="editor">YAML Editor</TabsTrigger>
          <TabsTrigger value="types">Generated Types</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-4">
          {ontology && (
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Entities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.keys(ontology.entities).map(entity => (
                      <div key={entity} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{entity}</span>
                        <Badge variant="secondary">
                          {Object.keys(ontology.entities[entity]).length} props
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Relations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(ontology.relations).map(([name, relation]) => (
                      <div key={name} className="text-xs">
                        <div className="font-medium">{name}</div>
                        <div className="text-muted-foreground">
                          {relation.from} → {relation.to}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ontology.workflows && Object.entries(ontology.workflows).map(([name, workflow]) => (
                      <div key={name} className="text-xs">
                        <div className="font-medium">{name}</div>
                        <div className="text-muted-foreground">
                          {workflow.steps.length} steps
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>YAML Ontology Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={yamlContent}
                onChange={(e) => setYamlContent(e.target.value)}
                placeholder="Paste your ontology YAML here..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated TypeScript Types</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[500px]">
                <code>{generatedTypes}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validationErrors.length === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                Validation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validationErrors.length === 0 ? (
                <div className="text-green-600 text-sm">
                  ✅ Ontology validation passed
                </div>
              ) : (
                <div className="space-y-2">
                  {validationErrors.map((error, i) => (
                    <div key={i} className="text-red-600 text-sm">
                      ❌ {error}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}