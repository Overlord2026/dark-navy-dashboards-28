import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

export const NILBrand: React.FC = () => {
  const { toast } = useToast();
  const activeCampaigns = 8;
  const totalSpend = 125000;
  const athletePartners = 24;

  const handleViewCampaigns = () => {
    trackEvent('campaigns.opened', { context: 'nil_brand' });
    toast.success('Campaign Dashboard opened');
  };

  const handleFindAthletes = () => {
    trackEvent('athletes.search', { context: 'nil_brand' });
    toast.success('Athlete Marketplace opened');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">NIL for Brands & Agencies</h1>
          <p className="text-xl text-muted-foreground">
            Connect with student-athletes for authentic partnerships
          </p>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{activeCampaigns}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">${(totalSpend / 1000).toFixed(0)}K</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Athlete Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{athletePartners}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Campaign Management
              </CardTitle>
              <CardDescription>
                Create and manage NIL marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance</span>
                  <Badge variant="default">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% ROI
                  </Badge>
                </div>
                <Button onClick={handleViewCampaigns} className="w-full">
                  View Campaign Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Athlete Marketplace
              </CardTitle>
              <CardDescription>
                Discover and connect with student-athletes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Available Athletes</span>
                  <Badge variant="outline">2,400+ Active</Badge>
                </div>
                <Button onClick={handleFindAthletes} className="w-full">
                  Find Athletes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NILBrand;