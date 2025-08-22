import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Star,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  athleteCount: number;
  status: 'active' | 'draft' | 'completed' | 'paused';
  reach: number;
  engagement: number;
  startDate: string;
  endDate: string;
}

interface Athlete {
  id: string;
  name: string;
  handle: string;
  sport: string;
  followers: number;
  engagement: number;
  rate: number;
  availability: 'available' | 'busy' | 'exclusive';
  location: string;
  verified: boolean;
}

const BrandDashboard = () => {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  
  // Mock data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Spring Training Collection',
      budget: 50000,
      spent: 32000,
      athleteCount: 8,
      status: 'active',
      reach: 485000,
      engagement: 65000,
      startDate: '2024-01-15',
      endDate: '2024-03-15'
    },
    {
      id: '2',
      name: 'Championship Series Promo',
      budget: 25000,
      spent: 15000,
      athleteCount: 4,
      status: 'active',
      reach: 225000,
      engagement: 28000,
      startDate: '2024-02-01',
      endDate: '2024-02-28'
    },
    {
      id: '3',
      name: 'Summer Showcase',
      budget: 75000,
      spent: 0,
      athleteCount: 0,
      status: 'draft',
      reach: 0,
      engagement: 0,
      startDate: '2024-06-01',
      endDate: '2024-08-31'
    }
  ];

  const athletes: Athlete[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      handle: '@sarahj_hoops',
      sport: 'Basketball',
      followers: 125000,
      engagement: 8.5,
      rate: 2500,
      availability: 'available',
      location: 'Los Angeles, CA',
      verified: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      handle: '@mikec_football',
      sport: 'Football',
      followers: 89000,
      engagement: 6.2,
      rate: 1800,
      availability: 'busy',
      location: 'Austin, TX',
      verified: true
    },
    {
      id: '3',
      name: 'Emma Davis',
      handle: '@emmad_soccer',
      sport: 'Soccer',
      followers: 67000,
      engagement: 9.1,
      rate: 1500,
      availability: 'available',
      location: 'Miami, FL',
      verified: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
        return 'success';
      case 'draft':
      case 'busy':
        return 'warning';
      case 'paused':
      case 'exclusive':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleInviteAthlete = (athleteId: string) => {
    console.log('Inviting athlete:', athleteId);
    // Implementation for athlete invitation
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Campaign Center</h1>
          <p className="text-muted-foreground">Discover athletes and manage partnerships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Invite Athletes
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">
                  {formatNumber(campaigns.reduce((sum, c) => sum + c.reach, 0))}
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Partner Athletes</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.athleteCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaign Management</TabsTrigger>
          <TabsTrigger value="athletes">Athlete Discovery</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <Badge variant={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Budget: {formatCurrency(campaign.budget)}</span>
                          <span>Spent: {formatCurrency(campaign.spent)}</span>
                          <span>Athletes: {campaign.athleteCount}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {formatNumber(campaign.reach)} reach
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {formatNumber(campaign.engagement)} engagement
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {campaign.status === 'draft' && (
                          <Button size="sm">
                            Launch Campaign
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar for budget */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Budget Progress</span>
                        <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="athletes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Athlete Discovery
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="0-1000">$0 - $1K</SelectItem>
                      <SelectItem value="1000-5000">$1K - $5K</SelectItem>
                      <SelectItem value="5000+">$5K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {athletes.map((athlete) => (
                  <div key={athlete.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{athlete.name}</h3>
                            {athlete.verified && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                            <Badge variant={getStatusColor(athlete.availability)}>
                              {athlete.availability}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {athlete.handle} • {athlete.sport}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {athlete.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-semibold">{formatNumber(athlete.followers)}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{athlete.engagement}%</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{formatCurrency(athlete.rate)}</p>
                          <p className="text-xs text-muted-foreground">Rate/Post</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleInviteAthlete(athlete.id)}
                            disabled={athlete.availability !== 'available'}
                          >
                            Invite
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Reach Rate</span>
                      <span className="text-lg font-bold">94%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-success rounded-full h-2" style={{ width: '94%' }} />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Engagement Rate</span>
                      <span className="text-lg font-bold">7.2%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: '72%' }} />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-lg font-bold">3.1%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-warning rounded-full h-2" style={{ width: '31%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Athletes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {athletes.slice(0, 3).map((athlete, index) => (
                    <div key={athlete.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{athlete.name}</p>
                          <p className="text-xs text-muted-foreground">{athlete.sport}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{athlete.engagement}%</p>
                        <p className="text-xs text-muted-foreground">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandDashboard;