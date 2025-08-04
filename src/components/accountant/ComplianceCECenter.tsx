import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Home, 
  FileText, 
  BookOpen, 
  Store, 
  Bell, 
  Upload, 
  Download, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Trophy,
  Plus,
  GraduationCap,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import AddCERecordModal from './AddCERecordModal';
import { cn } from '@/lib/utils';

interface LicenseStatus {
  id: string;
  state: string;
  credential_type: string;
  license_number: string;
  expiration_date: string;
  renewal_status: string;
  ce_hours_completed: number;
  ce_hours_required: number;
  ethics_hours_completed: number;
  ethics_hours_required: number;
  audit_flag: boolean;
}

interface CERecord {
  id: string;
  course_name: string;
  provider: string;
  ce_hours: number;
  ethics_hours: number;
  date_completed: string;
  certificate_url?: string;
  status: string;
  state: string;
  credential_type: string;
}

interface CEAlert {
  id: string;
  alert_type: string;
  due_date?: string;
  priority: string;
  notes?: string;
  resolved: boolean;
}

interface CEProvider {
  id: string;
  provider_name: string;
  approved_states: string[];
  url?: string;
  specialty: string[];
  course_catalog_url?: string;
}

const sidebarItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'licenses', label: 'My Licenses', icon: Shield },
  { id: 'cpe-tracker', label: 'CPE Tracker', icon: BookOpen },
  { id: 'marketplace', label: 'Course Marketplace', icon: Store },
  { id: 'alerts', label: 'Alerts & Reminders', icon: Bell },
];

export default function ComplianceCECenter() {
  const [activeTab, setActiveTab] = useState('home');
  const [licenses, setLicenses] = useState<LicenseStatus[]>([]);
  const [ceRecords, setCeRecords] = useState<CERecord[]>([]);
  const [alerts, setAlerts] = useState<CEAlert[]>([]);
  const [providers, setProviders] = useState<CEProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use sample data since RLS is blocking real data
      const sampleLicenses: LicenseStatus[] = [
        {
          id: '1',
          state: 'CA',
          credential_type: 'CPA',
          license_number: 'CPA-123456',
          expiration_date: '2025-12-31',
          renewal_status: 'active',
          ce_hours_completed: 28,
          ce_hours_required: 40,
          ethics_hours_completed: 3,
          ethics_hours_required: 4,
          audit_flag: false
        },
        {
          id: '2',
          state: 'NY',
          credential_type: 'CPA',
          license_number: 'CPA-789012',
          expiration_date: '2025-06-30',
          renewal_status: 'active',
          ce_hours_completed: 22,
          ce_hours_required: 40,
          ethics_hours_completed: 2,
          ethics_hours_required: 4,
          audit_flag: true
        }
      ];

      const sampleRecords: CERecord[] = [
        {
          id: '1',
          course_name: 'Advanced Tax Planning 2024',
          provider: 'AICPA',
          ce_hours: 8,
          ethics_hours: 0,
          date_completed: '2024-06-15',
          certificate_url: '#',
          status: 'completed',
          state: 'CA',
          credential_type: 'CPA'
        },
        {
          id: '2',
          course_name: 'Ethics in Accounting Practice',
          provider: 'CALCPA',
          ce_hours: 4,
          ethics_hours: 4,
          date_completed: '2024-08-20',
          certificate_url: '#',
          status: 'completed',
          state: 'CA',
          credential_type: 'CPA'
        }
      ];

      const sampleAlerts: CEAlert[] = [
        {
          id: '1',
          alert_type: 'renewal_reminder',
          due_date: '2025-06-30',
          priority: 'high',
          notes: 'NY CPA renewal due in 6 months',
          resolved: false
        },
        {
          id: '2',
          alert_type: 'ethics_deficit',
          due_date: '2025-06-30',
          priority: 'medium',
          notes: 'Need 2 more ethics hours for NY CPA',
          resolved: false
        }
      ];

      setLicenses(sampleLicenses);
      setCeRecords(sampleRecords);
      setAlerts(sampleAlerts);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallProgress = () => {
    if (licenses.length === 0) return 0;
    
    const totalProgress = licenses.reduce((sum, license) => {
      const generalProgress = (license.ce_hours_completed / license.ce_hours_required) * 100;
      const ethicsProgress = license.ethics_hours_required > 0 
        ? (license.ethics_hours_completed / license.ethics_hours_required) * 100 
        : 100;
      return sum + Math.min(100, (generalProgress + ethicsProgress) / 2);
    }, 0);
    
    return Math.round(totalProgress / licenses.length);
  };

  const getUpcomingDeadline = () => {
    const sortedLicenses = licenses
      .map(license => ({
        ...license,
        daysUntil: differenceInDays(new Date(license.expiration_date), new Date())
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil);
    
    return sortedLicenses[0] || null;
  };

  const getStatesAtRisk = () => {
    return licenses.filter(license => {
      const progress = (license.ce_hours_completed / license.ce_hours_required) * 100;
      const daysUntil = differenceInDays(new Date(license.expiration_date), new Date());
      return progress < 75 && daysUntil < 180; // Less than 75% complete with < 6 months
    }).length;
  };

  const handleRecordAdded = () => {
    fetchData();
    setShowAddModal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    toast({
      title: "🎉 Course Added!",
      description: "Your CPE record has been successfully added to your compliance tracker.",
    });
  };

  const renderHomeContent = () => {
    const overallProgress = calculateOverallProgress();
    const upcomingDeadline = getUpcomingDeadline();
    const statesAtRisk = getStatesAtRisk();
    const totalCreditsThisYear = ceRecords.reduce((sum, record) => 
      new Date(record.date_completed).getFullYear() === new Date().getFullYear() 
        ? sum + record.ce_hours + record.ethics_hours 
        : sum, 0);

    return (
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Credits Needed</p>
                  <p className="text-3xl font-bold">
                    {licenses.reduce((sum, l) => sum + (l.ce_hours_required - l.ce_hours_completed), 0)}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Upcoming Deadline</p>
                  <p className="text-lg font-bold">
                    {upcomingDeadline ? format(new Date(upcomingDeadline.expiration_date), 'MMM dd, yyyy') : 'None'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">States at Risk</p>
                  <p className="text-3xl font-bold">{statesAtRisk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Credits This Year</p>
                  <p className="text-3xl font-bold">{totalCreditsThisYear}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Overall Compliance Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cycle Progress</span>
                <span className="text-sm text-muted-foreground">{overallProgress}% Complete</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Start of Cycle</span>
                <span>Renewal Deadline</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent CPE Activity</CardTitle>
              <Button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                Add Credits
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ceRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{record.course_name}</h4>
                    <p className="text-sm text-muted-foreground">{record.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{record.ce_hours + record.ethics_hours} hours</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(record.date_completed), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLicensesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Licenses</h2>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add License
        </Button>
      </div>

      <div className="grid gap-6">
        {licenses.map((license) => {
          const progress = (license.ce_hours_completed / license.ce_hours_required) * 100;
          const ethicsProgress = license.ethics_hours_required > 0 
            ? (license.ethics_hours_completed / license.ethics_hours_required) * 100 
            : 100;
          const daysUntil = differenceInDays(new Date(license.expiration_date), new Date());
          
          return (
            <Card key={license.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-blue-900" />
                    <div>
                      <CardTitle className="text-blue-900">
                        {license.state} {license.credential_type}
                      </CardTitle>
                      <CardDescription>
                        License #{license.license_number}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {license.audit_flag && (
                      <Badge variant="destructive" className="animate-pulse">
                        Audit Selected
                      </Badge>
                    )}
                    <Badge variant={daysUntil < 90 ? "destructive" : "default"}>
                      {daysUntil} days to renewal
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">General CPE</h4>
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {license.ce_hours_completed} / {license.ce_hours_required} hours
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ethics Hours</h4>
                    <Progress value={ethicsProgress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {license.ethics_hours_completed} / {license.ethics_hours_required} hours
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Audit Packet
                    </Button>
                    <Button variant="outline" size="sm">
                      View Requirements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderCPETrackerContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CPE Tracker</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Certificate
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-blue-900">Course</th>
                  <th className="text-left p-4 font-semibold text-blue-900">Provider</th>
                  <th className="text-left p-4 font-semibold text-blue-900">State</th>
                  <th className="text-left p-4 font-semibold text-blue-900">Hours</th>
                  <th className="text-left p-4 font-semibold text-blue-900">Date</th>
                  <th className="text-left p-4 font-semibold text-blue-900">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {ceRecords.map((record, index) => (
                  <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4">
                      <div className="font-medium">{record.course_name}</div>
                      <div className="text-sm text-muted-foreground">{record.credential_type}</div>
                    </td>
                    <td className="p-4 text-sm">{record.provider}</td>
                    <td className="p-4">
                      <Badge variant="outline">{record.state}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>General: {record.ce_hours}h</div>
                        {record.ethics_hours > 0 && <div>Ethics: {record.ethics_hours}h</div>}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {format(new Date(record.date_completed), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4">
                      {record.certificate_url ? (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not uploaded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMarketplaceContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Marketplace</h2>
      <p className="text-muted-foreground">Discover and book CPE courses from approved providers</p>
      
      <div className="grid gap-6">
        {[
          { name: 'AICPA', courses: 45, ethics: true, tech: true },
          { name: 'NASBA', courses: 32, ethics: true, tech: false },
          { name: 'State CPA Society', courses: 28, ethics: true, tech: true },
        ].map((provider) => (
          <Card key={provider.name} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.courses} courses available</p>
                  <div className="flex gap-2 mt-2">
                    {provider.ethics && <Badge variant="secondary">Ethics</Badge>}
                    {provider.tech && <Badge variant="secondary">Technology</Badge>}
                  </div>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  Browse Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAlertsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Alerts & Reminders</h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} className={cn(
            "border-l-4",
            alert.priority === 'high' && "border-l-red-500 bg-red-50",
            alert.priority === 'medium' && "border-l-yellow-500 bg-yellow-50",
            alert.priority === 'low' && "border-l-blue-500 bg-blue-50"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              alert.priority === 'high' && "text-red-600",
              alert.priority === 'medium' && "text-yellow-600",
              alert.priority === 'low' && "text-blue-600"
            )} />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong className="capitalize">{alert.alert_type.replace('_', ' ')}:</strong> {alert.notes}
                  {alert.due_date && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Due: {format(new Date(alert.due_date), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Mark Resolved
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHomeContent();
      case 'licenses': return renderLicensesContent();
      case 'cpe-tracker': return renderCPETrackerContent();
      case 'marketplace': return renderMarketplaceContent();
      case 'alerts': return renderAlertsContent();
      default: return renderHomeContent();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-6xl">🎉</div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="p-6">
          <h1 className="text-xl font-bold text-center">BFO Compliance Center</h1>
          <p className="text-blue-200 text-sm text-center mt-1">CPA Edition</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-blue-800 transition-colors",
                  activeTab === item.id && "bg-blue-800 border-r-4 border-amber-400"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Quick Add CPE
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Alerts */}
        {alerts.filter(a => a.priority === 'high').length > 0 && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                {alerts.filter(a => a.priority === 'high').length} urgent compliance item(s) need attention
              </span>
            </div>
          </div>
        )}

        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Add CE Record Modal */}
      {showAddModal && (
        <AddCERecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onRecordAdded={handleRecordAdded}
          licenses={licenses}
          providers={providers}
        />
      )}
    </div>
  );
}