import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  FileText, 
  Shield, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight,
  Download,
  ExternalLink,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Upload,
  Award,
  BarChart3,
  CheckCircle,
  UserPlus,
  Wallet
} from 'lucide-react';

export const RealEstateOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome, Realty Founding Partner",
      subtitle: "Join the Elite Real Estate Network",
      icon: <Building className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Badge variant="default" className="mb-4 px-6 py-2 text-lg">
              🏆 VIP Founding Partner
            </Badge>
            <p className="text-lg text-muted-foreground">
              Set up your VIP profile with brokerage details, specialties, and professional licenses
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-semibold">Verified Partner Badge</h4>
                    <p className="text-sm text-muted-foreground">Elite marketplace recognition</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-semibold">Founding Member Status</h4>
                    <p className="text-sm text-muted-foreground">First page marketplace listing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Profile Setup Includes:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Brokerage Information</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Property Specialties</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>License Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Service Areas</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Team & Client Management",
      subtitle: "Streamlined Agent and Client Onboarding",
      icon: <Users className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Bulk Import</h4>
                <p className="text-sm text-muted-foreground">CSV upload for agents & team</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <UserPlus className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Client Seats</h4>
                <p className="text-sm text-muted-foreground">Allocate & automate onboarding</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Role Assignment</h4>
                <p className="text-sm text-muted-foreground">Property manager, agent, admin</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Agent Management Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Drag-and-drop team roster import
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Automated onboarding email sequences
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  License tracking for all team members
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Performance tracking and commissions
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Client Onboarding</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Premium client portal access
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Property search and alert setup
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Secure document sharing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Transaction progress tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Property & Listing Management",
      subtitle: "Complete Property Portfolio Control",
      icon: <Home className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Listing Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Bulk property upload & photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Showing scheduling & management</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Virtual tour integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Market analysis tools</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Lead Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Active Listings</span>
                    <Badge variant="outline" className="text-green-800">24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Under Contract</span>
                    <Badge variant="outline" className="text-green-800">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Closed This Month</span>
                    <Badge variant="outline" className="text-green-800">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Total Pipeline</span>
                    <Badge className="bg-green-600">$2.4M</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Secure Document Vault</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h5 className="font-medium">Contracts & Leases</h5>
                <p className="text-sm text-muted-foreground">E-signature integration</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h5 className="font-medium">Compliance Docs</h5>
                <p className="text-sm text-muted-foreground">Audit-ready storage</p>
              </div>
              <div className="text-center">
                <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                <h5 className="font-medium">Property Records</h5>
                <p className="text-sm text-muted-foreground">Organized by property</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Compliance & License Management",
      subtitle: "Automated Regulatory & Continuing Education",
      icon: <Shield className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">License Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800">Renewal tracking by state</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800">Team member license monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800">CE credit tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800">Automated renewal reminders</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Compliance Vault</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">E&O insurance documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">Audit preparation files</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">Property disclosure forms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">Compliance checklists</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Automated CE Reminders</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-yellow-700 mb-2">Upcoming Deadlines</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sarah Johnson (CA)</span>
                    <span className="text-red-600">Due in 15 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mike Chen (TX)</span>
                    <span className="text-yellow-600">Due in 45 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lisa Rodriguez (FL)</span>
                    <span className="text-green-600">Completed</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-yellow-700 mb-2">CE Credits Required</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>California</span>
                    <span>45 hours/2 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Texas</span>
                    <span>18 hours/2 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Florida</span>
                    <span>14 hours/2 years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Referrals & Marketplace Rewards",
      subtitle: "Professional Network & Revenue Growth",
      icon: <Wallet className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Agent Referral</h4>
                <p className="text-sm text-muted-foreground mb-2">New agent onboarding</p>
                <Badge>+100 Credits</Badge>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Building className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Client Transaction</h4>
                <p className="text-sm text-muted-foreground mb-2">Successful property deal</p>
                <Badge>+200 Credits</Badge>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Brokerage Partnership</h4>
                <p className="text-sm text-muted-foreground mb-2">Strategic referral partner</p>
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
                    <span className="text-2xl font-bold text-primary">1,847</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Credits earned this month</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Johnson Property Sale</span>
                    <span className="text-green-600">+200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Agent Referral (M. Chen)</span>
                    <span className="text-green-600">+100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Premium Feature Unlock</span>
                    <span className="text-red-600">-50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>VIP Leaderboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-gold/10 rounded">
                  <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-semibold">Elite Realty Group</div>
                    <div className="text-sm text-muted-foreground">2,847 credits</div>
                  </div>
                  <Badge className="bg-gold">Champion</Badge>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted rounded">
                  <div className="w-8 h-8 bg-muted-foreground text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-semibold">Prestige Properties</div>
                    <div className="text-sm text-muted-foreground">2,156 credits</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-primary/10 rounded">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-semibold">Your Brokerage</div>
                    <div className="text-sm text-muted-foreground">1,847 credits</div>
                  </div>
                  <Badge variant="outline">Rising Star</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Analytics & Reporting",
      subtitle: "Performance Insights & Business Intelligence",
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
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
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Closings MTD</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">$2.4M</div>
                <div className="text-sm text-muted-foreground">Volume MTD</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>New Leads</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">24</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Qualified Prospects</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-10 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">18</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Under Contract</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">8</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Closed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
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
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Monthly performance summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Agent productivity reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Market analysis insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Commission tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Compliance audit reports</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Mobile-First Analytics</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Access your dashboard, manage listings, and track performance from any device - optimized for mobile professionals.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">iOS App</Badge>
                <Badge variant="outline">Android App</Badge>
                <Badge variant="outline">Progressive Web App</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 7,
      title: "Ready to Transform Your Real Estate Business",
      subtitle: "Launch Your VIP Practice Management Suite",
      icon: <Building className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Welcome to the Future of Real Estate</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Join an exclusive network of top brokers and property managers
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Button size="lg" className="h-16 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Set Up Team</span>
            </Button>
            <Button size="lg" variant="outline" className="h-16 flex flex-col items-center gap-2">
              <Home className="h-6 w-6" />
              <span>Add Listings</span>
            </Button>
            <Button size="lg" variant="outline" className="h-16 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Send Invites</span>
            </Button>
            <Button size="lg" variant="outline" className="h-16 flex flex-col items-center gap-2">
              <Upload className="h-6 w-6" />
              <span>Upload Docs</span>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">Getting Started Checklist</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete brokerage profile setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Import team members and licenses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Upload current property listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Set up client onboarding workflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Configure referral and rewards system</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Support & Resources</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Complete training manual & videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Dedicated support team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Weekly onboarding sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>VIP founding member benefits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Real Estate Partner Onboarding</h1>
            <p className="text-muted-foreground">
              VIP launch training for real estate professionals
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Slides
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Training Manual
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Main slide content */}
      <Card className="min-h-[600px]">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {currentSlideData.icon}
          </div>
          <CardTitle className="text-2xl">{currentSlideData.title}</CardTitle>
          <CardDescription className="text-lg">
            {currentSlideData.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentSlideData.content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentSlide + 1} of {slides.length}
        </span>
        <Button
          variant="outline"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Real Estate-specific FAQ */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Can I invite my whole team/agency?</h4>
            <p className="text-sm text-muted-foreground">
              Yes—bulk imports and team invites are included with unlimited agent seats!
            </p>
          </div>
          <div>
            <h4 className="font-semibold">How are licenses and renewals managed?</h4>
            <p className="text-sm text-muted-foreground">
              Automated renewal reminders, CE tracking alerts, and audit-proof document vault.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">How are referrals tracked?</h4>
            <p className="text-sm text-muted-foreground">
              Your Referral Wallet tracks all credits—earn rewards for every referral and successful transaction.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Is the platform mobile-friendly?</h4>
            <p className="text-sm text-muted-foreground">
              Absolutely—manage listings, clients, and docs on any device with our mobile-first design.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};