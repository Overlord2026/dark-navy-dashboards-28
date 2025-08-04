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
import { 
  GraduationCap, 
  Plus, 
  Upload, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BookOpen,
  Award,
  FileText,
  Download
} from 'lucide-react';

interface CETracking {
  id: string;
  userName: string;
  licenseType: string;
  licenseNumber: string;
  licenseState: string;
  periodStart: string;
  periodEnd: string;
  requiredHours: number;
  completedHours: number;
  ethicsRequired: number;
  ethicsCompleted: number;
  status: 'on_track' | 'at_risk' | 'behind' | 'non_compliant';
  completions: CECompletion[];
}

interface CECompletion {
  id: string;
  courseName: string;
  provider: string;
  completionDate: string;
  hoursEarned: number;
  ethicsHours: number;
  certificateUrl?: string;
  courseType: string;
}

export const CETrackingModule: React.FC = () => {
  const [ceTracking] = useState<CETracking[]>([
    {
      id: '1',
      userName: 'Sarah Johnson',
      licenseType: 'Investment Adviser Representative',
      licenseNumber: 'IAR-12345',
      licenseState: 'CA',
      periodStart: '2024-01-01',
      periodEnd: '2024-12-31',
      requiredHours: 20,
      completedHours: 14,
      ethicsRequired: 4,
      ethicsCompleted: 2,
      status: 'on_track',
      completions: [
        {
          id: '1',
          courseName: 'Fiduciary Responsibilities in Investment Management',
          provider: 'CFP Board',
          completionDate: '2024-01-15',
          hoursEarned: 6,
          ethicsHours: 2,
          certificateUrl: '/certificates/cert-1.pdf',
          courseType: 'Ethics'
        },
        {
          id: '2',
          courseName: 'Modern Portfolio Theory and Risk Management',
          provider: 'Investment Academy',
          completionDate: '2024-02-20',
          hoursEarned: 8,
          ethicsHours: 0,
          certificateUrl: '/certificates/cert-2.pdf',
          courseType: 'Technical'
        }
      ]
    },
    {
      id: '2',
      userName: 'Mike Chen',
      licenseType: 'Certified Financial Planner',
      licenseNumber: 'CFP-67890',
      licenseState: 'NY',
      periodStart: '2024-01-01',
      periodEnd: '2024-12-31',
      requiredHours: 30,
      completedHours: 8,
      ethicsRequired: 2,
      ethicsCompleted: 0,
      status: 'behind',
      completions: [
        {
          id: '3',
          courseName: 'Tax Planning Strategies for 2024',
          provider: 'Tax Institute',
          completionDate: '2024-01-10',
          hoursEarned: 8,
          ethicsHours: 0,
          courseType: 'Technical'
        }
      ]
    }
  ]);

  const [selectedPerson, setSelectedPerson] = useState<CETracking | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge variant="default" className="bg-success">On Track</Badge>;
      case 'at_risk':
        return <Badge variant="default" className="bg-warning">At Risk</Badge>;
      case 'behind':
        return <Badge variant="destructive">Behind</Badge>;
      case 'non_compliant':
        return <Badge variant="destructive">Non-Compliant</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const calculateProgress = (completed: number, required: number) => {
    return Math.min((completed / required) * 100, 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Continuing Education Tracker</h2>
            <p className="text-muted-foreground">Monitor CE requirements and track course completions</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Add Completion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Course Completion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="staff-member">Staff Member</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {ceTracking.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.userName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course-name">Course Name</Label>
                  <Input id="course-name" placeholder="Enter course name..." />
                </div>
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Input id="provider" placeholder="Course provider..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hours">Hours Earned</Label>
                    <Input id="hours" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="ethics-hours">Ethics Hours</Label>
                    <Input id="ethics-hours" type="number" placeholder="0" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="completion-date">Completion Date</Label>
                  <Input id="completion-date" type="date" />
                </div>
                <Button className="w-full btn-primary-gold">Add Completion</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button className="btn-primary-gold">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">CE Overview</TabsTrigger>
          <TabsTrigger value="individuals">Individual Tracking</TabsTrigger>
          <TabsTrigger value="courses">Course Library</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ceTracking.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Tracked individuals</p>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">On Track</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {ceTracking.filter(p => p.status === 'on_track').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Meeting requirements</p>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {ceTracking.filter(p => ['at_risk', 'behind'].includes(p.status)).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Need attention</p>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {ceTracking.filter(p => p.status === 'non_compliant').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Immediate action</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ceTracking.map((person) => {
              const progress = calculateProgress(person.completedHours, person.requiredHours);
              const ethicsProgress = calculateProgress(person.ethicsCompleted, person.ethicsRequired);
              const daysRemaining = getDaysRemaining(person.periodEnd);

              return (
                <Card 
                  key={person.id} 
                  className="premium-card cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPerson(person)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{person.userName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{person.licenseType}</p>
                        <p className="text-xs text-muted-foreground">{person.licenseNumber} • {person.licenseState}</p>
                      </div>
                      {getStatusBadge(person.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>CE Hours Progress</span>
                        <span>{person.completedHours} / {person.requiredHours} hours</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Ethics Hours</span>
                        <span>{person.ethicsCompleted} / {person.ethicsRequired} hours</span>
                      </div>
                      <Progress value={ethicsProgress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Period Ends:
                      </span>
                      <span className={daysRemaining < 90 ? 'text-warning font-medium' : ''}>
                        {new Date(person.periodEnd).toLocaleDateString()}
                        {daysRemaining > 0 && ` (${daysRemaining} days)`}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {person.completions.length} course{person.completions.length !== 1 ? 's' : ''} completed
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="individuals">
          <div className="space-y-4">
            {ceTracking.map((person) => (
              <Card key={person.id} className="premium-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {person.userName}
                        {getStatusBadge(person.status)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {person.licenseType} • {person.licenseNumber}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">CE Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Hours:</span>
                          <span>{person.completedHours} / {person.requiredHours}</span>
                        </div>
                        <Progress value={calculateProgress(person.completedHours, person.requiredHours)} />
                        <div className="flex justify-between text-sm">
                          <span>Ethics Hours:</span>
                          <span>{person.ethicsCompleted} / {person.ethicsRequired}</span>
                        </div>
                        <Progress value={calculateProgress(person.ethicsCompleted, person.ethicsRequired)} />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recent Completions</h4>
                      <div className="space-y-2">
                        {person.completions.slice(0, 2).map((completion) => (
                          <div key={completion.id} className="text-sm">
                            <div className="font-medium">{completion.courseName}</div>
                            <div className="text-muted-foreground">
                              {completion.hoursEarned} hours • {completion.provider}
                            </div>
                          </div>
                        ))}
                        {person.completions.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{person.completions.length - 2} more courses
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Compliance Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-success rounded-full" />
                          <span>Period started: {new Date(person.periodStart).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-warning rounded-full" />
                          <span>Period ends: {new Date(person.periodEnd).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{getDaysRemaining(person.periodEnd)} days remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Ethics & Professional Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive ethics training covering fiduciary responsibilities and professional conduct.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">4 CE Hours • 4 Ethics</Badge>
                  <Button variant="outline" size="sm">Enroll</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Investment Management Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Latest updates in investment management practices and regulatory changes.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">6 CE Hours</Badge>
                  <Button variant="outline" size="sm">Enroll</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cybersecurity for Financial Firms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Essential cybersecurity training for financial services professionals.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">2 CE Hours</Badge>
                  <Button variant="outline" size="sm">Enroll</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>CE Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Staff CE Compliance Summary</h4>
                    <p className="text-sm text-muted-foreground">Current period compliance status for all staff</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Individual CE Transcripts</h4>
                    <p className="text-sm text-muted-foreground">Detailed course completion records by person</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Upcoming Requirements Report</h4>
                    <p className="text-sm text-muted-foreground">Staff members approaching CE deadlines</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Individual Detail Modal */}
      {selectedPerson && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedPerson.userName} - CE Tracking
                {getStatusBadge(selectedPerson.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {selectedPerson.completedHours}/{selectedPerson.requiredHours}
                  </div>
                  <div className="text-sm text-muted-foreground">CE Hours</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedPerson.ethicsCompleted}/{selectedPerson.ethicsRequired}
                  </div>
                  <div className="text-sm text-muted-foreground">Ethics Hours</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{getDaysRemaining(selectedPerson.periodEnd)}</div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Course Completions</h4>
                <div className="space-y-3">
                  {selectedPerson.completions.map((completion) => (
                    <div key={completion.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{completion.courseName}</h5>
                        <p className="text-sm text-muted-foreground">{completion.provider}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Completed: {new Date(completion.completionDate).toLocaleDateString()}</span>
                          <span>Hours: {completion.hoursEarned}</span>
                          {completion.ethicsHours > 0 && <span>Ethics: {completion.ethicsHours}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{completion.courseType}</Badge>
                        {completion.certificateUrl && (
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="btn-primary-gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Transcript
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};