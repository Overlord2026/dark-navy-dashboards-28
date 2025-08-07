import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Users, 
  Wrench, 
  FileText, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Shield,
  CreditCard,
  Plus,
  TrendingUp,
  Download
} from "lucide-react";

export const PropertyManagerDashboard: React.FC = () => {
  const [portfolioValue] = useState(2850000);
  const [occupancyRate] = useState(94);
  const [monthlyRent] = useState(15800);
  const [maintenanceRequests] = useState(8);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Mary! 🏢</h1>
        <p className="text-white/90">Your Property Management Command Center. Manage tenants, track maintenance, and generate owner reports—all from one secure dashboard.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">18 properties</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">17 of 18 units occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">95% collected this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRequests}</div>
            <p className="text-xs text-muted-foreground">3 urgent, 5 routine</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="tenants">Tenant Portal</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="leases">Lease Mgmt</TabsTrigger>
          <TabsTrigger value="reports">Owner Reports</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Portfolio Overview</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { address: "Sunset Apartments", units: 8, occupied: 7, rent: 4800 },
              { address: "Maple Street Duplex", units: 2, occupied: 2, rent: 2200 },
              { address: "Downtown Condos", units: 4, occupied: 4, rent: 3600 }
            ].map((property, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{property.address}</CardTitle>
                      <CardDescription>{property.units} units</CardDescription>
                    </div>
                    <Badge variant={property.occupied === property.units ? "default" : "secondary"}>
                      {property.occupied}/{property.units} Occupied
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Rent:</span>
                    <span className="font-medium">${property.rent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Occupancy:</span>
                    <span className="font-medium">{Math.round((property.occupied / property.units) * 100)}%</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Users className="h-3 w-3 mr-1" />
                      Tenants
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Wrench className="h-3 w-3 mr-1" />
                      Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Properties managed, occupancy status, and income overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$15,800</div>
                  <p className="text-sm text-green-600">Monthly Income</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$3,200</div>
                  <p className="text-sm text-blue-600">Monthly Expenses</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$12,600</div>
                  <p className="text-sm text-purple-600">Net Cash Flow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tenant Portal</h3>
            <Button className="gap-2">
              <Users className="h-4 w-4" />
              Invite Tenant
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Rent payments, maintenance requests, and messaging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { tenant: "John Smith", action: "Rent payment received", time: "2 hours ago", type: "payment" },
                  { tenant: "Sarah Johnson", action: "Maintenance request", time: "1 day ago", type: "maintenance" },
                  { tenant: "Mike Wilson", action: "Message sent", time: "2 days ago", type: "message" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {activity.type === 'payment' ? (
                        <CreditCard className="h-4 w-4 text-green-600" />
                      ) : activity.type === 'maintenance' ? (
                        <Wrench className="h-4 w-4 text-orange-600" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.tenant}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tenant Management</CardTitle>
                <CardDescription>Notices, communications, and portal access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Send Notice
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    Bulk Message
                  </Button>
                </div>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Enable secure tenant communications and online rent collection
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Maintenance Tracker</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Request
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { status: "Urgent", count: 3, color: "red" },
              { status: "In Progress", count: 2, color: "yellow" },
              { status: "Completed", count: 12, color: "green" }
            ].map((category) => (
              <Card key={category.status}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                    {category.status}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category.count}</div>
                  <p className="text-sm text-muted-foreground">requests</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Requests</CardTitle>
              <CardDescription>Log, schedule, assign vendors, and track completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { property: "Sunset Apt #3", issue: "Leaky faucet", priority: "Medium", vendor: "ABC Plumbing" },
                  { property: "Maple Duplex B", issue: "HVAC repair", priority: "Urgent", vendor: "Cool Tech" },
                  { property: "Downtown #2", issue: "Paint touch-up", priority: "Low", vendor: "Paint Pro" }
                ].map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{request.property}</p>
                      <p className="text-sm text-muted-foreground">{request.issue}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={request.priority === 'Urgent' ? 'destructive' : 'secondary'}>
                        {request.priority}
                      </Badge>
                      <span className="text-sm">{request.vendor}</span>
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leases" className="space-y-4">
          <h3 className="text-lg font-semibold">Lease Management</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Expiring Soon
                </CardTitle>
                <CardDescription>Renewals and expirations requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tenant: "Sarah Johnson", property: "Sunset Apt #5", expires: "March 15, 2024" },
                    { tenant: "Mike Wilson", property: "Downtown #1", expires: "April 2, 2024" }
                  ].map((lease, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">{lease.tenant}</p>
                        <p className="text-sm text-muted-foreground">{lease.property}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{lease.expires}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Renew
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Archive</CardTitle>
                <CardDescription>E-sign integration and secure storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Digital lease signing and document management
                  </p>
                  <Button variant="outline">
                    Setup E-Sign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Owner Reporting</h3>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Statements</CardTitle>
                <CardDescription>Income/expense statements with downloadable PDFs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">February 2024</p>
                      <p className="text-sm text-muted-foreground">Net Income: $12,600</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">January 2024</p>
                      <p className="text-sm text-muted-foreground">Net Income: $11,800</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bank Account Sync</CardTitle>
                <CardDescription>Automated transaction categorization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Connect bank accounts for automatic expense tracking
                  </p>
                  <Button variant="outline">
                    Connect Bank
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <h3 className="text-lg font-semibold">Task Automation</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Automated Reminders</CardTitle>
              <CardDescription>Auto-reminders for rent, renewals, and inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { task: "Rent Reminders", frequency: "Monthly", status: "Active" },
                  { task: "Lease Renewals", frequency: "60 days before", status: "Active" },
                  { task: "Property Inspections", frequency: "Quarterly", status: "Inactive" },
                  { task: "Insurance Renewals", frequency: "Annual", status: "Active" }
                ].map((automation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{automation.task}</p>
                      <p className="text-sm text-muted-foreground">{automation.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={automation.status === 'Active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <h3 className="text-lg font-semibold">Compliance Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  License Status
                </CardTitle>
                <CardDescription>Local/state licensure and renewal alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Property Manager License</p>
                      <p className="text-sm text-green-600">Valid until Dec 2024</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Insurance Policy</p>
                      <p className="text-sm text-yellow-600">Expires in 60 days</p>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Storage</CardTitle>
                <CardDescription>Upload docs and set renewal reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Stay compliant—never miss a license renewal or inspection date!
                  </p>
                  <Button variant="outline">
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Scale Your Property Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage maintenance requests, send tenant notices, and generate owner reports with one click!
            </p>
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};