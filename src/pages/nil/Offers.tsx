import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertTriangle, DollarSign, Users, ShieldCheck, TrendingUp, TrendingDown, GitBranch } from 'lucide-react';
import { format } from 'date-fns';
import { createOffer, checkConflicts, getOffers, NILOffer } from '@/features/nil/offers/store';
import type { SettlementRDS, DeltaRDS } from '@/features/receipts/types';
import { previewSplit, calculateSplitAmounts } from '@/features/nil/splits/preview';
import { recordReceipt } from '@/features/receipts/record';
import * as Canonical from '@/lib/canonical';
import { toast } from 'sonner';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import NilReceiptsStrip from '@/components/nil/NilReceiptsStrip';
import { GuardianCosignModal } from '@/components/nil/GuardianCosignModal';

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

export default function OffersPage() {
  const [offers, setOffers] = React.useState<NILOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<string | null>(null);
  const [conflicts, setConflicts] = React.useState<{ ok: boolean; conflicts?: string[] } | null>(null);
  const [splits, setSplits] = React.useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showCosignModal, setShowCosignModal] = React.useState(false);
  const [selectedOfferForCosign, setSelectedOfferForCosign] = React.useState<NILOffer | null>(null);
  const [escrowStates, setEscrowStates] = React.useState<Record<string, string>>({});
  const [lastSettlementIds, setLastSettlementIds] = React.useState<Record<string, string>>({});
  
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
        inputs_hash: await Canonical.hash({ offerId, brand: formData.brand, category: formData.category }),
        reasons: ['Offer created successfully', 'Compliance check passed'],
        result: 'approve' as const,
        asset_id: offerId,
        anchor_ref: null,
        ts: new Date().toISOString()
      };

      // Anchor the receipt
      const receiptHash = await Canonical.hash(decisionReceipt);
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

  const handleRequestCosign = (offer: NILOffer) => {
    setSelectedOfferForCosign(offer);
    setShowCosignModal(true);
  };

  const handleCosignSuccess = () => {
    setShowCosignModal(false);
    setSelectedOfferForCosign(null);
    toast.success('Co-sign completed', {
      description: 'Guardian approval received for offer'
    });
  };

  const handleEscrowAction = async (offerId: string, action: 'hold' | 'release' | 'dispute') => {
    try {
      const offer = offers.find(o => o.id === offerId);
      if (!offer) return;

      if (action === 'dispute') {
        // Create Delta-RDS for dispute
        const priorRef = lastSettlementIds[offerId];
        if (!priorRef) {
          toast.error('No prior settlement to dispute');
          return;
        }

        const deltaReceipt: DeltaRDS = {
          id: `delta_${Date.now()}`,
          type: 'Delta-RDS',
          inputs_hash: await Canonical.hash({ offerId, action, prior: priorRef }),
          policy_version: 'NIL-2025.01',
          prior_ref: priorRef,
          diffs: [{
            field: 'escrow_state',
            from: escrowStates[offerId] || 'released',
            to: 'disputed'
          }],
          reasons: ['DISPUTE_INITIATED', 'ESCROW_CONTESTED'],
          ts: new Date().toISOString(),
          anchor_ref: await anchorBatch([await Canonical.hash({ offerId, action })]).catch(() => null)
        };

        recordReceipt(deltaReceipt);
        setEscrowStates(prev => ({ ...prev, [offerId]: 'disputed' }));
        
        toast.success('Dispute initiated', {
          description: `Delta-RDS receipt generated for offer ${offer.brand}`,
          action: {
            label: 'View Receipt',
            onClick: () => window.location.href = '/nil/receipts'
          }
        });
      } else {
        // Create Settlement-RDS for hold/release
        const settlementReceipt: SettlementRDS = {
          id: `settlement_${Date.now()}`,
          type: 'Settlement-RDS',
          inputs_hash: await Canonical.hash({ offerId, action }),
          policy_version: 'NIL-2025.01',
          escrow_state: action === 'hold' ? 'held' : 'released',
          offerLock: offer.offerLock || offerId,
          attribution_hash: await Canonical.hash({ brand: offer.brand, category: offer.category }),
          split_tree_hash: await Canonical.hash({ amount: offer.amount, channels: offer.channels }),
          ts: new Date().toISOString(),
          anchor_ref: await anchorBatch([await Canonical.hash({ offerId, action })]).catch(() => null)
        };

        recordReceipt(settlementReceipt);
        setEscrowStates(prev => ({ ...prev, [offerId]: action === 'hold' ? 'held' : 'released' }));
        setLastSettlementIds(prev => ({ ...prev, [offerId]: settlementReceipt.id! }));
        
        toast.success(`Escrow ${action}${action === 'hold' ? '' : 'd'}`, {
          description: `Settlement-RDS receipt generated for offer ${offer.brand}`,
          action: {
            label: 'View Receipt',
            onClick: () => window.location.href = '/nil/receipts'
          }
        });
      }
    } catch (error) {
      console.error('Failed to process escrow action:', error);
      toast.error(`Failed to ${action} escrow`);
    }
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
              <div className="flex gap-2">
                <GoldOutlineButton 
                  onClick={() => handleRequestCosign(offers[0])}
                  disabled={offers.length === 0}
                  className="flex items-center gap-1"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Request Co-Sign
                </GoldOutlineButton>
                <GoldButton onClick={() => setShowCreateForm(true)}>
                  Create New Offer
                </GoldButton>
              </div>
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
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-white/70">
                            {offer.startDate} - {offer.endDate}
                          </p>
                          {escrowStates[offer.id] && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                escrowStates[offer.id] === 'held' ? 'border-yellow-500/40 text-yellow-400' :
                                escrowStates[offer.id] === 'released' ? 'border-green-500/40 text-green-400' :
                                'border-red-500/40 text-red-400'
                              }`}
                            >
                              {escrowStates[offer.id] === 'disputed' && <GitBranch className="h-3 w-3 mr-1" />}
                              {escrowStates[offer.id]}
                            </Badge>
                          )}
                        </div>
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

        {selectedOffer && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <TrendingUp className="h-5 w-5 text-bfo-gold" />
                Simulate Escrow
              </CardTitle>
              <CardDescription className="text-white/70">
                Demo escrow lifecycle (Settlement-RDS → Delta-RDS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-bfo-black/30 rounded-lg border border-bfo-gold/20">
                  <div>
                    <p className="font-medium text-white">Current State</p>
                    <p className="text-sm text-white/70">
                      {escrowStates[selectedOffer] || 'No escrow actions yet'}
                    </p>
                  </div>
                  {escrowStates[selectedOffer] && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        escrowStates[selectedOffer] === 'held' ? 'border-yellow-500/40 text-yellow-400' :
                        escrowStates[selectedOffer] === 'released' ? 'border-green-500/40 text-green-400' :
                        'border-red-500/40 text-red-400'
                      }`}
                    >
                      {escrowStates[selectedOffer] === 'disputed' && <GitBranch className="h-3 w-3 mr-1" />}
                      {escrowStates[selectedOffer]}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <GoldOutlineButton 
                    onClick={() => handleEscrowAction(selectedOffer, 'hold')}
                    className="flex items-center gap-1"
                    disabled={escrowStates[selectedOffer] === 'held'}
                  >
                    <TrendingDown className="h-4 w-4" />
                    Hold
                  </GoldOutlineButton>
                  
                  <GoldOutlineButton 
                    onClick={() => handleEscrowAction(selectedOffer, 'release')}
                    className="flex items-center gap-1"
                    disabled={!escrowStates[selectedOffer] || escrowStates[selectedOffer] === 'released'}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Release
                  </GoldOutlineButton>
                  
                  <GoldOutlineButton 
                    onClick={() => handleEscrowAction(selectedOffer, 'dispute')}
                    className="flex items-center gap-1 border-red-500/40 text-red-400 hover:bg-red-500/10"
                    disabled={!lastSettlementIds[selectedOffer] || escrowStates[selectedOffer] === 'disputed'}
                  >
                    <GitBranch className="h-4 w-4" />
                    Dispute
                  </GoldOutlineButton>
                </div>

                <div className="text-xs text-white/50 bg-bfo-black/30 p-3 rounded-lg">
                  <p className="font-medium mb-1">Demo Flow:</p>
                  <p>1. Hold → Settlement-RDS (escrow_state: 'held')</p>
                  <p>2. Release → Settlement-RDS (escrow_state: 'released')</p>
                  <p>3. Dispute → Delta-RDS (prior_ref + diffs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
      <NilReceiptsStrip />
      
      <GuardianCosignModal
        isOpen={showCosignModal}
        onClose={() => setShowCosignModal(false)}
        context="offer"
        contextData={{ 
          offerId: selectedOfferForCosign?.id, 
          brand: selectedOfferForCosign?.brand,
          amount: selectedOfferForCosign?.amount 
        }}
        onSuccess={handleCosignSuccess}
      />
    </div>
  );
}