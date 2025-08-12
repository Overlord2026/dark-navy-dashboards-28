import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function ConsentIssuerModal() {
  const [subject, setSubject] = useState('');
  const [scopes, setScopes] = useState('{}');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const issue = async () => {
    if (!subject.trim()) {
      toast({ title: "Error", description: "Subject user ID is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const parsedScopes = JSON.parse(scopes);
      const { data, error } = await supabase.functions.invoke('issue-consent', { 
        body: { 
          subject_user: subject, 
          scopes: parsedScopes 
        } 
      });
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Consent token issued successfully" });
      setOpen(false);
      setSubject('');
      setScopes('{}');
    } catch (error) {
      console.error('Error issuing consent:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to issue consent",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline">
        Issue Consent Token
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Issue Consent Token</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Subject user UUID"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <Textarea
          placeholder='{"jurisdiction": "US", "productOrMedia": "financial", "audience": "public"}'
          rows={4}
          value={scopes}
          onChange={e => setScopes(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={issue} disabled={loading}>
            {loading ? "Creating..." : "Create Token"}
          </Button>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}