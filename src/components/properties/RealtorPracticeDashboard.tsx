import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Settings, 
  Camera, 
  MessageSquare,
  TrendingUp,
  MapPin,
  Clock,
  Plus
} from "lucide-react";

export const RealtorPracticeDashboard: React.FC = () => {
  const [activeListings] = useState(12);
  const [pendingCommission] = useState(45000);
  const [monthlyShowings] = useState(28);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Mary! 🏡</h1>
        <p className="text-white/90">Your dedicated Real Estate Practice Dashboard is ready. Track your listings, manage clients, and grow your business—all in one premium, secure portal.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From 8 pending sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's Showings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyShowings}</div>
            <p className="text-xs text-muted-foreground">6 scheduled this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="leads">Lead Tracker</TabsTrigger>
          <TabsTrigger value="showings">Showings</TabsTrigger>
          <TabsTrigger value="documents">Doc Vault</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="events">Open Houses</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Listings Dashboard</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Listing
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((listing) => (
              <Card key={listing} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">123 Main St, Anytown</CardTitle>
                      <CardDescription>$450,000 • 3BR/2BA</CardDescription>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Days on Market:</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Showings:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Camera className="h-3 w-3 mr-1" />
                      Photos
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lead & Inquiry Tracker</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Built-in CRM with automated follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['John Smith', 'Sarah Johnson', 'Mike Wilson'].map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{lead}</p>
                        <p className="text-sm text-muted-foreground">Interested in downtown condos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Hot Lead</Badge>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="showings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Showings Scheduler</h3>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Showing
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['10:00 AM - 123 Main St', '2:00 PM - 456 Oak Ave', '4:30 PM - 789 Pine Rd'].map((showing, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">{showing}</span>
                    <Button size="sm" variant="ghost">
                      <MapPin className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Forms</CardTitle>
                <CardDescription>Automated post-showing surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Collect valuable feedback from every showing</p>
                  <Button variant="outline">
                    Setup Feedback Forms
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <h3 className="text-lg font-semibold">Document Vault</h3>
          <Card>
            <CardHeader>
              <CardTitle>Secure Document Management</CardTitle>
              <CardDescription>Offer letters, contracts, disclosures with e-sign integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Contracts', 'Disclosures', 'Marketing Materials'].map((category) => (
                  <div key={category} className="text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">{category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <h3 className="text-lg font-semibold">Commission Tracker</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$28,500</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,000</div>
                <p className="text-sm text-muted-foreground">8 transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$67,200</div>
                <p className="text-sm text-muted-foreground">Under contract</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <h3 className="text-lg font-semibold">Vendor Directory</h3>
          <Card>
            <CardHeader>
              <CardTitle>Your Trusted Partners</CardTitle>
              <CardDescription>Photographers, appraisers, title/escrow, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Photographers', 'Appraisers', 'Title Companies', 'Inspectors'].map((vendor) => (
                  <div key={vendor} className="text-center p-4 border rounded-lg">
                    <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-medium">{vendor}</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      View All
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <h3 className="text-lg font-semibold">Open House & Events Calendar</h3>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Add, promote, and track attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Open House
              </Button>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>No upcoming events scheduled</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <h3 className="text-lg font-semibold">Marketing Templates</h3>
          <Card>
            <CardHeader>
              <CardTitle>Professional Marketing Materials</CardTitle>
              <CardDescription>Flyers, digital postcards, and AI-generated listing banners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Listing Flyers', 'Social Media Posts', 'Email Templates'].map((template) => (
                  <div key={template} className="text-center p-6 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-medium mb-2">{template}</p>
                    <Button size="sm" variant="outline">
                      Create
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Upgrade Your Practice</h3>
            <p className="text-muted-foreground mb-4">
              Get unlimited listings, advanced analytics, and premium marketing tools
            </p>
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};