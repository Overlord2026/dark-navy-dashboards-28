import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Upload,
  Send,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Download,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PropertyManagerBulkInviteProps {
  className?: string;
}

interface InviteRecord {
  id: string;
  name: string;
  firm: string;
  email: string;
  phone?: string;
  website?: string;
  location: string;
  specialty: string;
  status: "pending" | "sent" | "viewed" | "accepted" | "failed";
  sentAt?: string;
  isFoundingPartner: boolean;
}

export function PropertyManagerBulkInvite({ className }: PropertyManagerBulkInviteProps) {
  const [activeTab, setActiveTab] = useState("bulk-import");
  const [csvData, setCsvData] = useState("");
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [manualForm, setManualForm] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    specialty: "",
    isFoundingPartner: true
  });

  // Mock analytics data
  const analytics = {
    totalInvites: 156,
    pendingInvites: 23,
    acceptedInvites: 89,
    profilesCompleted: 67,
    activeProfessionals: 54,
    foundingPartners: 41
  };

  const handleCSVUpload = () => {
    if (!csvData.trim()) {
      toast.error("Please enter CSV data");
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newInvites: InviteRecord[] = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        return {
          id: `invite-${Date.now()}-${index}`,
          name: values[headers.indexOf('name')] || '',
          firm: values[headers.indexOf('firm')] || '',
          email: values[headers.indexOf('email')] || '',
          phone: values[headers.indexOf('phone')] || '',
          website: values[headers.indexOf('website')] || '',
          location: values[headers.indexOf('location')] || '',
          specialty: values[headers.indexOf('specialty')] || '',
          status: "pending",
          isFoundingPartner: true
        };
      });

      setInvites(prev => [...prev, ...newInvites]);
      setCsvData("");
      toast.success(`Imported ${newInvites.length} property managers`);
    } catch (error) {
      toast.error("Error parsing CSV data");
    }
  };

  const handleManualAdd = () => {
    if (!manualForm.name || !manualForm.email || !manualForm.firm) {
      toast.error("Please fill in required fields");
      return;
    }

    const newInvite: InviteRecord = {
      id: `invite-${Date.now()}`,
      ...manualForm,
      status: "pending"
    };

    setInvites(prev => [newInvite, ...prev]);
    setManualForm({
      name: "",
      firm: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      specialty: "",
      isFoundingPartner: true
    });
    toast.success("Property manager added to invite list");
  };

  const handleSendInvites = () => {
    const pendingInvites = invites.filter(invite => invite.status === "pending");
    
    // Simulate sending invites
    setInvites(prev => prev.map(invite => 
      invite.status === "pending" 
        ? { ...invite, status: "sent", sentAt: new Date().toISOString() }
        : invite
    ));

    toast.success(`Sent ${pendingInvites.length} invitations`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "sent": return <Send className="h-4 w-4 text-blue-500" />;
      case "viewed": return <Eye className="h-4 w-4 text-purple-500" />;
      case "accepted": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Manager Invitations</h1>
          <p className="text-muted-foreground">Manage bulk invitations for property managers and realtors</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Building2 className="h-3 w-3 mr-1" />
            {analytics.foundingPartners} Founding Partners
          </Badge>
          <Button onClick={handleSendInvites} disabled={!invites.some(i => i.status === "pending")}>
            <Send className="h-4 w-4 mr-2" />
            Send All Invites
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics.totalInvites}</div>
            <p className="text-xs text-muted-foreground">Total Invites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{analytics.pendingInvites}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{analytics.acceptedInvites}</div>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics.profilesCompleted}</div>
            <p className="text-xs text-muted-foreground">Profiles Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics.activeProfessionals}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{analytics.foundingPartners}</div>
            <p className="text-xs text-muted-foreground">Founding Partners</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
          <TabsTrigger value="manual-add">Manual Add</TabsTrigger>
          <TabsTrigger value="invite-list">Invite List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV Bulk Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CSV Data</Label>
                <p className="text-sm text-muted-foreground">
                  Format: name, firm, email, phone, website, location, specialty
                </p>
                <Textarea
                  placeholder="name,firm,email,phone,website,location,specialty
John Smith,Premium Properties,john@premiumprops.com,(555)123-4567,premiumprops.com,Beverly Hills CA,Luxury Homes
Jane Doe,Elite Management,jane@elitemgmt.com,(555)987-6543,elitemgmt.com,Manhattan NY,Portfolio Management"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={8}
                />
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={handleCSVUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV Data
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual-add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Individual Property Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={manualForm.name}
                    onChange={(e) => setManualForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firm">Firm *</Label>
                  <Input
                    id="firm"
                    value={manualForm.firm}
                    onChange={(e) => setManualForm(prev => ({ ...prev, firm: e.target.value }))}
                    placeholder="Premium Properties LLC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={manualForm.email}
                    onChange={(e) => setManualForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@premiumproperties.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={manualForm.website}
                    onChange={(e) => setManualForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="premiumproperties.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={manualForm.location}
                    onChange={(e) => setManualForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Beverly Hills, CA"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={manualForm.specialty}
                  onChange={(e) => setManualForm(prev => ({ ...prev, specialty: e.target.value }))}
                  placeholder="Luxury Homes, Investment Properties"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="founding-partner"
                  checked={manualForm.isFoundingPartner}
                  onCheckedChange={(checked) => setManualForm(prev => ({ ...prev, isFoundingPartner: checked }))}
                />
                <Label htmlFor="founding-partner" className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Founding Partner Status
                </Label>
              </div>
              <Button onClick={handleManualAdd}>
                <Building2 className="h-4 w-4 mr-2" />
                Add to Invite List
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invite-list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Invitation Queue ({invites.length})</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invites.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No invitations in queue. Add property managers using bulk import or manual entry.
                  </p>
                ) : (
                  invites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{invite.name}</h4>
                          {invite.isFoundingPartner && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Founding
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{invite.firm}</p>
                        <p className="text-sm text-muted-foreground">{invite.email}</p>
                        <p className="text-xs text-muted-foreground">{invite.location} • {invite.specialty}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invite.status)}
                          <span className="text-sm capitalize">{invite.status}</span>
                        </div>
                        {invite.sentAt && (
                          <span className="text-xs text-muted-foreground">
                            Sent {new Date(invite.sentAt).toLocaleDateString()}
                          </span>
                        )}
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Invitation Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { status: "Accepted", count: analytics.acceptedInvites, color: "bg-green-500" },
                    { status: "Pending", count: analytics.pendingInvites, color: "bg-yellow-500" },
                    { status: "Viewed", count: 18, color: "bg-purple-500" },
                    { status: "Failed", count: 7, color: "bg-red-500" }
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", item.color)} />
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sarah Chen completed profile setup</span>
                    <span className="text-muted-foreground ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span>Michael Rodriguez viewed invitation</span>
                    <span className="text-muted-foreground ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Send className="h-4 w-4 text-blue-500" />
                    <span>5 invitations sent successfully</span>
                    <span className="text-muted-foreground ml-auto">1d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}