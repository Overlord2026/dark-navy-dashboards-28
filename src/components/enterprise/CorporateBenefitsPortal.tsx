import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Gift, 
  Upload,
  Download,
  FileText,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Target,
  Heart,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmployeeBenefit {
  id: string;
  employeeId: string;
  employeeName: string;
  email: string;
  department: string;
  enrollmentDate: string;
  tier: 'basic' | 'premium';
  status: 'active' | 'pending' | 'expired';
  lastLogin?: string;
}

interface BenefitsProgram {
  id: string;
  programName: string;
  description: string;
  eligibleEmployees: number;
  enrolledEmployees: number;
  monthlyBudget: number;
  tier: 'basic' | 'premium' | 'enterprise';
  features: string[];
}

export function CorporateBenefitsPortal() {
  const { userProfile } = useUser();
  const [activePrograms, setActivePrograms] = useState<BenefitsProgram[]>([
    {
      id: '1',
      programName: 'Employee Financial Wellness',
      description: 'Comprehensive financial planning and wellness benefits for all full-time employees',
      eligibleEmployees: 250,
      enrolledEmployees: 186,
      monthlyBudget: 12500,
      tier: 'premium',
      features: ['Financial Planning', 'Tax Preparation', 'Investment Guidance', 'Estate Planning Basics']
    },
    {
      id: '2',
      programName: 'Executive Family Office',
      description: 'Premium family office services for C-level executives and senior management',
      eligibleEmployees: 15,
      enrolledEmployees: 12,
      monthlyBudget: 7500,
      tier: 'enterprise',
      features: ['Full Family Office Access', 'Dedicated Advisor', 'Tax Optimization', 'Estate Planning', 'Concierge Services']
    }
  ]);

  const [employeeBenefits, setEmployeeBenefits] = useState<EmployeeBenefit[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      department: 'Engineering',
      enrollmentDate: '2024-01-15',
      tier: 'premium',
      status: 'active',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Michael Chen',
      email: 'michael.c@company.com',
      department: 'Marketing',
      enrollmentDate: '2024-01-10',
      tier: 'basic',
      status: 'active',
      lastLogin: '2024-01-19'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Jennifer Williams',
      email: 'jennifer.w@company.com',
      department: 'Finance',
      enrollmentDate: '2024-01-05',
      tier: 'premium',
      status: 'pending'
    }
  ]);

  const [bulkUploadData, setBulkUploadData] = useState({
    file: null as File | null,
    department: '',
    tier: 'basic' as 'basic' | 'premium',
    autoEnroll: false
  });

  const handleBulkUpload = async () => {
    if (!bulkUploadData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      // Process CSV file (simplified for demo)
      const fileContent = await bulkUploadData.file.text();
      const lines = fileContent.split('\n');
      const employees = lines.slice(1).map(line => {
        const [name, email, department, employeeId] = line.split(',');
        return { name: name?.trim(), email: email?.trim(), department: department?.trim(), employeeId: employeeId?.trim() };
      }).filter(emp => emp.name && emp.email);

      // Create benefit records for each employee (simplified for demo)
      for (const employee of employees) {
        console.log('Would create benefit record for:', employee);
      }

      toast.success(`Successfully processed ${employees.length} employee records`);
      setBulkUploadData({ file: null, department: '', tier: 'basic', autoEnroll: false });
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Failed to process bulk upload');
    }
  };

  const handleSendWelcomeEmails = async () => {
    try {
      const pendingEmployees = employeeBenefits.filter(emp => emp.status === 'pending');
      
      for (const employee of pendingEmployees) {
        const { error } = await supabase.functions.invoke('send-benefits-welcome-email', {
          body: {
            to: employee.email,
            employeeName: employee.employeeName,
            tier: employee.tier,
            companyName: userProfile?.tenant_id // This would be company name
          }
        });

        if (error) {
          console.error('Email send error:', error);
        }
      }

      toast.success(`Welcome emails sent to ${pendingEmployees.length} employees`);
    } catch (error) {
      console.error('Email sending error:', error);
      toast.error('Failed to send welcome emails');
    }
  };

  const renderProgramOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold">{activePrograms.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled Employees</p>
                <p className="text-2xl font-bold">
                  {activePrograms.reduce((sum, prog) => sum + prog.enrolledEmployees, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Budget</p>
                <p className="text-2xl font-bold">
                  ${activePrograms.reduce((sum, prog) => sum + prog.monthlyBudget, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrollment Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((activePrograms.reduce((sum, prog) => sum + prog.enrolledEmployees, 0) / 
                    activePrograms.reduce((sum, prog) => sum + prog.eligibleEmployees, 0)) * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Programs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Benefits Programs</h3>
        {activePrograms.map((program) => (
          <Card key={program.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{program.programName}</h4>
                    <Badge 
                      variant={program.tier === 'enterprise' ? 'default' : program.tier === 'premium' ? 'secondary' : 'outline'}
                    >
                      {program.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Eligible Employees</p>
                      <p className="font-semibold">{program.eligibleEmployees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Enrolled</p>
                      <p className="font-semibold">{program.enrolledEmployees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Enrollment Rate</p>
                      <p className="font-semibold">
                        {Math.round((program.enrolledEmployees / program.eligibleEmployees) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Budget</p>
                      <p className="font-semibold">${program.monthlyBudget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="gap-2 h-auto p-4 flex-col">
              <Gift className="w-6 h-6" />
              <span>Create New Program</span>
              <span className="text-xs text-muted-foreground">Set up employee benefits</span>
            </Button>

            <Button variant="outline" onClick={handleSendWelcomeEmails} className="gap-2 h-auto p-4 flex-col">
              <Mail className="w-6 h-6" />
              <span>Send Welcome Emails</span>
              <span className="text-xs text-muted-foreground">Notify pending employees</span>
            </Button>

            <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
              <FileText className="w-6 h-6" />
              <span>Generate Report</span>
              <span className="text-xs text-muted-foreground">Program analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmployeeManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="gap-2">
            <Users className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Employee Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setBulkUploadData({ 
                  ...bulkUploadData, 
                  file: e.target.files?.[0] || null 
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Department</Label>
              <Select 
                value={bulkUploadData.department} 
                onValueChange={(value) => setBulkUploadData({ ...bulkUploadData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Tier</Label>
              <Select 
                value={bulkUploadData.tier} 
                onValueChange={(value: 'basic' | 'premium') => setBulkUploadData({ ...bulkUploadData, tier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="invisible">Actions</Label>
              <Button onClick={handleBulkUpload} className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-enroll"
              checked={bulkUploadData.autoEnroll}
              onChange={(e) => setBulkUploadData({ ...bulkUploadData, autoEnroll: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="auto-enroll" className="text-sm">
              Auto-enroll employees (otherwise they'll receive invitation emails)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeBenefits.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold">
                    {employee.employeeName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{employee.employeeName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{employee.email}</span>
                      <span>{employee.department}</span>
                      <span>ID: {employee.employeeId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge 
                    variant={employee.tier === 'premium' ? 'default' : 'outline'}
                  >
                    {employee.tier}
                  </Badge>
                  <Badge 
                    variant={employee.status === 'active' ? 'default' : employee.status === 'pending' ? 'secondary' : 'outline'}
                  >
                    {employee.status}
                  </Badge>
                  {employee.status === 'active' && employee.lastLogin && (
                    <span className="text-xs text-muted-foreground">
                      Last login: {employee.lastLogin}
                    </span>
                  )}
                  <Button variant="ghost" size="sm">
                    Actions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Program Analytics</h2>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Program Utilization</p>
                <p className="text-2xl font-bold">74%</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employee Satisfaction</p>
                <p className="text-2xl font-bold">4.6/5</p>
                <p className="text-xs text-green-600">+0.2 from last quarter</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Per Employee</p>
                <p className="text-2xl font-bold">$67</p>
                <p className="text-xs text-green-600">-8% from budget</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { dept: 'Engineering', enrolled: 42, total: 58, rate: 72 },
              { dept: 'Marketing', enrolled: 28, total: 35, rate: 80 },
              { dept: 'Finance', enrolled: 18, total: 22, rate: 82 },
              { dept: 'Operations', enrolled: 35, total: 48, rate: 73 },
              { dept: 'HR', enrolled: 8, total: 10, rate: 80 }
            ].map((dept) => (
              <div key={dept.dept} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16">
                    <p className="font-medium">{dept.dept}</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{dept.enrolled}/{dept.total}</p>
                  <p className="text-sm text-muted-foreground">{dept.rate}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Program ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Platform Fees</span>
                  <span>$8,500/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin Costs</span>
                  <span>$2,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Features</span>
                  <span>$4,500/month</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>$15,000/month</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Estimated Benefits</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Reduced Turnover</span>
                  <span>$18,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Increased Productivity</span>
                  <span>$12,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Employee Satisfaction</span>
                  <span>$8,000/month</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-green-600">
                  <span>Total ROI</span>
                  <span>+$23,000/month</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Corporate Benefits Portal</h1>
              <p className="text-navy-600 mt-1">
                Manage employee benefits and family office access programs
              </p>
            </div>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <Award className="w-4 h-4" />
              Enterprise Benefits
            </Badge>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <Building2 className="w-4 h-4" />
              Program Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="w-4 h-4" />
              Employee Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="overview">
              {renderProgramOverview()}
            </TabsContent>

            <TabsContent value="employees">
              {renderEmployeeManagement()}
            </TabsContent>

            <TabsContent value="analytics">
              {renderAnalytics()}
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}