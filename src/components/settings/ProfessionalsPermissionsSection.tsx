import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCheck, 
  Plus, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Eye,
  Shield,
  ExternalLink,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ProfessionalsPermissionsSection() {
  const professionals = [
    {
      id: '1',
      name: 'Tony Gomes',
      role: 'Financial Advisor',
      firm: 'Wealth Management Partners',
      email: 'tony@wealthpartners.com',
      phone: '(555) 123-4567',
      assignedAt: '2024-01-15',
      status: 'Active',
      permissions: ['View Accounts', 'Create Goals', 'Schedule Meetings'],
      avatar: ''
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'CPA',
      firm: 'Chen & Associates',
      email: 'sarah@chenassociates.com',
      phone: '(555) 234-5678',
      assignedAt: '2024-02-01',
      status: 'Active',
      permissions: ['View Tax Documents', 'Access HSA', 'Upload Documents'],
      avatar: ''
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      role: 'Estate Attorney',
      firm: 'Rodriguez Law Firm',
      email: 'michael@rodriguezlaw.com',
      phone: '(555) 345-6789',
      assignedAt: '2024-02-15',
      status: 'Pending',
      permissions: ['View Estate Documents', 'Access Trusts', 'Create Wills'],
      avatar: ''
    }
  ];

  const accessRequests = [
    {
      id: '1',
      professional: 'Dr. Lisa Wang',
      role: 'Healthcare Advocate',
      firm: 'Family Health Partners',
      requestedAccess: ['Health Records', 'Medical Documents', 'Family Health Info'],
      requestedAt: '2024-01-20',
      status: 'Pending'
    }
  ];

  const auditLog = [
    {
      id: '1',
      action: 'Viewed Financial Summary',
      professional: 'Tony Gomes',
      timestamp: '2024-01-20 14:30',
      details: 'Accessed quarterly portfolio review'
    },
    {
      id: '2',
      action: 'Uploaded Tax Document',
      professional: 'Sarah Chen',
      timestamp: '2024-01-20 11:15',
      details: 'Added 2023 tax return to secure vault'
    },
    {
      id: '3',
      action: 'Scheduled Meeting',
      professional: 'Tony Gomes',
      timestamp: '2024-01-19 16:45',
      details: 'Monthly portfolio review - Jan 25, 2024'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Your Professional Team */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Your Professional Team
              </CardTitle>
              <CardDescription>
                Manage the professionals who help with your financial and family affairs
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Find Professional
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Find a Professional</DialogTitle>
                  <DialogDescription>
                    Search our marketplace for verified professionals
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Browse our marketplace of verified advisors, CPAs, attorneys, healthcare advocates, and other professionals.
                  </p>
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Browse Professional Marketplace
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {professionals.map((professional) => (
              <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={professional.avatar} />
                    <AvatarFallback>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{professional.name}</span>
                      <Badge variant={professional.status === 'Active' ? 'default' : 'secondary'}>
                        {professional.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{professional.role} • {professional.firm}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span>Assigned: {professional.assignedAt}</span>
                        <span>•</span>
                        <span>{professional.permissions.length} permissions</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Requests */}
      {accessRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pending Access Requests
            </CardTitle>
            <CardDescription>
              Review and approve professional access requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{request.professional}</span>
                        <Badge variant="outline">{request.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {request.firm} • Requested {request.requestedAt}
                      </p>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Requested Access:</Label>
                        <div className="flex flex-wrap gap-1">
                          {request.requestedAccess.map((access, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {access}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Decline</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permission Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Access Controls</CardTitle>
          <CardDescription>
            Manage what your professional team can see and do
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-approve advisor requests</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically grant access to verified advisors from your firm
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Require approval for document access</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when professionals request document access
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Allow goal modifications</Label>
                <p className="text-sm text-muted-foreground">
                  Let advisors create and modify your financial goals
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Share family information</Label>
                <p className="text-sm text-muted-foreground">
                  Include family member info in professional access
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            See what your professional team has been doing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLog.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-sm text-muted-foreground">by {log.professional}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.details} • {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">View Full Activity Log</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}