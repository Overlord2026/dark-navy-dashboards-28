import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Calendar, 
  BookOpen, 
  Download,
  Plus,
  UserPlus,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  department: string;
  complianceRole: 'compliance_officer' | 'advisor' | 'admin' | 'staff';
  trainingProgress: number;
  certifications: string[];
  lastTraining: string;
  mandatoryComplete: boolean;
  cleCredits: number;
  cleRequired: number;
}

interface Training {
  id: string;
  title: string;
  type: 'mandatory' | 'recommended' | 'cle' | 'cpe';
  duration: string;
  provider: string;
  expiryDate?: string;
  status: 'available' | 'in_progress' | 'completed' | 'expired';
  credits: number;
  assignedTo: string[];
}

export const TeamTrainingCenter: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Chief Compliance Officer',
      email: 'sarah.chen@firm.com',
      department: 'Compliance',
      complianceRole: 'compliance_officer',
      trainingProgress: 100,
      certifications: ['CRC', 'CAMS', 'Series 66'],
      lastTraining: '2024-01-10',
      mandatoryComplete: true,
      cleCredits: 24,
      cleRequired: 20
    },
    {
      id: '2',
      name: 'Michael Torres',
      role: 'Senior Financial Advisor',
      email: 'michael.torres@firm.com',
      department: 'Advisory',
      complianceRole: 'advisor',
      trainingProgress: 85,
      certifications: ['CFP', 'CFA', 'Series 7', 'Series 66'],
      lastTraining: '2024-01-05',
      mandatoryComplete: true,
      cleCredits: 18,
      cleRequired: 20
    },
    {
      id: '3',
      name: 'Jennifer Walsh',
      role: 'Operations Manager',
      email: 'jennifer.walsh@firm.com',
      department: 'Operations',
      complianceRole: 'admin',
      trainingProgress: 60,
      certifications: ['Series 99'],
      lastTraining: '2023-12-15',
      mandatoryComplete: false,
      cleCredits: 8,
      cleRequired: 15
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Associate Advisor',
      email: 'david.kim@firm.com',
      department: 'Advisory',
      complianceRole: 'staff',
      trainingProgress: 40,
      certifications: ['Series 7'],
      lastTraining: '2023-11-20',
      mandatoryComplete: false,
      cleCredits: 5,
      cleRequired: 15
    }
  ];

  const trainings: Training[] = [
    {
      id: '1',
      title: 'Cybersecurity Awareness 2024',
      type: 'mandatory',
      duration: '2 hours',
      provider: 'Internal',
      status: 'available',
      credits: 2,
      assignedTo: ['all']
    },
    {
      id: '2',
      title: 'AML/BSA Update Training',
      type: 'mandatory',
      duration: '3 hours',
      provider: 'Compliance Solutions',
      status: 'available',
      credits: 3,
      assignedTo: ['compliance_officer', 'advisor']
    },
    {
      id: '3',
      title: 'Fiduciary Duty Refresher',
      type: 'cle',
      duration: '1.5 hours',
      provider: 'CLE Provider',
      expiryDate: '2024-12-31',
      status: 'available',
      credits: 1.5,
      assignedTo: ['advisor']
    },
    {
      id: '4',
      title: 'Investment Product Due Diligence',
      type: 'recommended',
      duration: '4 hours',
      provider: 'Investment Institute',
      status: 'available',
      credits: 4,
      assignedTo: ['advisor', 'compliance_officer']
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-success';
    if (progress >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'compliance_officer':
        return <Award className="h-4 w-4 text-primary" />;
      case 'advisor':
        return <Users className="h-4 w-4 text-success" />;
      case 'admin':
        return <Target className="h-4 w-4 text-warning" />;
      default:
        return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrainingTypeBadge = (type: string) => {
    switch (type) {
      case 'mandatory':
        return <Badge variant="destructive">Mandatory</Badge>;
      case 'cle':
        return <Badge variant="default" className="bg-primary">CLE</Badge>;
      case 'cpe':
        return <Badge variant="default" className="bg-secondary">CPE</Badge>;
      case 'recommended':
        return <Badge variant="outline">Recommended</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const overallProgress = Math.round(teamMembers.reduce((acc, member) => acc + member.trainingProgress, 0) / teamMembers.length);
  const mandatoryComplete = teamMembers.filter(member => member.mandatoryComplete).length;
  const totalCertifications = teamMembers.reduce((acc, member) => acc + member.certifications.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Team & Training Center</h2>
            <p className="text-muted-foreground">Staff roster, certifications, and continuing education tracking</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Certificates
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Assign Training
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Training</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="training-select">Select Training</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose training..." />
                    </SelectTrigger>
                    <SelectContent>
                      {trainings.map(training => (
                        <SelectItem key={training.id} value={training.id}>
                          {training.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignee-select">Assign To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team members..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input type="date" id="due-date" />
                </div>
                <Button className="w-full btn-primary-gold">Assign Training</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary-gold">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="First name..." />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Last name..." />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="email@firm.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="Job title..." />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="advisory">Advisory</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="admin">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="compliance-role">Compliance Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                      <SelectItem value="advisor">Advisor</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full btn-primary-gold">Add Team Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Team average completion</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mandatory Complete</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{mandatoryComplete}/{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Staff members up to date</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalCertifications}</div>
            <p className="text-xs text-muted-foreground mt-2">Professional licenses & certs</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLE Credits</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {teamMembers.reduce((acc, member) => acc + member.cleCredits, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total earned this year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roster" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roster">Team Roster</TabsTrigger>
          <TabsTrigger value="training">Training Library</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="tracking">CLE/CPE Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Team Roster & Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Training Progress</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>CLE Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(member.complianceRole)}
                            <div>
                              <p className="text-sm font-medium">{member.role}</p>
                              <p className="text-xs text-muted-foreground">{member.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${getProgressColor(member.trainingProgress)}`}>
                                {member.trainingProgress}%
                              </span>
                            </div>
                            <Progress value={member.trainingProgress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.certifications.slice(0, 2).map((cert) => (
                              <Badge key={cert} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                            {member.certifications.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.certifications.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              {member.cleCredits}/{member.cleRequired}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.cleCredits >= member.cleRequired ? 'Complete' : 'In Progress'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.mandatoryComplete ? (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Current
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMember(member)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Available Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainings.map((training) => (
                  <div key={training.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">{training.title}</h4>
                          {getTrainingTypeBadge(training.type)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Duration: {training.duration} • Provider: {training.provider}</p>
                          <p>Credits: {training.credits} • Status: {training.status}</p>
                          {training.expiryDate && (
                            <p>Expires: {new Date(training.expiryDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button size="sm" className="btn-primary-gold">Assign</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Certificates & Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Certificate management system coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  View, download, and track professional certificates and licenses
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>CLE/CPE Credit Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {member.cleCredits}/{member.cleRequired} Credits
                        </p>
                        <Progress 
                          value={(member.cleCredits / member.cleRequired) * 100} 
                          className="w-32 h-2 mt-1" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Member Detail Modal */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{selectedMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {selectedMember.name}
                {selectedMember.mandatoryComplete ? (
                  <Badge variant="default" className="bg-success text-success-foreground">Current</Badge>
                ) : (
                  <Badge variant="destructive">Needs Training</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Profile Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{selectedMember.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{selectedMember.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedMember.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Training:</span>
                      <span>{new Date(selectedMember.lastTraining).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Training & Credits</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Training Progress</span>
                        <span>{selectedMember.trainingProgress}%</span>
                      </div>
                      <Progress value={selectedMember.trainingProgress} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CLE Credits</span>
                        <span>{selectedMember.cleCredits}/{selectedMember.cleRequired}</span>
                      </div>
                      <Progress value={(selectedMember.cleCredits / selectedMember.cleRequired) * 100} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Professional Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-sm">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="btn-primary-gold">Assign Training</Button>
                <Button variant="outline">View Certificates</Button>
                <Button variant="outline">Send Reminder</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};