import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Download, 
  Calendar, 
  BookOpen,
  Users,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { useInsuranceAgent } from '@/hooks/useInsuranceAgent';
import { AgentStatusCard } from '@/components/insurance/AgentStatusCard';
import { CEProgressTracker } from '@/components/insurance/CEProgressTracker';
import { CECoursesTable } from '@/components/insurance/CECoursesTable';
import { AddCourseModal } from '@/components/insurance/AddCourseModal';
import { ComplianceAlertsPanel } from '@/components/insurance/ComplianceAlertsPanel';
import { useCelebration } from '@/hooks/useCelebration';
import { toast } from 'sonner';

export const InsuranceCEDashboard: React.FC = () => {
  const { 
    agent, 
    courses, 
    reminders, 
    isLoading, 
    addCourse, 
    getDaysUntilExpiry, 
    getDaysUntilPeriodEnd, 
    getCEProgress 
  } = useInsuranceAgent();
  
  const { triggerCelebration, celebration } = useCelebration();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const daysUntilExpiry = getDaysUntilExpiry();
  const daysUntilPeriodEnd = getDaysUntilPeriodEnd();
  const ceProgress = getCEProgress();

  const handleAddCourse = async (courseData: any) => {
    try {
      await addCourse(courseData);
      
      // Trigger celebration if they completed a significant milestone
      const newProgress = getCEProgress();
      if (newProgress.percentage >= 100 && ceProgress.percentage < 100) {
        setTimeout(() => {
          triggerCelebration('success', 'CE Requirements Complete! 🎉');
        }, 500);
      }
      
      setShowAddCourse(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDownloadReport = () => {
    if (!agent) return;

    const reportData = {
      agent: {
        name: agent.name,
        license_type: agent.license_type,
        license_number: agent.license_number,
        state: agent.state,
        license_expiry: agent.license_expiry?.toLocaleDateString(),
        status: agent.status
      },
      ceProgress: {
        credits_completed: agent.ce_credits_completed,
        credits_required: agent.ce_credits_required,
        percentage: ceProgress.percentage,
        status: ceProgress.status
      },
      courses: courses.map(course => ({
        course_name: course.course_name,
        course_type: course.course_type,
        provider_name: course.provider_name,
        completion_date: course.completion_date?.toLocaleDateString(),
        credits_earned: course.credits_earned,
        verified: course.verified
      })),
      compliance_summary: {
        license_days_remaining: daysUntilExpiry,
        ce_period_days_remaining: daysUntilPeriodEnd,
        pending_verifications: courses.filter(c => !c.verified).length,
        active_reminders: reminders.length
      },
      generated_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ce-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Compliance report downloaded successfully!');
  };

  const handleBookCompliance = () => {
    toast.info('Redirecting to compliance booking system...');
    // In a real app, this would redirect to a booking system
  };

  if (isLoading) {
    return (
      <AuthWrapper requireAuth={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your CE dashboard...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  if (!agent) {
    return (
      <AuthWrapper requireAuth={true}>
        <div className="container mx-auto py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Setup Your Agent Profile</h2>
              <p className="text-muted-foreground mb-6">
                Complete your insurance agent profile to start tracking CE requirements.
              </p>
              <Button className="bg-navy hover:bg-navy/90 text-navy-foreground">
                Setup Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Celebration Effect */}
        {celebration.isActive && (
          <div className="celebration-container">
            <div className="confetti-gold"></div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-navy">
              Insurance CE & Compliance Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your continuing education progress and compliance requirements
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={handleDownloadReport}
              className="border-emerald text-emerald hover:bg-emerald hover:text-emerald-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button 
              onClick={handleBookCompliance}
              className="bg-gold hover:bg-gold/90 text-gold-foreground"
            >
              <Users className="h-4 w-4 mr-2" />
              Book Compliance Review
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald" />
                <div>
                  <p className="text-2xl font-bold text-emerald">
                    {agent.ce_credits_completed}
                  </p>
                  <p className="text-xs text-muted-foreground">Credits Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-navy" />
                <div>
                  <p className="text-2xl font-bold text-navy">
                    {courses.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Courses Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-gold" />
                <div>
                  <p className="text-2xl font-bold text-gold">
                    {daysUntilExpiry !== null && daysUntilExpiry > 0 ? daysUntilExpiry : '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">Days to Renewal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-emerald" />
                <div>
                  <p className="text-2xl font-bold text-emerald">
                    {ceProgress.percentage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">CE Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              CE Courses
            </TabsTrigger>
            <TabsTrigger 
              value="compliance"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="resources"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <AgentStatusCard 
                  agent={agent}
                  daysUntilExpiry={daysUntilExpiry}
                  onEditProfile={() => toast.info('Edit profile feature coming soon!')}
                />
                <CEProgressTracker 
                  creditsCompleted={agent.ce_credits_completed}
                  creditsRequired={agent.ce_credits_required}
                  periodEnd={agent.ce_reporting_period_end}
                  status={ceProgress.status}
                />
              </div>
              <div>
                <ComplianceAlertsPanel 
                  reminders={reminders}
                  daysUntilExpiry={daysUntilExpiry}
                  ceProgress={ceProgress}
                  unverifiedCourses={courses.filter(c => !c.verified).length}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CECoursesTable 
              courses={courses}
              onAddCourse={() => setShowAddCourse(true)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">State Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-navy/5 rounded-lg">
                      <h4 className="font-medium text-navy">Required CE Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        {agent.state} requires {agent.ce_credits_required} CE hours for {agent.license_type} licenses
                      </p>
                    </div>
                    <div className="p-4 bg-emerald/5 rounded-lg">
                      <h4 className="font-medium text-emerald">Ethics Requirement</h4>
                      <p className="text-sm text-muted-foreground">
                        3 hours of ethics training required per reporting period
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Compliance Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gold text-gold hover:bg-gold hover:text-gold-foreground"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Renewal Reminder
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald text-emerald hover:bg-emerald hover:text-emerald-foreground"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Find CE Courses
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-navy text-navy hover:bg-navy hover:text-navy-foreground"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View State Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald">CE Providers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Approved training providers for {agent.state}</p>
                  <ul className="text-sm space-y-1">
                    <li>• WebCE</li>
                    <li>• National Underwriter</li>
                    <li>• Kaplan Financial</li>
                    <li>• ExamFX</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">State Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Official {agent.state} insurance department links</p>
                  <ul className="text-sm space-y-1">
                    <li>• License Lookup</li>
                    <li>• CE Requirements</li>
                    <li>• Renewal Forms</li>
                    <li>• Contact Information</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gold">Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Get help with compliance questions</p>
                  <Button 
                    size="sm" 
                    className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                    onClick={handleBookCompliance}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Course Modal */}
        <AddCourseModal 
          isOpen={showAddCourse}
          onClose={() => setShowAddCourse(false)}
          onSubmit={handleAddCourse}
          isLoading={false}
        />
      </div>
    </AuthWrapper>
  );
};