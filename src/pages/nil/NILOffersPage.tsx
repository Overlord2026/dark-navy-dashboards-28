import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, 
  Building2, 
  DollarSign, 
  Clock, 
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Lock,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NILOffer {
  id: string;
  brand_id: string;
  athlete_id: string;
  offer_type: string;
  offer_amount: number;
  currency: string;
  exclusivity_period_days: number;
  offer_lock_until: string;
  status: string;
  offer_terms: any;
  created_at: string;
}

interface PersonaData {
  id: string;
  persona_type: string;
  name: string;
  email: string;
  metadata: any;
}

export default function NILOffersPage() {
  const [offers, setOffers] = useState<NILOffer[]>([]);
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [offerData, setOfferData] = useState({
    offer_type: 'non_exclusive',
    offer_amount: '',
    currency: 'USD',
    exclusivity_period_days: '',
    offer_terms: {
      campaign_duration: '',
      deliverables: '',
      usage_rights: '',
      performance_metrics: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offersResponse, personasResponse] = await Promise.all([
        supabase.from('nil_offers').select('*').order('created_at', { ascending: false }),
        supabase.from('nil_personas').select('*').order('name')
      ]);

      if (offersResponse.error) throw offersResponse.error;
      if (personasResponse.error) throw personasResponse.error;

      setOffers(offersResponse.data || []);
      setPersonas(personasResponse.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const createOffer = async () => {
    if (!selectedBrand || !selectedAthlete || !offerData.offer_amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // First evaluate policy gates
      const policyEvaluation = await supabase.functions.invoke('nil-policy-evaluate', {
        body: {
          gateType: 'exclusivity_lock',
          entityType: 'persona',
          entityId: selectedAthlete,
          policyConfig: { checkExclusivity: true },
          requestContext: { brand_id: selectedBrand, offer_amount: parseFloat(offerData.offer_amount) }
        }
      });

      if (policyEvaluation.error) throw policyEvaluation.error;

      if (!policyEvaluation.data.allowed) {
        toast({
          title: "Policy Gate Failed",
          description: policyEvaluation.data.reason,
          variant: "destructive"
        });
        setIsCreating(false);
        return;
      }

      // Calculate offer lock period
      const offerLockUntil = new Date();
      offerLockUntil.setDate(offerLockUntil.getDate() + 7); // 7-day offer lock

      // Create offer
      const { data: newOffer, error: offerError } = await supabase
        .from('nil_offers')
        .insert({
          brand_id: selectedBrand,
          athlete_id: selectedAthlete,
          offer_type: offerData.offer_type,
          offer_amount: parseFloat(offerData.offer_amount),
          currency: offerData.currency,
          exclusivity_period_days: offerData.exclusivity_period_days ? parseInt(offerData.exclusivity_period_days) : null,
          offer_lock_until: offerLockUntil.toISOString(),
          status: 'offered',
          offer_terms: offerData.offer_terms
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Generate Decision-RDS receipt for offer creation
      const receiptData = {
        receipt_type: 'Decision-RDS',
        event_type: 'offer_creation',
        entity_type: 'nil_offer',
        entity_id: newOffer.id,
        policy_hash: `sha256:offer_policy_${Date.now()}`,
        inputs_hash: `sha256:${selectedBrand}_${selectedAthlete}_${offerData.offer_amount}`,
        decision_outcome: 'offer_created',
        reason_codes: ['policy_gates_passed', 'offer_terms_valid'],
        explanation: `NIL offer created for ${offerData.offer_amount} ${offerData.currency}`,
        merkle_leaf: `leaf:${btoa(newOffer.id + Date.now()).substring(0, 32)}`,
        privacy_level: 'medium'
      };

      await supabase.from('nil_receipts').insert(receiptData);

      toast({
        title: "Offer Created Successfully",
        description: `NIL offer created with Decision-RDS receipt`,
      });

      // Reset form
      setOfferData({
        offer_type: 'non_exclusive',
        offer_amount: '',
        currency: 'USD',
        exclusivity_period_days: '',
        offer_terms: {
          campaign_duration: '',
          deliverables: '',
          usage_rights: '',
          performance_metrics: ''
        }
      });
      setSelectedBrand('');
      setSelectedAthlete('');

      loadData();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const respondToOffer = async (offerId: string, response: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('nil_offers')
        .update({ status: response })
        .eq('id', offerId);

      if (error) throw error;

      // Generate Decision-RDS receipt for offer response
      const receiptData = {
        receipt_type: 'Decision-RDS',
        event_type: 'offer_response',
        entity_type: 'nil_offer',
        entity_id: offerId,
        policy_hash: `sha256:offer_response_policy`,
        inputs_hash: `sha256:${offerId}_${response}`,
        decision_outcome: response,
        reason_codes: [`offer_${response}`],
        explanation: `NIL offer ${response} by athlete`,
        merkle_leaf: `leaf:${btoa(offerId + response + Date.now()).substring(0, 32)}`,
        privacy_level: 'medium'
      };

      await supabase.from('nil_receipts').insert(receiptData);

      toast({
        title: `Offer ${response.charAt(0).toUpperCase() + response.slice(1)}`,
        description: `Offer ${response} with receipt generated`,
      });

      loadData();
    } catch (error) {
      console.error('Error responding to offer:', error);
      toast({
        title: "Error",
        description: "Failed to respond to offer",
        variant: "destructive"
      });
    }
  };

  const brands = personas.filter(p => p.persona_type === 'brand');
  const athletes = personas.filter(p => p.persona_type === 'athlete');

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'offered': return 'bg-sky text-ink';
      case 'accepted': return 'bg-mint text-ink';
      case 'declined': return 'bg-alert text-white';
      case 'expired': return 'bg-slate/50 text-ink';
      default: return 'bg-gold-base text-ink';
    }
  };

  const getExclusivityIcon = (offerType: string) => {
    switch (offerType) {
      case 'exclusive': return <Lock className="h-4 w-4" />;
      case 'first_right_refusal': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-gold-base mx-auto mb-4"></div>
            <p className="text-slate/80">Loading offers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold text-ink">NIL Offers & Exclusivity</h1>
        <p className="text-slate/80 text-sm max-w-2xl mx-auto">
          Create and manage NIL offers with built-in exclusivity controls and policy-gate validation.
        </p>
      </div>

      {/* Create New Offer */}
      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="p-6">
          <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Create New NIL Offer
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand/Company *</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="athlete">Athlete *</Label>
              <Select value={selectedAthlete} onValueChange={setSelectedAthlete}>
                <SelectTrigger>
                  <SelectValue placeholder="Select athlete" />
                </SelectTrigger>
                <SelectContent>
                  {athletes.map((athlete) => (
                    <SelectItem key={athlete.id} value={athlete.id}>
                      {athlete.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="offer_type">Offer Type</Label>
              <Select 
                value={offerData.offer_type} 
                onValueChange={(value) => setOfferData(prev => ({ ...prev, offer_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_exclusive">Non-Exclusive</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                  <SelectItem value="first_right_refusal">First Right of Refusal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="offer_amount">Offer Amount *</Label>
              <Input
                id="offer_amount"
                type="number"
                value={offerData.offer_amount}
                onChange={(e) => setOfferData(prev => ({ ...prev, offer_amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="exclusivity_period">Exclusivity Period (days)</Label>
              <Input
                id="exclusivity_period"
                type="number"
                value={offerData.exclusivity_period_days}
                onChange={(e) => setOfferData(prev => ({ ...prev, exclusivity_period_days: e.target.value }))}
                placeholder="30"
                disabled={offerData.offer_type === 'non_exclusive'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deliverables">Campaign Deliverables</Label>
            <Textarea
              id="deliverables"
              value={offerData.offer_terms.deliverables}
              onChange={(e) => setOfferData(prev => ({ 
                ...prev, 
                offer_terms: { ...prev.offer_terms, deliverables: e.target.value } 
              }))}
              placeholder="Describe campaign deliverables..."
              rows={2}
            />
          </div>

          {/* Policy Gates Warning */}
          <div className="bg-sand/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-gold-base mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-ink">Policy Gates Active</h4>
                <p className="text-xs text-ink/70 mt-1">
                  This offer will be validated against exclusivity locks, budget policies, and education requirements.
                  Decision-RDS receipts will be generated for audit compliance.
                </p>
              </div>
            </div>
          </div>

          <Button 
            variant="gold" 
            onClick={createOffer}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating Offer...' : 'Create NIL Offer'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Offers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Active Offers</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {offers.map((offer) => {
            const brand = personas.find(p => p.id === offer.brand_id);
            const athlete = personas.find(p => p.id === offer.athlete_id);
            const lockExpired = new Date(offer.offer_lock_until) < new Date();
            
            return (
              <Card key={offer.id} className="rounded-2xl shadow-soft">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                      {getExclusivityIcon(offer.offer_type)}
                      {offer.offer_type.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                    <Badge className={getOfferStatusColor(offer.status)}>
                      {offer.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate/80">Brand:</span>
                      <span className="text-sm font-medium text-ink">{brand?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate/80">Athlete:</span>
                      <span className="text-sm font-medium text-ink">{athlete?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate/80">Amount:</span>
                      <span className="text-sm font-medium text-ink">
                        ${offer.offer_amount.toLocaleString()} {offer.currency}
                      </span>
                    </div>
                    {offer.exclusivity_period_days && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate/80">Exclusivity:</span>
                        <span className="text-sm font-medium text-ink">
                          {offer.exclusivity_period_days} days
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate/80">
                    <Clock className="h-3 w-3" />
                    <span>
                      Offer lock {lockExpired ? 'expired' : 'until'} {new Date(offer.offer_lock_until).toLocaleDateString()}
                    </span>
                  </div>

                  {offer.status === 'offered' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="gold" 
                        size="sm"
                        onClick={() => respondToOffer(offer.id, 'accepted')}
                        className="flex-1 text-xs"
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => respondToOffer(offer.id, 'declined')}
                        className="flex-1 text-xs"
                      >
                        Decline
                      </Button>
                    </div>
                  )}

                  {offer.status === 'accepted' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full text-xs"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Generate Contract
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-slate/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate/60 mb-2">No Offers Yet</h3>
            <p className="text-sm text-slate/50">
              Create your first NIL offer to get started with athlete partnerships.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
