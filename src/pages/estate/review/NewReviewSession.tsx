import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createReviewSession } from '@/features/estate/review/service';
import { useToast } from '@/hooks/use-toast';

export default function NewReviewSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [clientId] = useState(searchParams.get('clientId') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [docIds, setDocIds] = useState<string[]>([]);
  const [newDocId, setNewDocId] = useState('');
  const [fee, setFee] = useState({ amount: 250, currency: 'USD' as const });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const addDocId = () => {
    if (newDocId.trim() && !docIds.includes(newDocId.trim())) {
      setDocIds([...docIds, newDocId.trim()]);
      setNewDocId('');
    }
  };

  const removeDocId = (id: string) => {
    setDocIds(docIds.filter(d => d !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !state || docIds.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please provide client ID, state, and at least one document ID.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const session = await createReviewSession({
        clientId,
        state,
        docIds,
        createdBy: 'current-user-id', // Would be actual user ID
        fee: fee.amount > 0 ? fee : undefined
      });

      toast({
        title: 'Review Session Created',
        description: `Review packet prepared for ${state}. Session ID: ${session.id}`,
      });

      navigate(`/attorney/estate/review/${session.id}`);
    } catch (error) {
      console.error('Error creating review session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create review session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Prepare Attorney Review Package</CardTitle>
          <CardDescription>
            Generate a comprehensive review packet for attorney sign-off and family delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={clientId}
                  readOnly
                  placeholder="Client identifier"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Document IDs</Label>
              <div className="flex gap-2">
                <Input
                  value={newDocId}
                  onChange={(e) => setNewDocId(e.target.value)}
                  placeholder="Enter document ID"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocId())}
                />
                <Button type="button" onClick={addDocId} variant="outline">
                  Add
                </Button>
              </div>
              {docIds.length > 0 && (
                <div className="space-y-2">
                  {docIds.map((id) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{id}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocId(id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Review Fee (USD)</Label>
              <Input
                id="fee"
                type="number"
                value={fee.amount}
                onChange={(e) => setFee({ ...fee, amount: Number(e.target.value) })}
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for the attorney review..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Prepare Attorney Review Package'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}