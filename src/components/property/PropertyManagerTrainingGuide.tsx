import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BarChart3, 
  Building, 
  Users, 
  FileText, 
  CreditCard, 
  Shield, 
  Settings, 
  Globe,
  Smartphone,
  HeadphonesIcon,
  Play,
  BookOpen,
  CheckCircle
} from 'lucide-react';

const trainingModules = [
  {
    id: 'navigation',
    title: 'Platform Navigation',
    icon: BarChart3,
    description: 'Learn to navigate the dashboard and key features',
    lessons: [
      'Dashboard overview and key metrics',
      'Properties tab - managing your portfolio',
      'Clients tab - family and advisor relationships',
      'Documents tab - secure file management',
      'Billing tab - invoicing and payments',
      'Analytics tab - performance insights',
      'Team tab - staff and vendor management',
      'Marketplace tab - your public profile'
    ]
  },
  {
    id: 'property-management',
    title: 'Property Management',
    icon: Building,
    description: 'Master property setup and management workflows',
    lessons: [
      'Adding new properties with photos and docs',
      'Editing property details and custom fields',
      'Assigning owners and family contacts',
      'Setting up maintenance schedules',
      'Managing tenant information and leases',
      'Property valuation and market data',
      'Insurance and compliance tracking'
    ]
  },
  {
    id: 'client-collaboration',
    title: 'Client Collaboration',
    icon: Users,
    description: 'Engage effectively with families and advisors',
    lessons: [
      'Secure messaging with clients and advisors',
      'Setting up automated reminders and alerts',
      'Sharing documents and reports securely',
      'Creating unique invitation links for families',
      'Managing permissions and access levels',
      'Scheduling meetings and property tours',
      'Collaborating on property decisions'
    ]
  },
  {
    id: 'billing-payments',
    title: 'Billing & Payments',
    icon: CreditCard,
    description: 'Streamline financial operations',
    lessons: [
      'Generating and customizing invoices',
      'Setting up automated rent reminders',
      'Processing payments and fees',
      'QuickBooks and Xero integration',
      'Late payment management',
      'Financial reporting and statements',
      'Tax document preparation'
    ]
  },
  {
    id: 'compliance-alerts',
    title: 'Compliance & Alerts',
    icon: Shield,
    description: 'Stay compliant and informed',
    lessons: [
      'State licensing requirements tracking',
      'Insurance certificate management',
      'Inspection schedule automation',
      'Compliance document storage',
      'Automated notification setup',
      'Audit trail and record keeping',
      'Regulatory updates and alerts'
    ]
  },
  {
    id: 'team-management',
    title: 'Team Management',
    icon: Settings,
    description: 'Organize your team and vendors',
    lessons: [
      'Adding team members and setting roles',
      'Permission levels and access control',
      'Onboarding new staff members',
      'Vendor and contractor management',
      'Maintenance team coordination',
      'Performance tracking and reviews',
      'Communication workflows'
    ]
  },
  {
    id: 'marketplace-listing',
    title: 'Marketplace Listing',
    icon: Globe,
    description: 'Optimize your public presence',
    lessons: [
      'Creating and updating your public profile',
      'Managing VIP and founding badges',
      'Responding to family inquiries',
      'Lead management and follow-up',
      'Service area and specialty settings',
      'Client testimonials and reviews',
      'Featured listing optimization'
    ]
  },
  {
    id: 'reporting-analytics',
    title: 'Reporting & Analytics',
    icon: BarChart3,
    description: 'Leverage data for better decisions',
    lessons: [
      'Occupancy rate tracking and trends',
      'Rent collection performance metrics',
      'Revenue per property analysis',
      'Maintenance efficiency reports',
      'Client satisfaction scores',
      'Market comparison data',
      'Custom report generation'
    ]
  },
  {
    id: 'mobile-tips',
    title: 'Mobile Best Practices',
    icon: Smartphone,
    description: 'Maximize productivity on mobile',
    lessons: [
      'Taking and uploading property photos',
      'Document scanning and upload',
      'Responding to messages on-the-go',
      'Approving payments and invoices',
      'Emergency notification handling',
      'Offline functionality features',
      'Mobile security best practices'
    ]
  },
  {
    id: 'support',
    title: 'Support & Resources',
    icon: HeadphonesIcon,
    description: 'Get help when you need it',
    lessons: [
      'Accessing the help center and FAQs',
      'Requesting live demos and training',
      'Submitting support tickets',
      'Using Linda AI assistant (24/7)',
      'Community forums and best practices',
      'Video tutorials and webinars',
      'Escalation procedures and contacts'
    ]
  }
];

export default function PropertyManagerTrainingGuide() {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [activeModule, setActiveModule] = useState('navigation');

  const toggleLessonComplete = (moduleId: string, lessonIndex: number) => {
    const lessonKey = `${moduleId}-${lessonIndex}`;
    const newCompleted = new Set(completedLessons);
    
    if (completedLessons.has(lessonKey)) {
      newCompleted.delete(lessonKey);
    } else {
      newCompleted.add(lessonKey);
    }
    
    setCompletedLessons(newCompleted);
  };

  const getModuleProgress = (moduleId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const completedCount = module.lessons.filter((_, index) => 
      completedLessons.has(`${moduleId}-${index}`)
    ).length;
    
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Property Manager Training Guide</h1>
        <p className="text-muted-foreground">
          Master the Family Office Marketplace platform with our comprehensive training modules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trainingModules.map((module) => {
                const Icon = module.icon;
                const progress = getModuleProgress(module.id);
                
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      activeModule === module.id
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{module.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-background/20 rounded-full h-1">
                            <div 
                              className="bg-current h-1 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Module Content */}
        <div className="lg:col-span-3">
          {trainingModules.map((module) => {
            if (module.id !== activeModule) return null;
            
            const Icon = module.icon;
            const progress = getModuleProgress(module.id);
            
            return (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <Badge variant="outline">{progress}% Complete</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {module.lessons.map((lesson, index) => {
                      const lessonKey = `${module.id}-${index}`;
                      const isCompleted = completedLessons.has(lessonKey);
                      
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-background'
                          }`}
                        >
                          <button
                            onClick={() => toggleLessonComplete(module.id, index)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isCompleted 
                                ? 'bg-green-600 border-green-600 text-white' 
                                : 'border-muted-foreground hover:border-primary'
                            }`}
                          >
                            {isCompleted && <CheckCircle className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1">
                            <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {lesson}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="w-3 h-3 mr-1" />
                              Video
                            </Button>
                            <Button size="sm" variant="outline">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Guide
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {progress === 100 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Module Complete!</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                        Congratulations! You've completed all lessons in this module.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <HeadphonesIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">Our support team is here 24/7</p>
            <Button size="sm" className="w-full">Contact Support</Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <Play className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <h3 className="font-semibold mb-1">Live Demo</h3>
            <p className="text-sm text-muted-foreground mb-3">Schedule a personalized walkthrough</p>
            <Button size="sm" className="w-full" variant="outline">Book Demo</Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <h3 className="font-semibold mb-1">Community</h3>
            <p className="text-sm text-muted-foreground mb-3">Connect with other professionals</p>
            <Button size="sm" className="w-full" variant="outline">Join Forum</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}