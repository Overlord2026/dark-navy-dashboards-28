import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Gavel, FileText, Clock } from 'lucide-react';
import { fileDispute, adjudicate, getDisputes, Dispute, Reallocation } from '@/features/nil/disputes/api';
import { getOffers } from '@/features/nil/offers/store';
import { toast } from 'sonner';

export default function DisputesPage() {
  const [disputes, setDisputes] = React.useState<Dispute[]>([]);
  const [disputeForm, setDisputeForm] = React.useState({
    offerId: '',
    code: '',
    notes: ''
  });
  const [adjudicationForm, setAdjudicationForm] = React.useState({
    disputeId: '',
    outcome: '',
    reallocations: [] as Reallocation[]
  });
  const [newReallocation, setNewReallocation] = React.useState({
    field: '',
    from: '',
    to: ''
  });

  const offers = React.useMemo(() => getOffers(), []);

  React.useEffect(() => {
    setDisputes(getDisputes());
  }, []);

  const handleFileDispute = () => {
    try {
      const disputeId = fileDispute(disputeForm.offerId, disputeForm.code, disputeForm.notes);
      setDisputes(getDisputes());
      
      toast.success('Dispute filed successfully', {
        description: `Dispute ID: ${disputeId}`
      });
      
      setDisputeForm({ offerId: '', code: '', notes: '' });
    } catch (error) {
      toast.error('Failed to file dispute');
    }
  };

  const handleAddReallocation = () => {
    if (newReallocation.field && newReallocation.from && newReallocation.to) {
      setAdjudicationForm(prev => ({
        ...prev,
        reallocations: [...prev.reallocations, { ...newReallocation }]
      }));
      setNewReallocation({ field: '', from: '', to: '' });
    }
  };

  const handleAdjudicate = () => {
    try {
      const receipt = adjudicate(
        adjudicationForm.disputeId,
        adjudicationForm.outcome,
        adjudicationForm.reallocations
      );
      
      setDisputes(getDisputes());
      
      toast.success('Dispute adjudicated!', {
        description: `Delta-RDS created: ${receipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Delta Receipt:', receipt)
        }
      });
      
      setAdjudicationForm({
        disputeId: '',
        outcome: '',
        reallocations: []
      });
    } catch (error) {
      toast.error('Failed to adjudicate dispute');
    }
  };

  const getOfferName = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    return offer ? `${offer.brand} - ${offer.category}` : offerId;
  };

  const activeDisputes = disputes.filter(d => d.status !== 'closed');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved' || d.status === 'closed');

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dispute Resolution</h1>
        <p className="text-muted-foreground">
          File and resolve disputes for NIL agreements
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                File New Dispute
              </CardTitle>
              <CardDescription>Report an issue with an NIL agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="offer">Affected Offer</Label>
                <select
                  id="offer"
                  value={disputeForm.offerId}
                  onChange={(e) => setDisputeForm(prev => ({ ...prev, offerId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select an offer</option>
                  {offers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.brand} - {offer.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="code">Dispute Code</Label>
                <Select value={disputeForm.code} onValueChange={(value) => setDisputeForm(prev => ({ ...prev, code: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dispute type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTENT_MISMATCH">Content Mismatch</SelectItem>
                    <SelectItem value="DISCLOSURE_VIOLATION">Disclosure Violation</SelectItem>
                    <SelectItem value="PAYMENT_DISPUTE">Payment Dispute</SelectItem>
                    <SelectItem value="EXCLUSIVITY_BREACH">Exclusivity Breach</SelectItem>
                    <SelectItem value="TIMELINE_VIOLATION">Timeline Violation</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Description</Label>
                <Textarea
                  id="notes"
                  value={disputeForm.notes}
                  onChange={(e) => setDisputeForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe the dispute in detail..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleFileDispute}
                className="w-full"
                disabled={!disputeForm.offerId || !disputeForm.code || !disputeForm.notes}
              >
                File Dispute
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Adjudicate Dispute
              </CardTitle>
              <CardDescription>Resolve disputes and create corrective actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="disputeToResolve">Select Dispute</Label>
                <select
                  id="disputeToResolve"
                  value={adjudicationForm.disputeId}
                  onChange={(e) => setAdjudicationForm(prev => ({ ...prev, disputeId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a dispute</option>
                  {activeDisputes.map((dispute) => (
                    <option key={dispute.id} value={dispute.id}>
                      {dispute.code} - {getOfferName(dispute.offerId)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="outcome">Resolution Outcome</Label>
                <Textarea
                  id="outcome"
                  value={adjudicationForm.outcome}
                  onChange={(e) => setAdjudicationForm(prev => ({ ...prev, outcome: e.target.value }))}
                  placeholder="Describe the resolution..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Reallocations</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Field"
                      value={newReallocation.field}
                      onChange={(e) => setNewReallocation(prev => ({ ...prev, field: e.target.value }))}
                    />
                    <Input
                      placeholder="From"
                      value={newReallocation.from}
                      onChange={(e) => setNewReallocation(prev => ({ ...prev, from: e.target.value }))}
                    />
                    <Input
                      placeholder="To"
                      value={newReallocation.to}
                      onChange={(e) => setNewReallocation(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddReallocation}
                    disabled={!newReallocation.field || !newReallocation.from || !newReallocation.to}
                  >
                    Add Reallocation
                  </Button>
                </div>

                <div className="space-y-1 mt-2">
                  {adjudicationForm.reallocations.map((realloc, index) => (
                    <div key={index} className="text-xs bg-muted p-2 rounded">
                      {realloc.field}: {realloc.from} → {realloc.to}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleAdjudicate}
                className="w-full"
                disabled={!adjudicationForm.disputeId || !adjudicationForm.outcome}
              >
                Adjudicate Dispute
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Active Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeDisputes.map((dispute) => (
                  <div key={dispute.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{dispute.code}</p>
                      <Badge variant={dispute.status === 'filed' ? 'secondary' : 'default'}>
                        {dispute.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {getOfferName(dispute.offerId)}
                    </p>
                    <p className="text-sm mb-2">{dispute.notes}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Filed: {new Date(dispute.filedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {activeDisputes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active disputes</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolved Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resolvedDisputes.map((dispute) => (
                  <div key={dispute.id} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{dispute.code}</p>
                      <Badge variant="outline">resolved</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {getOfferName(dispute.offerId)}
                    </p>
                    {dispute.outcome && (
                      <p className="text-sm mb-2 text-green-700">{dispute.outcome}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Resolved: {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                ))}
                {resolvedDisputes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No resolved disputes yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}