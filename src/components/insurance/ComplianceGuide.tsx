import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Shield, 
  Calendar, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  User,
  BarChart3,
  Bell,
  Eye,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const stateDeadlines = [
  { state: 'CA', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'TX', deadline: 'Dec 31', period: '2-year cycle', ethics: '2 hrs', total: '20 hrs' },
  { state: 'FL', deadline: 'Jul 31', period: '2-year cycle', ethics: '5 hrs', total: '20 hrs' },
  { state: 'NY', deadline: 'Sep 30', period: '2-year cycle', ethics: '3 hrs', total: '15 hrs' },
  { state: 'IL', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '15 hrs' },
  { state: 'PA', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'OH', deadline: 'Sep 30', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'GA', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '20 hrs' },
  { state: 'NC', deadline: 'Jun 30', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'MI', deadline: 'Jul 31', period: '2-year cycle', ethics: '3 hrs', total: '20 hrs' },
];

const dashboardSteps = [
  {
    icon: Eye,
    title: 'Check Status Overview',
    description: 'View your license status, expiry dates, and CE progress at a glance',
    color: 'text-blue-600'
  },
  {
    icon: BarChart3,
    title: 'Monitor CE Progress',
    description: 'Track your continuing education credits with color-coded progress bars',
    color: 'text-emerald-600'
  },
  {
    icon: Upload,
    title: 'Upload Certificates',
    description: 'Use the "Add CE Course" button to upload completion certificates',
    color: 'text-purple-600'
  },
  {
    icon: Bell,
    title: 'Review Alerts',
    description: 'Check the alerts panel for upcoming deadlines and requirements',
    color: 'text-amber-600'
  },
  {
    icon: Calendar,
    title: 'Plan Renewals',
    description: 'Use the renewal countdown to plan your CE completion timeline',
    color: 'text-red-600'
  },
  {
    icon: Settings,
    title: 'Update Profile',
    description: 'Keep your license information and state requirements current',
    color: 'text-gray-600'
  }
];

const faqs = [
  {
    question: 'What if I miss a CE deadline?',
    answer: 'Contact your state insurance department immediately. Most states offer a grace period (usually 30-90 days) with late fees. Use the emergency contact button in your dashboard to reach compliance support.'
  },
  {
    question: 'How do I upload certificates?',
    answer: 'Click "Add CE Course" in your dashboard, drag and drop your PDF certificate, and our AI will auto-extract course details. Review the information and submit for verification.'
  },
  {
    question: 'What courses count toward my requirements?',
    answer: 'Check your state-specific requirements in the dashboard sidebar. Generally includes: Ethics (required), Annuity Training, LTC Training, and General CE credits.'
  },
  {
    question: 'How long does verification take?',
    answer: 'Most certificates are verified within 2-3 business days. You\'ll receive an email notification when verification is complete.'
  },
  {
    question: 'Can I get pre-approval for courses?',
    answer: 'Yes! Use the "Request Pre-Approval" toggle when adding a course to get approval before taking the training.'
  }
];

interface ComplianceGuideProps {
  onDownload?: () => void;
}

export function ComplianceGuide({ onDownload }: ComplianceGuideProps) {
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    toast.success('Compliance guide downloaded successfully!');
    onDownload?.();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-navy dark:text-white">
            How to Stay Compliant
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Your complete guide to insurance CE compliance and license management
        </p>
        
        <div className="flex justify-center gap-3 mb-8">
          <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="h-4 w-4 mr-2" />
            Print Guide
          </Button>
        </div>
      </div>

      {/* Dashboard Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Dashboard Overview - 6 Simple Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <step.icon className={`h-4 w-4 ${step.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* State Renewal Calendar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Common Renewal Deadlines by State
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stateDeadlines.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {item.state}
                  </Badge>
                  <div>
                    <div className="font-semibold text-sm">{item.deadline}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.period}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-600 dark:text-gray-400">Ethics: {item.ethics}</div>
                  <div className="font-semibold">Total: {item.total}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-navy dark:text-white mb-2 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            Need Help? Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Emergency Line</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">1-800-CE-HELP</p>
              <p className="text-xs text-gray-500">24/7 Support</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">compliance@agency.com</p>
              <p className="text-xs text-gray-500">Response within 4 hours</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard Support</p>
              <p className="text-xs text-gray-500">Mon-Fri 8AM-6PM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DALL-E Storyboard Prompt */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            Video Storyboard Concept
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              DALL·E Prompt: "Insurance Agent CE Compliance, the Easy Way"
            </h3>
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <p><strong>Scene 1:</strong> Professional insurance agent at clean desk with laptop, confident smile, CE dashboard visible on screen showing green progress bars and checkmarks</p>
              <p><strong>Scene 2:</strong> Split screen showing calendar with renewal dates highlighted, agent uploading certificate via drag-and-drop interface, AI scanning document with subtle tech effects</p>
              <p><strong>Scene 3:</strong> Close-up of mobile phone showing compliance alerts and notifications, agent reviewing requirements while commuting, seamless workflow</p>
              <p><strong>Scene 4:</strong> Agent presenting to clients with confidence, compliance badges and certifications visible in background, professional success</p>
              <p><strong>Style:</strong> Modern, clean, professional aesthetic with blue and green color palette, subtle technology elements, realistic photography style</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-navy dark:text-white">Stay Compliant, Stay Confident</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This guide is updated quarterly. For the latest state requirements, visit your compliance dashboard.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Generated on {new Date().toLocaleDateString()} • Version 2.1
        </p>
      </div>
    </div>
  );
}