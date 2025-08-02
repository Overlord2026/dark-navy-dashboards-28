import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Globe, Phone, Mail, TrendingUp, DollarSign, Target, Users } from 'lucide-react';
import { AgencyReviews } from './AgencyReviews';
import { AgencyPerformanceCharts } from './AgencyPerformanceCharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AgencyProfileData {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  contact_email: string;
  contact_phone?: string;
  specializations: string[];
  is_featured: boolean;
  average_rating: number;
  total_reviews: number;
  performance_metrics: {
    total_campaigns: number;
    total_leads: number;
    total_appointments: number;
    total_closed_clients: number;
    total_ad_spend: number;
    average_cpl: number;
    conversion_rate: number;
    close_rate: number;
  };
}

interface AgencyProfileProps {
  agencyId: string;
  onBookCampaign: (agencyId: string) => void;
  onBack: () => void;
}

export const AgencyProfile: React.FC<AgencyProfileProps> = ({
  agencyId,
  onBookCampaign,
  onBack
}) => {
  const [agency, setAgency] = useState<AgencyProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgencyProfile();
  }, [agencyId]);

  const fetchAgencyProfile = async () => {
    try {
      setLoading(true);

      // Fetch agency with reviews and performance metrics
      const { data: agencyData, error: agencyError } = await supabase
        .from('marketing_agencies')
        .select(`
          *,
          agency_reviews(rating, review_text, created_at),
          agency_performance_metrics(*)
        `)
        .eq('id', agencyId)
        .eq('status', 'approved')
        .single();

      if (agencyError) throw agencyError;

      // Calculate metrics
      const reviews = agencyData.agency_reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
        : 0;

      // Aggregate performance metrics
      const metrics = agencyData.agency_performance_metrics || [];
      const aggregatedMetrics = metrics.reduce((acc, metric) => ({
        total_campaigns: acc.total_campaigns + metric.total_campaigns,
        total_leads: acc.total_leads + metric.total_leads,
        total_appointments: acc.total_appointments + metric.total_appointments,
        total_closed_clients: acc.total_closed_clients + metric.total_closed_clients,
        total_ad_spend: acc.total_ad_spend + metric.total_ad_spend,
        average_cpl: metric.average_cpl || acc.average_cpl,
        conversion_rate: metric.conversion_rate || acc.conversion_rate,
        close_rate: metric.close_rate || acc.close_rate,
      }), {
        total_campaigns: 0,
        total_leads: 0,
        total_appointments: 0,
        total_closed_clients: 0,
        total_ad_spend: 0,
        average_cpl: 0,
        conversion_rate: 0,
        close_rate: 0,
      });

      setAgency({
        id: agencyData.id,
        name: agencyData.name,
        logo_url: agencyData.logo_url,
        description: agencyData.description,
        website_url: agencyData.website_url,
        contact_email: agencyData.contact_email,
        contact_phone: agencyData.contact_phone,
        specializations: agencyData.specializations || [],
        is_featured: agencyData.is_featured,
        average_rating: avgRating,
        total_reviews: reviews.length,
        performance_metrics: aggregatedMetrics
      });

    } catch (error) {
      console.error('Error fetching agency profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load agency profile."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Agency not found.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Agency Profile</h1>
      </div>

      {/* Agency Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Logo and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gold-light/20 to-gold-primary/20 flex items-center justify-center border border-gold-light/30">
                {agency.logo_url ? (
                  <img src={agency.logo_url} alt={agency.name} className="w-20 h-20 rounded-lg object-cover" />
                ) : (
                  <span className="text-gold-primary font-bold text-2xl">
                    {agency.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{agency.name}</h2>
                  {agency.is_featured && (
                    <Badge className="bg-gold-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-primary text-gold-primary" />
                    <span className="font-medium">{agency.average_rating.toFixed(1)}</span>
                    <span>({agency.total_reviews} reviews)</span>
                  </div>
                  
                  {agency.contact_phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{agency.contact_phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{agency.contact_email}</span>
                  </div>
                  
                  {agency.website_url && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={agency.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {agency.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {agency.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {agency.specializations.map((spec) => (
                  <Badge key={spec} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>

              <Button 
                variant="marketplace" 
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => onBookCampaign(agency.id)}
              >
                Book Campaign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{agency.performance_metrics.total_campaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{agency.performance_metrics.total_leads.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-gold-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Cost/Lead</p>
                <p className="text-2xl font-bold">${agency.performance_metrics.average_cpl.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {(agency.performance_metrics.conversion_rate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <AgencyPerformanceCharts agencyId={agency.id} />
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <AgencyReviews agencyId={agency.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};