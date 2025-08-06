import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building,
  Users,
  Home,
  Shield,
  Wallet,
  BarChart3,
  Upload,
  Award,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  CheckCircle,
  UserPlus,
  Mail,
  Phone,
  Globe,
  Star,
  Clock
} from 'lucide-react';

interface RealEstateProfile {
  brokerageName: string;
  licenseNumber: string;
  states: string[];
  specialties: string[];
  serviceAreas: string[];
  bio: string;
  website: string;
  email: string;
  phone: string;
  yearsExperience: number;
  teamSize: number;
}

export const RealEstateVIPLaunchKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<RealEstateProfile>({
    brokerageName: '',
    licenseNumber: '',
    states: [],
    specialties: [],
    serviceAreas: [],
    bio: '',
    website: '',
    email: '',
    phone: '',
    yearsExperience: 0,
    teamSize: 0
  });

  const realEstateSpecialties = [
    'Luxury Properties',
    'Commercial Real Estate',
    'Residential Sales',
    'Property Management',
    'Investment Properties',
    'First-Time Buyers',
    'Relocation Services',
    'New Construction',
    'Foreclosures & REO',
    'Land & Development',
    'Vacation Homes',
    'Senior Housing',
    'Multi-Family Properties',
    'International Clients'
  ];

  const agentRoles = [
    'Licensed Real Estate Agent',
    'Property Manager',
    'Listing Coordinator', 
    'Transaction Coordinator',
    'Marketing Specialist',
    'Client Relations Manager',
    'Administrative Assistant',
    'Team Lead',
    'Broker Associate',
    'Office Manager'
  ];

  const toggleSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const sendRealEstateInvitation = async () => {
    // Implementation for sending real estate invitations
    console.log('Sending real estate invitation...');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Building className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Real Estate VIP Launch Kit</h1>
          <p className="text-muted-foreground">
            Complete practice management system for real estate professionals
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Brokerage Setup
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Management
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Property Management
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Referrals & Rewards
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Brokerage Profile Setup Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Brokerage Profile & Specialties
              </CardTitle>
              <CardDescription>
                Set up your brokerage profile for the VIP real estate marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brokerage">Brokerage Name *</Label>
                    <Input
                      id="brokerage"
                      value={profile.brokerageName}
                      onChange={(e) => setProfile(prev => ({ ...prev, brokerageName: e.target.value }))}
                      placeholder="Elite Realty Group"
                    />
                  </div>
                  <div>
                    <Label htmlFor="license">License Number *</Label>
                    <Input
                      id="license"
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="01234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profile.yearsExperience}
                      onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                      placeholder="15"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={profile.teamSize}
                      onChange={(e) => setProfile(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 0 }))}
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://eliterealty.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Brokerage Description *</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Elite Realty Group is a premier full-service brokerage specializing in luxury properties and personalized client service. With over 15 years serving high-net-worth families..."
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Property Specialties</Label>
                <p className="text-sm text-muted-foreground mb-3">Select your areas of expertise</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {realEstateSpecialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={profile.specialties.includes(specialty) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSpecialty(specialty)}
                      className="justify-start"
                    >
                      {profile.specialties.includes(specialty) && <CheckCircle className="h-4 w-4 mr-2" />}
                      {specialty}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent & Team Management
              </CardTitle>
              <CardDescription>
                Manage your agents, assign roles, and track team performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Bulk Import</h4>
                    <p className="text-sm text-muted-foreground mb-3">CSV upload for team roster</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Upload Team CSV
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <UserPlus className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Add Agents</h4>
                    <p className="text-sm text-muted-foreground mb-3">Individual agent onboarding</p>
                    <Button size="sm" className="w-full">
                      Add New Agent
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Role Assignment</h4>
                    <p className="text-sm text-muted-foreground mb-3">Permissions & access control</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Manage Roles
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Roles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {agentRoles.map((role, index) => (
                      <div key={role} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{role}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 5) + 1}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>License Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">CA License: 01234567</p>
                      </div>
                      <Badge variant="destructive">Expires in 15 days</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Mike Chen</p>
                        <p className="text-sm text-muted-foreground">TX License: 01987654</p>
                      </div>
                      <Badge className="bg-yellow-500">Expires in 45 days</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Lisa Rodriguez</p>
                        <p className="text-sm text-muted-foreground">FL License: 01112233</p>
                      </div>
                      <Badge className="bg-green-500">Valid</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Management Tab */}
        <TabsContent value="listings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property & Listing Management
              </CardTitle>
              <CardDescription>
                Manage your property portfolio and active listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Home className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">47</div>
                    <div className="text-sm text-muted-foreground">Active Listings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">8</div>
                    <div className="text-sm text-muted-foreground">Under Contract</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Closed MTD</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">$2.4M</div>
                    <div className="text-sm text-muted-foreground">Volume MTD</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Management Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Property Upload
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Showings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Virtual Tour Integration
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Market Analysis Tools
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Document Vault</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 border rounded text-center">
                        <FileText className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">Contracts</p>
                        <p className="text-xs text-muted-foreground">24 files</p>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <Shield className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">Compliance</p>
                        <p className="text-xs text-muted-foreground">12 files</p>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <Home className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">Property Docs</p>
                        <p className="text-xs text-muted-foreground">89 files</p>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <Users className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">Client Files</p>
                        <p className="text-xs text-muted-foreground">156 files</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                License & Compliance Management
              </CardTitle>
              <CardDescription>
                Automated tracking for licenses, CE requirements, and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">Upcoming Renewals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Sarah Johnson - CA</p>
                          <p className="text-sm text-muted-foreground">License renewal due</p>
                        </div>
                        <Badge variant="destructive">15 days</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Mike Chen - TX</p>
                          <p className="text-sm text-muted-foreground">CE credits needed</p>
                        </div>
                        <Badge className="bg-yellow-500">8 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">E&O Insurance</p>
                          <p className="text-sm text-muted-foreground">Policy renewal</p>
                        </div>
                        <Badge className="bg-orange-500">30 days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Active Licenses</span>
                      <Badge className="bg-green-600">8/8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">CE Requirements Met</span>
                      <Badge className="bg-green-600">75%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Insurance Current</span>
                      <Badge className="bg-green-600">Yes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Audit Ready</span>
                      <Badge className="bg-green-600">Ready</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>State Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded">
                      <h4 className="font-semibold">California</h4>
                      <p className="text-sm text-muted-foreground">45 CE hours / 4 years</p>
                      <p className="text-sm text-muted-foreground">Ethics: 15 hours required</p>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-semibold">Texas</h4>
                      <p className="text-sm text-muted-foreground">18 CE hours / 2 years</p>
                      <p className="text-sm text-muted-foreground">Legal: 4 hours required</p>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-semibold">Florida</h4>
                      <p className="text-sm text-muted-foreground">14 CE hours / 2 years</p>
                      <p className="text-sm text-muted-foreground">Core Law: 3 hours required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referrals & Rewards Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Referral Network & Rewards System
              </CardTitle>
              <CardDescription>
                Track referrals, earn credits, and grow your professional network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Agent Referral</h4>
                    <p className="text-sm text-muted-foreground mb-2">New agent joins</p>
                    <Badge>+100 Credits</Badge>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Home className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Transaction</h4>
                    <p className="text-sm text-muted-foreground mb-2">Successful property deal</p>
                    <Badge>+200 Credits</Badge>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Building className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Brokerage Partnership</h4>
                    <p className="text-sm text-muted-foreground mb-2">Strategic alliance</p>
                    <Badge>+500 Credits</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Wallet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Current Balance</span>
                        <span className="text-2xl font-bold text-primary">2,347</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Credits earned this quarter</div>
                    </div>
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Referral Invitation
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Leaderboard Position</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-gold/10 rounded">
                      <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div className="flex-1">
                        <div className="font-semibold">Prestige Properties</div>
                        <div className="text-sm text-muted-foreground">3,892 credits</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-primary/10 rounded">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div className="flex-1">
                        <div className="font-semibold">Your Brokerage</div>
                        <div className="text-sm text-muted-foreground">2,347 credits</div>
                      </div>
                      <Badge>Rising Star</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics & Reporting
              </CardTitle>
              <CardDescription>
                Comprehensive business intelligence and automated reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">$847K</div>
                    <div className="text-sm text-muted-foreground">Commission YTD</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">23%</div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Active Clients</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Home className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">89</div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>New Leads</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">34</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Prospects</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-12 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">24</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Under Contract</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">8</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Closed</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-6 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">12</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Automated Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Monthly Performance</span>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Agent Productivity</span>
                      <Badge variant="outline">Weekly</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Market Analysis</span>
                      <Badge variant="outline">Quarterly</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Commission Tracking</span>
                      <Badge className="bg-green-500">Real-time</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Mobile Analytics Dashboard</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Access your performance metrics, track listings, and manage your team from anywhere with our mobile-optimized platform.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">iOS App</Badge>
                    <Badge variant="outline">Android App</Badge>
                    <Badge variant="outline">Progressive Web App</Badge>
                    <Badge variant="outline">Offline Sync</Badge>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};