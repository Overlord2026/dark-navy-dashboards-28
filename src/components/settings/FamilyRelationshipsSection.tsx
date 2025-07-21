import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Settings, 
  Eye, 
  Edit,
  Shield,
  Heart
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function FamilyRelationshipsSection() {
  const familyMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      email: 'sarah@example.com',
      hasAccess: true,
      accessLevel: 'Full Access',
      joinedAt: '2024-01-15',
      avatar: ''
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Child',
      email: 'michael@example.com',
      hasAccess: true,
      accessLevel: 'View Only',
      joinedAt: '2024-02-01',
      avatar: ''
    },
    {
      id: '3',
      name: 'Emma Johnson',
      relationship: 'Child',
      email: 'emma@example.com',
      hasAccess: false,
      accessLevel: 'Pending Invitation',
      joinedAt: null,
      avatar: ''
    }
  ];

  const beneficiaries = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      type: 'Primary',
      percentage: '50%'
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Child',
      type: 'Primary',
      percentage: '25%'
    },
    {
      id: '3',
      name: 'Emma Johnson',
      relationship: 'Child',
      type: 'Primary',
      percentage: '25%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Family Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family & Household
              </CardTitle>
              <CardDescription>
                Manage family members and their access to your account
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Family Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Family Member</DialogTitle>
                  <DialogDescription>
                    Add a family member and set their access level
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accessLevel">Access Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="limited">Limited Access</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Invitation</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      <Badge variant="outline">{member.relationship}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        {member.hasAccess ? (
                          <>
                            <Shield className="h-3 w-3 text-green-500" />
                            {member.accessLevel}
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 text-yellow-500" />
                            {member.accessLevel}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Beneficiaries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Beneficiaries
              </CardTitle>
              <CardDescription>
                Manage beneficiaries for your accounts and estate planning
              </CardDescription>
            </div>
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Beneficiary
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {beneficiary.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{beneficiary.name}</span>
                      <Badge variant={beneficiary.type === 'Primary' ? 'default' : 'secondary'}>
                        {beneficiary.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{beneficiary.relationship}</span>
                      <span className="font-medium">{beneficiary.percentage}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sharing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sharing & Permissions</CardTitle>
          <CardDescription>
            Control what information family members can see and manage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Financial Overview</Label>
                <p className="text-sm text-muted-foreground">
                  Allow family members to view account balances and net worth
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Goal Progress</Label>
                <p className="text-sm text-muted-foreground">
                  Share progress on financial goals and milestones
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Health Information</Label>
                <p className="text-sm text-muted-foreground">
                  Share health metrics and records with designated family
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Document Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access to important documents and estate plans
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}