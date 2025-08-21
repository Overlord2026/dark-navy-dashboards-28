import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, DollarSign, Users, Calendar } from 'lucide-react';
import { createOffer, checkConflicts, getOffers, NILOffer } from '@/features/nil/offers/store';
import { previewSplit, calculateSplitAmounts } from '@/features/nil/splits/preview';
import { toast } from 'sonner';

export default function OffersPage() {
  const [offers, setOffers] = React.useState<NILOffer[]>([]);
  const [formData, setFormData] = React.useState({
    brand: '',
    category: '',
    startDate: '',
    endDate: '',
    channels: [] as string[],
    amount: 0
  });
  const [selectedOffer, setSelectedOffer] = React.useState<string | null>(null);
  const [conflicts, setConflicts] = React.useState<string[]>([]);

  React.useEffect(() => {
    setOffers(getOffers());
  }, []);

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleCreateOffer = () => {
    try {
      const { offerId } = createOffer(formData);
      setOffers(getOffers());
      setSelectedOffer(offerId);
      
      // Check for conflicts
      const conflictCheck = checkConflicts(offerId);
      setConflicts(conflictCheck.conflicts || []);
      
      toast.success('Offer created successfully!');
      
      // Reset form
      setFormData({
        brand: '',
        category: '',
        startDate: '',
        endDate: '',
        channels: [],
        amount: 0
      });
    } catch (error) {
      toast.error('Failed to create offer');
    }
  };

  const handleCheckConflicts = (offerId: string) => {
    const conflictCheck = checkConflicts(offerId);
    setConflicts(conflictCheck.conflicts || []);
    setSelectedOffer(offerId);
  };

  const splitPreview = selectedOffer ? calculateSplitAmounts(selectedOffer, formData.amount || 5000) : [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Offers</h1>
        <p className="text-muted-foreground">
          Create and manage brand partnership offers
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Offer</CardTitle>
              <CardDescription>Set up a new brand partnership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand">Brand Name</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Athletic Apparel">Athletic Apparel</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Channels</Label>
                <div className="flex gap-2 mt-2">
                  {['IG', 'TikTok', 'YouTube'].map((channel) => (
                    <Button
                      key={channel}
                      variant={formData.channels.includes(channel) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChannelToggle(channel)}
                    >
                      {channel}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>

              <Button 
                onClick={handleCreateOffer}
                className="w-full"
                disabled={!formData.brand || !formData.category || formData.channels.length === 0}
              >
                Create Offer
              </Button>
            </CardContent>
          </Card>

          {conflicts.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Conflicts Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conflicts.map((conflict, index) => (
                    <div key={index} className="bg-orange-50 p-3 rounded-md">
                      <p className="text-sm text-orange-800">{conflict}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {splitPreview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Split Preview
                </CardTitle>
                <CardDescription>Revenue distribution breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {splitPreview.map((split) => (
                    <div key={split.party} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{split.party}</p>
                        <p className="text-sm text-muted-foreground">{split.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${split.amount}</p>
                        <p className="text-sm text-muted-foreground">{(split.share * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Existing Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{offer.brand}</p>
                      <p className="text-sm text-muted-foreground">{offer.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${offer.amount}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckConflicts(offer.id)}
                      >
                        Check Conflicts
                      </Button>
                    </div>
                  </div>
                ))}
                {offers.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No offers created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}