import React, { useState } from 'react';
import { AccountantNavigation } from '@/components/accountant/AccountantNavigation';
import { FileUploadWithValidation } from '@/components/accountant/FileUploadWithValidation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Plus,
  FileText,
  Calendar,
  Target,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

export default function AuditPrepPage() {
  const [selectedClient, setSelectedClient] = useState('');
  const [newChecklistName, setNewChecklistName] = useState('');

  const auditChecklists = [
    {
      id: '1',
      name: 'Year-End Financial Audit 2024',
      client: 'Smith Corporation',
      progress: 75,
      total_items: 20,
      completed_items: 15,
      due_date: '2024-04-15',
      status: 'in_progress'
    },
    {
      id: '2', 
      name: 'Tax Return Preparation Audit',
      client: 'Johnson LLC',
      progress: 45,
      total_items: 12,
      completed_items: 5,
      due_date: '2024-03-31',
      status: 'in_progress'
    },
    {
      id: '3',
      name: 'Compliance Review Q1',
      client: 'Davis Enterprises',
      progress: 100,
      total_items: 8,
      completed_items: 8,
      due_date: '2024-02-28',
      status: 'completed'
    }
  ];

  const checklistItems = [
    { id: '1', name: 'Bank reconciliations', completed: true, required: true },
    { id: '2', name: 'Accounts receivable aging', completed: true, required: true },
    { id: '3', name: 'Inventory counts and valuation', completed: false, required: true },
    { id: '4', name: 'Fixed asset register', completed: true, required: true },
    { id: '5', name: 'Payroll records review', completed: false, required: true },
    { id: '6', name: 'Tax compliance documentation', completed: false, required: true },
    { id: '7', name: 'Internal controls assessment', completed: false, required: false },
    { id: '8', name: 'Management representation letter', completed: false, required: true }
  ];

  const upcomingReminders = [
    { task: 'Submit Q1 audit workpapers', date: '2024-04-10', client: 'Smith Corp', priority: 'high' },
    { task: 'Schedule inventory count', date: '2024-04-05', client: 'Johnson LLC', priority: 'medium' },
    { task: 'Review management letter responses', date: '2024-04-15', client: 'Davis Enterprises', priority: 'low' }
  ];

  const handleFileUpload = async (file: File) => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Uploading ${file.name} to audit files`);
  };

  const createChecklist = () => {
    if (!newChecklistName.trim() || !selectedClient) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Audit checklist created', {
      description: `Created "${newChecklistName}" for ${selectedClient}`
    });
    setNewChecklistName('');
    setSelectedClient('');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 border-r p-6">
        <AccountantNavigation />
      </div>
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Audit Preparation</h1>
            <p className="text-muted-foreground">Manage audit checklists, document storage, and reminders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">23</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Stored</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">Audit files</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                <Clock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Deadlines approaching</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="checklists" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="checklists">Checklists</TabsTrigger>
              <TabsTrigger value="documents">Document Storage</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="create">Create Checklist</TabsTrigger>
            </TabsList>

            <TabsContent value="checklists" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Checklists</CardTitle>
                  <CardDescription>Track audit progress and completion status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditChecklists.map((checklist) => (
                      <div key={checklist.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{checklist.name}</h3>
                            <p className="text-sm text-muted-foreground">Client: {checklist.client}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={checklist.status === 'completed' ? 'default' : 'secondary'}>
                              {checklist.status === 'completed' ? 'Completed' : 'In Progress'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Due: {checklist.due_date}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{checklist.completed_items} of {checklist.total_items} items completed</span>
                            <span>{checklist.progress}%</span>
                          </div>
                          <Progress value={checklist.progress} className="w-full" />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">Add Items</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sample Checklist Items</CardTitle>
                  <CardDescription>Standard audit preparation items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={item.completed}
                          disabled
                        />
                        <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.name}
                        </span>
                        {item.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <FileUploadWithValidation
                onFileUpload={handleFileUpload}
                acceptedTypes={['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.txt']}
                maxSize={25}
                bucketName="accountant-audit-files"
                title="Audit Document Storage"
                description="Upload audit workpapers, supporting documents, and client files"
              />
            </TabsContent>

            <TabsContent value="reminders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Reminders
                  </CardTitle>
                  <CardDescription>Important audit deadlines and tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingReminders.map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            reminder.priority === 'high' ? 'bg-red-500' :
                            reminder.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="font-medium">{reminder.task}</p>
                            <p className="text-sm text-muted-foreground">{reminder.client}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{reminder.date}</p>
                          <Badge variant="outline" className="text-xs">
                            {reminder.priority} priority
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Audit Checklist
                  </CardTitle>
                  <CardDescription>Set up a new audit checklist for a client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checklist-name">Checklist Name</Label>
                      <Input
                        id="checklist-name"
                        placeholder="e.g., Year-End Audit 2024"
                        value={newChecklistName}
                        onChange={(e) => setNewChecklistName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-select">Select Client</Label>
                      <select
                        id="client-select"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="">Choose a client</option>
                        <option value="Smith Corporation">Smith Corporation</option>
                        <option value="Johnson LLC">Johnson LLC</option>
                        <option value="Davis Enterprises">Davis Enterprises</option>
                      </select>
                    </div>
                  </div>

                  <Button onClick={createChecklist} className="w-full">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Create Audit Checklist
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}