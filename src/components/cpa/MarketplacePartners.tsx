import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  UserPlus, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award,
  DollarSign,
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  Building,
  GraduationCap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MarketplacePartner {
  id: string;
  partner_type: string;
  partner_name: string;
  partner_email: string;
  partner_phone?: string;
  firm_name: string;
  specialties: string[];
  bio?: string;
  website_url?: string;
  logo_url?: string;
  location?: any;
  fee_structure?: string;
  credentials: string[];
  years_experience?: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  referral_fee_percent: number;
}

const partnerTypes = {
  tax_pro: { label: 'Tax Professional', icon: DollarSign, color: 'bg-green-500' },
  financial_planner: { label: 'Financial Planner', icon: TrendingUp, color: 'bg-blue-500' },
  estate_attorney: { label: 'Estate Attorney', icon: Shield, color: 'bg-purple-500' },
  insurance_agent: { label: 'Insurance Agent', icon: Users, color: 'bg-orange-500' },
  business_attorney: { label: 'Business Attorney', icon: Building, color: 'bg-gray-500' },
  wealth_manager: { label: 'Wealth Manager', icon: GraduationCap, color: 'bg-indigo-500' },
};

export function MarketplacePartners() {
  const [partners, setPartners] = useState<MarketplacePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPartner, setNewPartner] = useState({
    partner_type: '',
    partner_name: '',
    partner_email: '',
    partner_phone: '',
    firm_name: '',
    specialties: '',
    bio: '',
    website_url: '',
    fee_structure: '',
    credentials: '',
    years_experience: '',
    referral_fee_percent: ''
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_partners')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async () => {
    try {
      // Get current CPA partner
      const { data: cpaPartner } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!cpaPartner) {
        toast.error('CPA partner profile not found');
        return;
      }

      const partnerData = {
        cpa_partner_id: cpaPartner.id,
        partner_type: newPartner.partner_type,
        partner_name: newPartner.partner_name,
        partner_email: newPartner.partner_email,
        partner_phone: newPartner.partner_phone || null,
        firm_name: newPartner.firm_name,
        specialties: newPartner.specialties.split(',').map(s => s.trim()),
        bio: newPartner.bio || null,
        website_url: newPartner.website_url || null,
        fee_structure: newPartner.fee_structure || null,
        credentials: newPartner.credentials.split(',').map(s => s.trim()),
        years_experience: newPartner.years_experience ? parseInt(newPartner.years_experience) : null,
        referral_fee_percent: newPartner.referral_fee_percent ? parseFloat(newPartner.referral_fee_percent) : 0,
        is_verified: false // Needs verification
      };

      const { error } = await supabase
        .from('marketplace_partners')
        .insert(partnerData);

      if (error) throw error;

      toast.success('Partner added successfully - pending verification');
      setShowAddDialog(false);
      setNewPartner({
        partner_type: '',
        partner_name: '',
        partner_email: '',
        partner_phone: '',
        firm_name: '',
        specialties: '',
        bio: '',
        website_url: '',
        fee_structure: '',
        credentials: '',
        years_experience: '',
        referral_fee_percent: ''
      });
      fetchPartners();
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error('Failed to add partner');
    }
  };

  const filteredPartners = partners.filter(partner => 
    selectedType === 'all' || partner.partner_type === selectedType
  );

  const PartnerCard = ({ partner }: { partner: MarketplacePartner }) => {
    const typeConfig = partnerTypes[partner.partner_type as keyof typeof partnerTypes];
    const IconComponent = typeConfig?.icon || Users;

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${typeConfig?.color || 'bg-gray-500'}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{partner.partner_name}</CardTitle>
                <CardDescription>{partner.firm_name}</CardDescription>
              </div>
            </div>
            {partner.is_verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Award className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(partner.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {partner.rating.toFixed(1)} ({partner.review_count} reviews)
            </span>
          </div>

          {partner.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {partner.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {partner.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{partner.specialties.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {partner.bio && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {partner.bio}
            </p>
          )}

          <div className="space-y-2 text-sm">
            {partner.years_experience && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{partner.years_experience} years experience</span>
              </div>
            )}
            
            {partner.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{partner.location.city}, {partner.location.state}</span>
              </div>
            )}

            {partner.fee_structure && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{partner.fee_structure}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              Contact
            </Button>
            <Button size="sm" className="flex-1">
              <UserPlus className="h-4 w-4 mr-1" />
              Refer Client
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CPA Marketplace</h2>
          <p className="text-muted-foreground">
            Trusted partners to expand your service offerings
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
              <DialogDescription>
                Add a trusted professional to your referral network
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner_type">Partner Type</Label>
                <Select value={newPartner.partner_type} onValueChange={(value) => 
                  setNewPartner(prev => ({ ...prev, partner_type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(partnerTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_name">Partner Name</Label>
                <Input
                  value={newPartner.partner_name}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, partner_name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_email">Email</Label>
                <Input
                  type="email"
                  value={newPartner.partner_email}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, partner_email: e.target.value }))}
                  placeholder="john@smithlaw.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_phone">Phone (Optional)</Label>
                <Input
                  value={newPartner.partner_phone}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, partner_phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firm_name">Firm Name</Label>
                <Input
                  value={newPartner.firm_name}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, firm_name: e.target.value }))}
                  placeholder="Smith Law Firm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years Experience</Label>
                <Input
                  type="number"
                  value={newPartner.years_experience}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, years_experience: e.target.value }))}
                  placeholder="10"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input
                  value={newPartner.specialties}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, specialties: e.target.value }))}
                  placeholder="Estate Planning, Tax Law, Business Formation"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="credentials">Credentials (comma-separated)</Label>
                <Input
                  value={newPartner.credentials}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, credentials: e.target.value }))}
                  placeholder="JD, CPA, CFP"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  value={newPartner.bio}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Brief description of expertise and background..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPartner}>
                Add Partner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All Partners</TabsTrigger>
          {Object.entries(partnerTypes).map(([key, config]) => (
            <TabsTrigger key={key} value={key}>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Partners Found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedType === 'all' 
                  ? 'No partners have been added yet.'
                  : `No ${partnerTypes[selectedType as keyof typeof partnerTypes]?.label.toLowerCase()}s found.`
                }
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Partner
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}