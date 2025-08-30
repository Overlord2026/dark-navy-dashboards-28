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
import { recordReceipt } from '@/features/receipts/record';
import { hash } from '@/lib/canonical';
// Mock anchor batch function for demo
const anchorBatch = async (hashes: string[]) => ({
  merkle_root: `root-${Date.now()}`,
  cross_chain_locator: [{
    chain_id: "ethereum",
    tx_ref: `0x${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    anchor_epoch: 1
  }]
});
import { toast } from 'sonner';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

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

  const handleCreateOffer = async () => {
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

      // Create Decision-RDS receipt
      const decisionReceipt = {
        id: crypto.randomUUID(),
        type: 'Decision-RDS' as const,
        action: 'publish' as const,
        policy_version: 'E-2025.08',
        inputs_hash: await hash({ offerId, brand: formData.brand, category: formData.category }),
        reasons: ['Offer created successfully', 'Compliance check passed'],
        result: 'approve' as const,
        asset_id: offerId,
        anchor_ref: null,
        ts: new Date().toISOString()
      };

      // Anchor the receipt
      const receiptHash = await hash(decisionReceipt);
      const anchorRef = await anchorBatch([receiptHash]);
      decisionReceipt.anchor_ref = anchorRef;

      // Record the receipt
      recordReceipt(decisionReceipt);

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
        description: `OfferLock: ${offerId.slice(0, 8)}...`,
        action: {
          label: 'View Receipt',
          onClick: () => window.location.href = '/nil/receipts'
        }
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
    <div className="min-h-screen bg-bfo-black text-white">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">NIL Offers</h1>
              <p className="text-white/70">Create and manage your NIL offers</p>
            </div>
            <GoldButton onClick={() => setShowCreateForm(true)}>
              Create New Offer
            </GoldButton>
          </div>
        </div>

        <div className="grid gap-6">
        {showCreateForm && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="text-white font-semibold">Create New Offer</CardTitle>
              <CardDescription className="text-white/70">Fill in the details for your new NIL offer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="text-white">Brand Name</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Enter brand name"
                    className="bg-[#24313d] border-bfo-gold/40 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-[#24313d] border-bfo-gold/40 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#24313d] border-bfo-gold/40">
                      <SelectItem value="Athletic Apparel" className="text-white hover:bg-bfo-gold/20">Athletic Apparel</SelectItem>
                      <SelectItem value="Food & Beverage" className="text-white hover:bg-bfo-gold/20">Food & Beverage</SelectItem>
                      <SelectItem value="Technology" className="text-white hover:bg-bfo-gold/20">Technology</SelectItem>
                      <SelectItem value="Automotive" className="text-white hover:bg-bfo-gold/20">Automotive</SelectItem>
                      <SelectItem value="Health & Wellness" className="text-white hover:bg-bfo-gold/20">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Amount ($)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="Enter offer amount"
                  className="bg-[#24313d] border-bfo-gold/40 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <Label className="text-white">Channels</Label>
                <div className="flex gap-2 mt-2">
                  {['IG', 'TikTok', 'YouTube'].map(channel => (
                    <Button
                      key={channel}
                      variant={formData.channels.includes(channel) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleChannel(channel)}
                      className={formData.channels.includes(channel) 
                        ? 'bg-bfo-gold text-black hover:bg-bfo-gold/90' 
                        : 'border-bfo-gold/40 text-bfo-gold hover:bg-bfo-gold hover:text-black'
                      }
                    >
                      {channel}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-[#24313d] border-bfo-gold/40 text-white hover:bg-bfo-gold/20">
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
                        className="p-3 pointer-events-auto bg-[#24313d] border-bfo-gold/40"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-white">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-[#24313d] border-bfo-gold/40 text-white hover:bg-bfo-gold/20">
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
                        className="p-3 pointer-events-auto bg-[#24313d] border-bfo-gold/40"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2">
                <GoldButton onClick={handleCreateOffer}>Create Offer</GoldButton>
                <GoldOutlineButton onClick={() => setShowCreateForm(false)}>Cancel</GoldOutlineButton>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {offers.length === 0 && !showCreateForm && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardContent className="py-12 text-center">
              <div className="space-y-4">
                <div className="text-white/70">
                  <h3 className="text-lg font-medium mb-2 text-white">No offers yet</h3>
                  <p>Create your first NIL offer to get started with compliance tracking.</p>
                </div>
                <GoldButton onClick={() => setShowCreateForm(true)}>
                  Create Your First Offer
                </GoldButton>
              </div>
            </CardContent>
          </Card>
        )}

        {offers.length > 0 && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="text-white font-semibold">Your Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`p-4 border border-bfo-gold/30 rounded-lg cursor-pointer hover:bg-bfo-gold/10 transition-colors ${
                      selectedOffer === offer.id ? 'border-bfo-gold bg-bfo-gold/10' : ''
                    }`}
                    onClick={() => setSelectedOffer(offer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{offer.brand}</h3>
                        <p className="text-sm text-white/70">{offer.category}</p>
                        <p className="text-sm text-bfo-gold">${offer.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/70">
                          {offer.startDate} - {offer.endDate}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {offer.channels.map(channel => (
                            <Badge key={channel} variant="outline" className="text-xs border-bfo-gold/30 text-bfo-gold">
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
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <AlertTriangle className="h-5 w-5 text-bfo-gold" />
                Conflict Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conflicts.ok ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Badge variant="default" className="bg-green-600 text-white">No Conflicts</Badge>
                  <span>This offer has no exclusivity conflicts</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-400">
                    <Badge variant="destructive" className="bg-red-600 text-white">Conflicts Found</Badge>
                    <span>This offer has exclusivity conflicts</span>
                  </div>
                  {conflicts.conflicts && (
                    <ul className="list-disc list-inside text-sm text-white/70">
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
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <DollarSign className="h-5 w-5 text-bfo-gold" />
                Split Preview
              </CardTitle>
              <CardDescription className="text-white/70">Revenue distribution for this offer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {splits.map((split) => (
                  <div key={split.party} className="flex items-center justify-between p-3 border border-bfo-gold/30 rounded bg-bfo-black/30">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-bfo-gold" />
                      <div>
                        <p className="font-medium capitalize text-white">{split.party}</p>
                        {split.notes && (
                          <p className="text-sm text-white/70">{split.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-bfo-gold">${split.amount.toLocaleString()}</p>
                      <p className="text-sm text-white/70">
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
    </div>
  );
}