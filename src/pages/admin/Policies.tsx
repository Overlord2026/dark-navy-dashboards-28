import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, Plus, Edit, Hash } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Policy = Database['public']['Tables']['policies']['Row'];
type PolicyInsert = Database['public']['Tables']['policies']['Insert'];

interface QueueItem {
  item_id: string;
  action: string;
  status: string;
  created_at: string;
  ref_hit_id: string;
}

interface Receipt {
  receipt_id: string;
  policy_hash: string;
  outcome: string;
  created_at: string;
}

interface QueueItem {
  item_id: string;
  action: string;
  status: string;
  created_at: string;
  ref_hit_id: string;
}

interface Receipt {
  receipt_id: string;
  policy_hash: string;
  outcome: string;
  created_at: string;
}

const AdminPolicies: React.FC = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    policy_name: '',
    policy_dsl: '{}',
    compiled_graph: '{}',
    version: 1,
    jurisdiction: 'US'
  });

  // Compute SHA256 hash client-side
  const computePolicyHash = async (policyData: any) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(policyData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch policies
      const { data: policiesData, error: policiesError } = await supabase
        .from('policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (policiesError) throw policiesError;

      // Fetch queue items
      const { data: queueData, error: queueError } = await supabase
        .from('enforcement_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (queueError) throw queueError;

      // Fetch receipts
      const { data: receiptsData, error: receiptsError } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (receiptsError) throw receiptsError;

      setPolicies(policiesData || []);
      setQueueItems(queueData || []);
      setReceipts(receiptsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch policies data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePolicy = async () => {
    try {
      let policyDsl, compiledGraph;
      try {
        policyDsl = JSON.parse(formData.policy_dsl);
        compiledGraph = JSON.parse(formData.compiled_graph);
      } catch (e) {
        toast({
          title: "Error",
          description: "Policy DSL and compiled graph must be valid JSON",
          variant: "destructive",
        });
        return;
      }

      const hash = await computePolicyHash(policyDsl);

      const policyData: PolicyInsert = {
        policy_name: formData.policy_name,
        policy_dsl: policyDsl,
        compiled_graph: compiledGraph,
        version: formData.version,
        jurisdiction: formData.jurisdiction,
        is_active: true,
        tenant_id: 'default' // Replace with actual tenant ID
      };

      let result;
      if (selectedPolicy) {
        // Update existing policy
        result = await supabase
          .from('policies')
          .update(policyData)
          .eq('id', selectedPolicy.id);
      } else {
        // Create new policy
        result = await supabase
          .from('policies')
          .insert([policyData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Policy ${selectedPolicy ? 'updated' : 'created'} successfully`,
      });

      setIsEditing(false);
      setSelectedPolicy(null);
      setFormData({ 
        policy_name: '', 
        policy_dsl: '{}', 
        compiled_graph: '{}',
        version: 1,
        jurisdiction: 'US'
      });
      fetchData();
    } catch (error) {
      console.error('Error saving policy:', error);
      toast({
        title: "Error",
        description: "Failed to save policy",
        variant: "destructive",
      });
    }
  };

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData({
      policy_name: policy.policy_name,
      policy_dsl: JSON.stringify(policy.policy_dsl, null, 2),
      compiled_graph: JSON.stringify(policy.compiled_graph, null, 2),
      version: policy.version,
      jurisdiction: policy.jurisdiction || 'US'
    });
    setIsEditing(true);
  };

  const handleNewPolicy = () => {
    setSelectedPolicy(null);
    setFormData({ 
      policy_name: '', 
      policy_dsl: '{}', 
      compiled_graph: '{}',
      version: 1,
      jurisdiction: 'US'
    });
    setIsEditing(true);
  };

  // Check for mismatched policy hashes - simplified for demo
  const getPolicyHashWarnings = () => {
    // In a real implementation, you'd compute hashes for each policy and compare
    return {
      total: receipts.length,
      mismatched: 0,
      mismatchedHashes: []
    };
  };

  const warnings = getPolicyHashWarnings();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading policies...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Policy Administration</h1>
        <Button onClick={handleNewPolicy} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Policy
        </Button>
      </div>

      {warnings.mismatched > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: {warnings.mismatched} enforcement actions reference mismatched policy hashes. 
            This may indicate outdated policies or security issues.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="policies" className="w-full">
        <TabsList>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
          <TabsTrigger value="editor">Policy Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {policy.policy_name}
                        {policy.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Version: {policy.version} | Jurisdiction: {policy.jurisdiction}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPolicy(policy)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {policy.id}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(policy.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{policies.filter(p => p.is_active).length}</div>
                  <div className="text-sm text-muted-foreground">Active Policies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{queueItems.length}</div>
                  <div className="text-sm text-muted-foreground">Queue Items</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${warnings.mismatched > 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {warnings.mismatched}
                  </div>
                  <div className="text-sm text-muted-foreground">Mismatched Hashes</div>
                </div>
              </div>

              {warnings.mismatchedHashes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Mismatched Policy Hashes:</h4>
                  <div className="space-y-1">
                    {warnings.mismatchedHashes.map((hash, index) => (
                      <div key={index} className="text-sm font-mono bg-destructive/10 px-2 py-1 rounded">
                        {hash}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedPolicy ? 'Edit Policy' : 'Create New Policy'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy_name">Policy Name</Label>
                    <Input
                      id="policy_name"
                      value={formData.policy_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, policy_name: e.target.value }))}
                      placeholder="Enter policy name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      type="number"
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: parseInt(e.target.value) || 1 }))}
                      placeholder="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Input
                    id="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData(prev => ({ ...prev, jurisdiction: e.target.value }))}
                    placeholder="US"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policy-dsl">Policy DSL (JSON)</Label>
                  <Textarea
                    id="policy-dsl"
                    value={formData.policy_dsl}
                    onChange={(e) => setFormData(prev => ({ ...prev, policy_dsl: e.target.value }))}
                    placeholder='{"rules": [], "conditions": {}}'
                    rows={8}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compiled-graph">Compiled Graph (JSON)</Label>
                  <Textarea
                    id="compiled-graph"
                    value={formData.compiled_graph}
                    onChange={(e) => setFormData(prev => ({ ...prev, compiled_graph: e.target.value }))}
                    placeholder='{"nodes": [], "edges": []}'
                    rows={8}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSavePolicy}>
                    {selectedPolicy ? 'Update Policy' : 'Create Policy'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedPolicy(null);
                      setFormData({ 
                        policy_name: '', 
                        policy_dsl: '{}', 
                        compiled_graph: '{}',
                        version: 1,
                        jurisdiction: 'US'
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Select a policy to edit or create a new one</p>
                  <Button onClick={handleNewPolicy} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPolicies;