import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Bot, 
  Network, 
  Archive, 
  Bell, 
  Users, 
  Shield, 
  Crown,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  Globe,
  MessageCircle,
  Calendar,
  Upload,
  Eye,
  Settings,
  Target,
  Lightbulb,
  Download,
  Clock
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  highlight?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Welcome to Your Family Office Business & Entity Hub",
    subtitle: "All your businesses, trusts, and entities—organized, protected, and automated in one place.",
    highlight: "premium",
    content: (
      <div className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
          <Building2 className="h-16 w-16 text-white" />
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Complete Entity Management Solution</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform how your family manages business entities, trusts, and legal structures. 
            From formation to compliance, we've got you covered with enterprise-grade tools 
            designed for families and their advisors.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-green-100 text-green-800">Secure</Badge>
            <Badge className="bg-blue-100 text-blue-800">Automated</Badge>
            <Badge className="bg-purple-100 text-purple-800">Collaborative</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "What Can You Do Here?",
    subtitle: "Comprehensive entity management from formation to dissolution",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold mb-2">Create & Manage</h4>
            <p className="text-sm text-muted-foreground">
              LLCs, trusts, partnerships, and family companies across all states and countries
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">Track & Comply</h4>
            <p className="text-sm text-muted-foreground">
              Automatic deadline tracking, compliance monitoring, and filing reminders
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Collaborate</h4>
            <p className="text-sm text-muted-foreground">
              Securely share documents with family members and trusted advisors
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: 3,
    title: "Entity Formation Wizard",
    subtitle: "Step-by-step creation of new LLCs, Corps, Trusts—even across multiple states/countries",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Guided Formation Process</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Choose entity type and jurisdiction</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Auto-fill forms with your data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Generate key documents instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Assign professional advisors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button className="bg-primary hover:bg-primary/90">
            <Play className="h-4 w-4 mr-2" />
            Start Formation Wizard
          </Button>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "AI Filing Helper",
    subtitle: "Ask questions, get compliance answers, and auto-generate filing reminders",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-3">Your Personal Compliance Assistant</h4>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">"When is my Texas franchise tax due?"</p>
                    <div className="mt-2 p-3 bg-emerald-50 rounded text-sm">
                      <p className="font-medium text-emerald-800">Texas Franchise Tax due May 15th</p>
                      <p className="text-emerald-700 mt-1">$300 estimated • Filing reminder set for May 10th</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>State-specific guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automatic reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Peace of mind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "The Entity \"Family Tree\"",
    subtitle: "Instantly visualize ownership, relationships, and linked properties/assets",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
          <div className="text-center mb-6">
            <Network className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Visual Entity Structure</h4>
            <p className="text-sm text-muted-foreground">
              See how all your entities connect and interact
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Mock Family Tree Visualization */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Smith Family</span>
                </div>
              </div>
              
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="bg-emerald-100 p-3 rounded-lg mb-2 w-24">
                    <Building2 className="h-6 w-6 text-emerald-600 mx-auto" />
                  </div>
                  <p className="text-xs font-medium">Holdings LLC</p>
                  <p className="text-xs text-muted-foreground">$3.5M</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-lg mb-2 w-24">
                    <Shield className="h-6 w-6 text-purple-600 mx-auto" />
                  </div>
                  <p className="text-xs font-medium">Family Trust</p>
                  <p className="text-xs text-muted-foreground">$4.3M</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <p className="font-medium">Interactive</p>
                <p className="text-xs text-muted-foreground">Click to explore</p>
              </div>
              <div className="text-center">
                <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="font-medium">Detailed View</p>
                <p className="text-xs text-muted-foreground">Drill down for specifics</p>
              </div>
              <div className="text-center">
                <Download className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <p className="font-medium">Export</p>
                <p className="text-xs text-muted-foreground">Share with advisors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Vault & Document Management",
    subtitle: "Drag-and-drop upload, mobile scanning, and auto-categorization",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Smart Upload</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Drag & drop files</li>
                  <li>• Mobile scanning</li>
                  <li>• Auto-categorization</li>
                  <li>• OCR text extraction</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Secure Permissions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Family access controls</li>
                  <li>• Advisor permissions</li>
                  <li>• Attorney sharing</li>
                  <li>• Private documents</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Document Categories</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              'Operating Agreements',
              'Annual Minutes',
              'Tax Returns',
              'EIN Letters',
              'Articles of Inc.',
              'Transfer Deeds',
              'Banking Resolutions',
              'Compliance Reports'
            ].map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Compliance & Alerts",
    subtitle: "Calendar with color-coded deadlines, SMS/email reminders, audit trail",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-3">Never Miss Another Deadline</h4>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded border-l-4 border-red-500">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Smith Family Trust Annual Report</p>
                        <p className="text-xs text-muted-foreground">Due in 14 days</p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Texas Franchise Tax Payment</p>
                        <p className="text-xs text-muted-foreground">Due in 45 days</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Reminder</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="font-medium">SMS Alerts</p>
                </div>
                <div className="text-center">
                  <Archive className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="font-medium">Audit Trail</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="font-medium">Checklists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Advisor & Collaboration Tools",
    subtitle: "Assign your CPA, attorney, or agent to any entity",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Professional Network</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Corporate Attorneys</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>CPAs & Accountants</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Insurance Agents</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Access Controls</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose who can view each document</p>
                  <p>• Set editing permissions</p>
                  <p>• Secure messaging channels</p>
                  <p>• Activity monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">"See who has access to what, always"</h4>
          <p className="text-sm text-muted-foreground">
            Complete transparency and control over your sensitive business information. 
            Grant access to specific entities or documents while maintaining full oversight.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "Premium Features",
    subtitle: "Unlimited entities & advanced compliance, AI-powered filing assistant and alerts",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
          <div className="text-center mb-6">
            <Crown className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">Unlock the Full Power</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Business Features
              </h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Unlimited entities & advanced compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Ownership tracking & audit trail</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>"Family Business Tree" visualization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>AI-powered filing assistant</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Global Features
              </h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Multi-language support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>International entity formation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Cross-border compliance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Global advisor network</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Badge className="bg-amber-100 text-amber-800 text-sm px-4 py-2">
            Starting at $99/month for unlimited entities
          </Badge>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "Get Started",
    subtitle: "Try our demo mode or upgrade for unlimited tracking and advanced automation!",
    content: (
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
            <Target className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Your Family Entity Command Center Awaits</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of families who have streamlined their business entity management 
            with our comprehensive platform.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Play className="h-5 w-5 mr-2" />
            Try Demo Mode
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
            <Crown className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">Free Trial</h4>
            <p className="text-sm text-muted-foreground">No credit card required</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Expert Support</h4>
            <p className="text-sm text-muted-foreground">Dedicated customer success</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold">Bank-Grade Security</h4>
            <p className="text-sm text-muted-foreground">SOC 2 Type II certified</p>
          </div>
        </div>
      </div>
    )
  }
];

export const OnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Business & Entity Management</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Slide {currentSlide + 1} of {slides.length}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Slide Content */}
      <div className="min-h-[600px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <Card className="h-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">
                  {slides[currentSlide].title}
                </CardTitle>
                {slides[currentSlide].subtitle && (
                  <p className="text-lg text-muted-foreground">
                    {slides[currentSlide].subtitle}
                  </p>
                )}
              </CardHeader>
              <CardContent className="px-8 pb-8">
                {slides[currentSlide].content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Quick Start Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Getting Started</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                  <span>Add your entities using our Formation Wizard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                  <span>Upload documents and assign to entities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                  <span>Set up compliance alerts and reminders</span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Pro Tips</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Start with your most important entity first</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Use demo mode to explore all features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Invite advisors to collaborate early</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};