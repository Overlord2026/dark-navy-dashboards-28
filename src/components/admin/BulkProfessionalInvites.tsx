import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Users, 
  Mail, 
  Download, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Home,
  Building
} from "lucide-react";
import { toast } from "sonner";

export const BulkProfessionalInvites: React.FC = () => {
  const [inviteType, setInviteType] = useState<'realtor' | 'property_manager'>('realtor');
  const [emailList, setEmailList] = useState('');
  const [invitesSent, setInvitesSent] = useState(0);
  const [activationRate] = useState(68);

  const handleBulkInvite = () => {
    const emails = emailList.split('\n').filter(email => email.trim());
    if (emails.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    // Simulate bulk invite process
    setInvitesSent(emails.length);
    toast.success(`Sent ${emails.length} invitations to ${inviteType === 'realtor' ? 'real estate agents' : 'property managers'}`);
    setEmailList('');
  };

  const sampleEmails = inviteType === 'realtor' 
    ? `mary.smith@coldwellbanker.com
john.doe@remax.com
sarah.johnson@kw.com
mike.wilson@century21.com`
    : `property.manager@abc-properties.com
leasing@sunrise-apartments.com
manager@downtown-condos.com
admin@maple-management.com`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Professional Invites</h2>
          <p className="text-muted-foreground">Invite realtors and property managers to join the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Templates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invites Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invitesSent}</div>
            <p className="text-xs text-muted-foreground">This session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activationRate}%</div>
            <p className="text-xs text-muted-foreground">Average 30-day activation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Realtors</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+15 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Managers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bulk-invite" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bulk-invite">Bulk Invite</TabsTrigger>
          <TabsTrigger value="tracking">Invite Tracking</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-invite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Bulk Invitations</CardTitle>
              <CardDescription>
                Invite multiple professionals at once via email list or CSV upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="invite-type">Professional Type</Label>
                <Select value={inviteType} onValueChange={(value: 'realtor' | 'property_manager') => setInviteType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtor">Real Estate Agents</SelectItem>
                    <SelectItem value="property_manager">Property Managers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="email-list">Email Addresses (one per line)</Label>
                    <Textarea
                      id="email-list"
                      placeholder={`Enter email addresses:\n\n${sampleEmails}`}
                      value={emailList}
                      onChange={(e) => setEmailList(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleBulkInvite} className="flex-1 gap-2">
                      <Mail className="h-4 w-4" />
                      Send Invitations
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEmailList(sampleEmails)}
                    >
                      Use Sample
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">CSV Upload</CardTitle>
                      <CardDescription>Upload a CSV file with professional contacts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Drop CSV file here or click to browse</p>
                        <p className="text-sm text-muted-foreground">
                          Required columns: email, name, agency (optional)
                        </p>
                        <Button variant="outline" className="mt-4">
                          Choose File
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Invitation Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <p><strong>Subject:</strong> You're Invited to Join Our {inviteType === 'realtor' ? 'Real Estate' : 'Property Management'} Platform</p>
                        <p><strong>From:</strong> Boutique Family Office™</p>
                        <div className="bg-muted/50 p-3 rounded text-xs">
                          <p>Hi [Name],</p>
                          <p className="mt-2">
                            You've been selected to join our exclusive {inviteType === 'realtor' ? 'real estate professional' : 'property management'} platform...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Tracking</CardTitle>
              <CardDescription>Monitor invite status and activation rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { email: "mary.smith@coldwellbanker.com", status: "activated", sent: "2 days ago", activated: "1 day ago" },
                  { email: "john.doe@remax.com", status: "pending", sent: "3 days ago", activated: null },
                  { email: "sarah.johnson@kw.com", status: "opened", sent: "5 days ago", activated: null },
                  { email: "property.manager@abc-properties.com", status: "activated", sent: "1 week ago", activated: "5 days ago" }
                ].map((invite, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300">
                        {invite.status === 'activated' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        {invite.status === 'opened' && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                        {invite.status === 'pending' && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                      </div>
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-sm text-muted-foreground">Sent {invite.sent}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        invite.status === 'activated' ? 'default' : 
                        invite.status === 'opened' ? 'secondary' : 'outline'
                      }>
                        {invite.status === 'activated' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" />Activated</>
                        ) : invite.status === 'opened' ? (
                          <><AlertCircle className="h-3 w-3 mr-1" />Opened</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" />Pending</>
                        )}
                      </Badge>
                      {invite.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          Resend
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Customizable invitation and follow-up templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Realtor Welcome", type: "Initial Invitation", status: "Active" },
                  { name: "Property Manager Invite", type: "Initial Invitation", status: "Active" },
                  { name: "Follow-up Reminder", type: "Follow-up", status: "Active" },
                  { name: "Platform Demo Invite", type: "Engagement", status: "Draft" }
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.status === 'Active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Materials</CardTitle>
                <CardDescription>Downloadable guides and onboarding resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Realtor Onboarding Guide", type: "PDF", size: "2.1 MB" },
                  { name: "Property Manager Training", type: "PPTX", size: "4.8 MB" },
                  { name: "Demo Video Script", type: "PDF", size: "156 KB" },
                  { name: "Quick Start Checklist", type: "PDF", size: "89 KB" }
                ].map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Download className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-muted-foreground">{material.type} • {material.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};