import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Video, 
  Download, 
  CheckCircle,
  Play,
  Users,
  Star,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Shield,
  HeadphonesIcon,
  Clock,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface TrainingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  duration: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Testimonial {
  name: string;
  firm: string;
  quote: string;
  migrationCount: number;
  rating: number;
}

const trainingSteps: TrainingStep[] = [
  {
    id: 'overview',
    title: 'Plan Migration Made Easy',
    description: 'Welcome! Learn to upload plans from any tool—CSV, Excel, or PDF with AI auto-parsing',
    completed: false,
    duration: '3 min'
  },
  {
    id: 'preparation',
    title: 'Data Preparation & Export',
    description: 'How to export from MoneyGuidePro, eMoney, RightCapital and prepare your data',
    completed: false,
    duration: '5 min'
  },
  {
    id: 'import-wizard',
    title: 'Using the Import Wizard',
    description: 'Step-by-step walkthrough: upload, map fields, review data, and approve with confidence',
    completed: false,
    duration: '8 min'
  },
  {
    id: 'mapping',
    title: 'Field Mapping & AI Parsing',
    description: 'How our AI auto-parses PDF summaries and ensures accurate data mapping',
    completed: false,
    duration: '6 min'
  },
  {
    id: 'client-assignment',
    title: 'Client Assignment & Dashboard',
    description: 'Assign plans to clients and see results in your dashboard immediately',
    completed: false,
    duration: '4 min'
  },
  {
    id: 'compliance',
    title: 'Compliance & Audit Logging',
    description: 'Tips for compliance, audit logging, and getting help with the concierge button',
    completed: false,
    duration: '3 min'
  }
];

const faqs: FAQ[] = [
  {
    question: "What file formats are supported for plan import?",
    answer: "We support CSV, XLSX, and PDF formats. For best results, use CSV or XLSX with our downloadable template. PDF parsing uses AI and may require review."
  },
  {
    question: "How long does the migration process take?",
    answer: "Most individual plan imports take 2-5 minutes. Bulk imports depend on file size but typically process 50-100 plans per hour."
  },
  {
    question: "What if my PDF file doesn't parse correctly?",
    answer: "Our AI parser handles most standard formats, but you can always edit the extracted data manually or use our CSV template for guaranteed accuracy."
  },
  {
    question: "Can I migrate plans from MoneyGuidePro, eMoney, or RightCapital?",
    answer: "Yes! Export your data to CSV/XLSX format from these platforms and use our field mapping wizard to ensure accurate migration."
  },
  {
    question: "How do I verify my migrated data is accurate?",
    answer: "Every import includes a review step where you can verify all mapped fields. We also provide detailed audit logs for compliance tracking."
  },
  {
    question: "What happens if I make a mistake during import?",
    answer: "You can always re-import or use our data correction tools. All imports are logged with rollback capabilities if needed."
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    firm: "Wealth Partners Group",
    quote: "Migrated 147 client plans in just 3 hours. The PDF parsing saved us weeks of manual data entry!",
    migrationCount: 147,
    rating: 5
  },
  {
    name: "David Chen",
    firm: "Financial Advisory Solutions",
    quote: "The field mapping wizard made switching from our old platform seamless. Clients love the new interface.",
    migrationCount: 89,
    rating: 5
  },
  {
    name: "Maria Rodriguez",
    firm: "Independent Financial Services",
    quote: "Concierge migration service was incredible. They handled everything while I focused on client relationships.",
    migrationCount: 203,
    rating: 5
  }
];

export function PlanMigrationTraining() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
      toast.success('Step completed!');
    }
  };

  const handleDownloadGuide = () => {
    toast.success('Downloading Plan Migration Guide PDF...');
  };

  const handleRequestConcierge = () => {
    toast.success('Concierge migration request submitted! We\'ll contact you within 24 hours.');
  };

  const handleStartDemo = () => {
    // Create sample files for download
    const csvSample = `client_name,current_age,retirement_age,current_assets,monthly_contribution,risk_tolerance,goals
John Smith,45,65,750000,3000,moderate,"Comfortable retirement with travel fund"
Jane Doe,52,62,1200000,4500,conservative,"Early retirement by age 62"
Mike Johnson,38,67,450000,2500,aggressive,"Maximize growth potential"`;

    const blob = new Blob([csvSample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-retirement-plans.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Demo sandbox launched! Sample files downloaded for practice.');
  };

  const progressPercentage = (completedSteps.length / trainingSteps.length) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Plan Migration & Onboarding
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn how to seamlessly migrate your existing retirement plans to our platform. 
          Get your clients set up faster with our comprehensive training program.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Your Progress</h3>
              <p className="text-muted-foreground">
                {completedSteps.length} of {trainingSteps.length} modules completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="training" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="training">Video Training</TabsTrigger>
          <TabsTrigger value="guide">Download Guide</TabsTrigger>
          <TabsTrigger value="demo">Demo Sandbox</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="testimonials">Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          <motion.div
            className="grid gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {trainingSteps.map((step, index) => (
              <motion.div key={step.id} variants={itemVariants}>
                <Card className={`transition-all duration-300 hover:shadow-md ${
                  completedSteps.includes(step.id) ? 'border-green-200 bg-green-50/50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        completedSteps.includes(step.id) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant={completedSteps.includes(step.id) ? "outline" : "default"}
                          onClick={() => handleStepComplete(step.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {completedSteps.includes(step.id) ? 'Rewatch' : 'Watch'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Plan Migration Guide</CardTitle>
                    <CardDescription>Complete step-by-step PDF guide</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">What's Included:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Why migrate to our platform</li>
                    <li>• Step-by-step import instructions</li>
                    <li>• Field mapping reference guide</li>
                    <li>• Compliance & security overview</li>
                    <li>• Troubleshooting checklist</li>
                    <li>• Support contact information</li>
                  </ul>
                </div>
                <Button onClick={handleDownloadGuide} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Guide (2.1 MB)
                </Button>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <HeadphonesIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Concierge Migration</CardTitle>
                    <CardDescription>White-glove onboarding service</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Service Includes:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Dedicated migration specialist</li>
                    <li>• Bulk plan import assistance</li>
                    <li>• Data validation & cleanup</li>
                    <li>• Client notification setup</li>
                    <li>• Training session for your team</li>
                    <li>• 30-day post-migration support</li>
                  </ul>
                </div>
                <Button onClick={handleRequestConcierge} className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Request Concierge Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-3 bg-green-100 rounded-full">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Interactive Demo Sandbox</CardTitle>
              </div>
              <CardDescription className="text-base">
                Practice the migration process with sample data before importing your real client plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Upload Practice Files</h4>
                  <p className="text-sm text-muted-foreground">
                    Try CSV, XLSX, and PDF imports with sample data
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <ArrowRight className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Field Mapping</h4>
                  <p className="text-sm text-muted-foreground">
                    Practice mapping fields from different platforms
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Review & Approve</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn the validation and approval process
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={handleStartDemo} size="lg" className="w-full md:w-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Launch Demo Sandbox
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Downloads sample files for practice - no real data imported
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-sm">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold pr-4">{faq.question}</h4>
                      <div className={`transform transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help with your migration process
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <div className="grid gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {testimonial.migrationCount} plans migrated
                        </Badge>
                      </div>
                      <blockquote className="text-muted-foreground italic mb-3">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.firm}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Ready to Join Them?</h3>
              <p className="text-muted-foreground mb-4">
                Start your plan migration today and see why advisors love our platform
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Start Plan Migration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}