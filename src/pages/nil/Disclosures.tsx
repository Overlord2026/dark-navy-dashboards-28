import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, CheckCircle } from 'lucide-react';
import { chooseDisclosurePack, confirmDisclosurePack, DisclosurePack } from '@/features/nil/disclosures/rules';
import { toast } from 'sonner';

export default function DisclosuresPage() {
  const [channel, setChannel] = React.useState<'IG' | 'TikTok' | 'YouTube'>('IG');
  const [jurisdiction, setJurisdiction] = React.useState<'US' | 'CA'>('US');
  const [selectedPack, setSelectedPack] = React.useState<DisclosurePack | null>(null);
  const [reasons, setReasons] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const result = chooseDisclosurePack({ channel, jurisdiction });
      setSelectedPack(result.pack);
      setReasons(result.reasons);
    } catch (error) {
      setSelectedPack(null);
      setReasons([]);
    }
  }, [channel, jurisdiction]);

  const handleConfirmPack = () => {
    if (!selectedPack) return;

    try {
      const receipt = confirmDisclosurePack(selectedPack.id, { channel, jurisdiction });
      
      toast.success('Disclosure pack confirmed!', {
        description: `Receipt: ${receipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Receipt:', receipt)
        }
      });
    } catch (error) {
      toast.error('Failed to confirm disclosure pack');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Disclosure Packs</h1>
        <p className="text-muted-foreground">
          Select appropriate disclosure templates for your content
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Channel</label>
                <Select value={channel} onValueChange={(value: 'IG' | 'TikTok' | 'YouTube') => setChannel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IG">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Jurisdiction</label>
                <Select value={jurisdiction} onValueChange={(value: 'US' | 'CA') => setJurisdiction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedPack && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedPack.name}</CardTitle>
                  <CardDescription>Recommended disclosure pack</CardDescription>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Template</label>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  {selectedPack.template}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Compliance Reasons</label>
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <Badge key={reason} variant="outline">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleConfirmPack}
                className="w-full"
                size="lg"
              >
                Confirm Disclosure Pack
              </Button>
            </CardContent>
          </Card>
        )}

        {!selectedPack && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No disclosure pack available for the selected configuration
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}