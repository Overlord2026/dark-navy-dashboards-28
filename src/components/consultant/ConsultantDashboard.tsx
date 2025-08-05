import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  Star,
  Video,
  Upload,
  Mail,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  MessageSquare,
  Globe,
  Building2,
  UserPlus,
  BarChart3,
  Presentation,
  Award,
  Eye,
  Play
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const ConsultantDashboard = () => {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Impact Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.displayName}! Drive results across the BFO ecosystem.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            <Shield className="w-3 h-3 mr-1" />
            BFO Certified Consultant
          </Badge>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Partner
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Partnerships</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">+18% this month</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programs Delivered</p>
                <p className="text-2xl font-bold">67</p>
                <p className="text-xs text-blue-600">This quarter</p>
              </div>
              <Presentation className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-yellow-600">From 156 reviews</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Impact</p>
                <p className="text-2xl font-bold">$47K</p>
                <p className="text-xs text-green-600">Q4 earnings</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Video className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Practice Management Workshop</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM • 12 advisors</p>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">1:1 Coaching - Sarah M.</p>
                    <p className="text-xs text-muted-foreground">Friday, 10:00 AM • 60 minutes</p>
                  </div>
                  <Button size="sm" variant="outline">Prepare</Button>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">BFO Roundtable</p>
                    <p className="text-xs text-muted-foreground">Next week • Consultant networking</p>
                  </div>
                  <Button size="sm" variant="outline">RSVP</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Recent Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-sm font-medium">Michael R. - RIA Principal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Transformed our client onboarding process. ROI was immediate."
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-sm font-medium">Jennifer L. - Team Lead</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Best sales training we've invested in. Highly recommend."
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Program Library</h3>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </Button>
              <Button>
                <Presentation className="w-4 h-4 mr-2" />
                Create Program
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Practice Management Mastery', type: 'Workshop Series', views: 245, rating: 4.8 },
              { title: 'Sales Process Optimization', type: '1:1 Coaching', views: 89, rating: 4.9 },
              { title: 'Leadership Development', type: 'Group Training', views: 167, rating: 4.7 }
            ].map((program, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{program.type}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{program.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{program.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {program.views} advisor views
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Present
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Partnerships</h3>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite New Partner
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Partners (24)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Thompson Wealth Management', contact: 'Sarah Thompson', relationship: 'Practice Management', status: 'Active' },
                  { name: 'Pinnacle Financial Group', contact: 'Michael Chen', relationship: 'Sales Training', status: 'Active' },
                  { name: 'Heritage Advisory', contact: 'David Miller', relationship: 'Leadership Coaching', status: 'Paused' }
                ].map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">{partner.contact} • {partner.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={partner.status === 'Active' ? 'default' : 'secondary'}>
                        {partner.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="text-center p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
            <Globe className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">BFO Marketplace</h3>
            <p className="text-muted-foreground mb-6">
              Expand your reach through our vetted network of financial professionals.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">5,200+ Advisors</h4>
                <p className="text-xs text-muted-foreground">Active in the marketplace</p>
              </Card>
              
              <Card className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Program Discovery</h4>
                <p className="text-xs text-muted-foreground">Easy search and booking</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Quality Assurance</h4>
                <p className="text-xs text-muted-foreground">Vetted professionals only</p>
              </Card>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button>
                <Presentation className="w-4 h-4 mr-2" />
                List New Program
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Join Roundtable
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Engagement Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Program Completion Rate</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client Satisfaction</span>
                    <span className="text-sm font-medium">4.8/5.0</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Repeat Bookings</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Revenue Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Monthly Target</span>
                  </div>
                  <p className="text-lg font-bold text-green-900">$15,200 / $12,000</p>
                  <p className="text-xs text-green-600">127% of goal achieved</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-lg font-bold">$8,400</p>
                    <p className="text-xs text-muted-foreground">Group Programs</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-lg font-bold">$6,800</p>
                    <p className="text-xs text-muted-foreground">1:1 Coaching</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};