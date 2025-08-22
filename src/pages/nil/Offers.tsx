import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertTriangle, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';
import { createOffer, checkConflicts, getOffers, NILOffer } from '@/features/nil/offers/store';
import { previewSplit, calculateSplitAmounts } from '@/features/nil/splits/preview';
import { toast } from 'sonner';

export default function OffersPage() {
  const [offers, setOffers] = React.useState<NILOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<string | null>(null);
  const [conflicts, setConflicts] = React.useState<{ ok: boolean; conflicts?: string[] } | null>(null);
  const [splits, setSplits] = React.useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  
  // Form state
  const [formData, setFormData] = React.useState({
    brand: '',
    category: '',
    amount: 0,
    channels: [] as string[],
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });

  React.useEffect(() => {
    setOffers(getOffers());
  }, []);

  React.useEffect(() => {
    if (selectedOffer) {
      try {
        const conflictCheck = checkConflicts(selectedOffer);
        setConflicts(conflictCheck);
        
        const splitPreview = previewSplit(selectedOffer);
        const offer = offers.find(o => o.id === selectedOffer);
        if (offer) {
          const splitAmounts = calculateSplitAmounts(selectedOffer, offer.amount);
          setSplits(splitAmounts);
        }
      } catch (error) {
        console.error('Error checking conflicts:', error);
        setConflicts({ ok: false, conflicts: ['Error checking conflicts'] });
      }
    }
  }, [selectedOffer, offers]);

  const handleCreateOffer = () => {
    if (!formData.brand || !formData.category || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { offerId } = createOffer({
        brand: formData.brand,
        category: formData.category,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
        channels: formData.channels,
        amount: formData.amount
      });

      setOffers(getOffers());
      setSelectedOffer(offerId);
      setShowCreateForm(false);
      
      // Reset form
      setFormData({
        brand: '',
        category: '',
        amount: 0,
        channels: [],
        startDate: undefined,
        endDate: undefined
      });

      toast.success('Offer created successfully!', {
        description: `Offer ID: ${offerId}`
      });
    } catch (error) {
      toast.error('Failed to create offer');
    }
  };

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">NIL Offers</h1>
            <p className="text-muted-foreground">Create and manage your NIL offers</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            Create New Offer
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Offer</CardTitle>
              <CardDescription>Fill in the details for your new NIL offer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="Enter offer amount"
                />
              </div>

              <div>
                <Label>Channels</Label>
                <div className="flex gap-2 mt-2">
                  {['IG', 'TikTok', 'YouTube'].map(channel => (
                    <Button
                      key={channel}
                      variant={formData.channels.includes(channel) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleChannel(channel)}
                    >
                      {channel}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateOffer}>Create Offer</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {offers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                      selectedOffer === offer.id ? 'border-primary bg-muted/50' : ''
                    }`}
                    onClick={() => setSelectedOffer(offer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{offer.brand}</h3>
                        <p className="text-sm text-muted-foreground">{offer.category}</p>
                        <p className="text-sm">${offer.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {offer.startDate} - {offer.endDate}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {offer.channels.map(channel => (
                            <Badge key={channel} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedOffer && conflicts && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Conflict Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conflicts.ok ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Badge variant="default">No Conflicts</Badge>
                  <span>This offer has no exclusivity conflicts</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <Badge variant="destructive">Conflicts Found</Badge>
                    <span>This offer has exclusivity conflicts</span>
                  </div>
                  {conflicts.conflicts && (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {conflicts.conflicts.map((conflict, idx) => (
                        <li key={idx}>{conflict}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedOffer && splits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Split Preview
              </CardTitle>
              <CardDescription>Revenue distribution for this offer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {splits.map((split) => (
                  <div key={split.party} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium capitalize">{split.party}</p>
                        {split.notes && (
                          <p className="text-sm text-muted-foreground">{split.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${split.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {(split.share * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}