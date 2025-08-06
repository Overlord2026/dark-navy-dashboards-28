import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Shield, Upload, FileText, BarChart3, Users, Award, Clock, AlertTriangle, TrendingUp, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const slides = [
  {
    id: 1,
    title: "Welcome, Founding Insurance Advisor",
    subtitle: "Join the elite insurance marketplace for high-net-worth families",
    icon: Award,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-lg font-medium">
            🏆 Founding Insurance Advisor
          </Badge>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Your VIP Benefits Include:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> Founding badge for premium marketplace positioning</li>
            <li className="flex items-center gap-2"><Users className="w-4 h-4" /> Instant visibility to family office clients</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Automated compliance/CE reminders</li>
            <li className="flex items-center gap-2"><Building className="w-4 h-4" /> Dedicated IMO/FMO integration tools</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "License & Product Portfolio",
    subtitle: "Upload your credentials and showcase your insurance offerings",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              License Management
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Upload state licenses (Life, Health, P&C)</li>
              <li>• Annuity registrations and certifications</li>
              <li>• E&O insurance documentation</li>
              <li>• FINRA registrations (Series 6, 7, 66)</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Product Portfolio
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Life Insurance</Badge>
              <Badge variant="outline">Annuities</Badge>
              <Badge variant="outline">LTC Insurance</Badge>
              <Badge variant="outline">Disability</Badge>
              <Badge variant="outline">Group Benefits</Badge>
            </div>
          </Card>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 font-medium">💡 Complete profiles receive 5x more family referrals</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Compliance & CE Dashboard",
    subtitle: "Automated tracking for licenses, CE credits, and renewal alerts",
    icon: AlertTriangle,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Automated Reminders
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• License renewal alerts (30, 60, 90 days)</li>
              <li>• CE credit tracking by state</li>
              <li>• E&O insurance expiration warnings</li>
              <li>• Carrier appointment renewals</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Document Vault
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Secure license storage</li>
              <li>• CE completion certificates</li>
              <li>• Carrier contracts and agreements</li>
              <li>• Compliance audit trail</li>
            </ul>
          </Card>
        </div>
        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">Compliance Status</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">✓ Active</div>
              <div className="text-xs text-muted-foreground">NY Life License</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">⚠ 45 Days</div>
              <div className="text-xs text-muted-foreground">CA CE Credits</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">✓ Current</div>
              <div className="text-xs text-muted-foreground">E&O Insurance</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "IMO/FMO Integration Hub",
    subtitle: "Manage carriers, commissions, and agent downlines",
    icon: Building,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Carrier Management</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Link carrier appointments</li>
              <li>• Product catalog integration</li>
              <li>• Commission tracking</li>
              <li>• Sales reporting</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Agent Downlines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Bulk agent invitations</li>
              <li>• Hierarchy management</li>
              <li>• Performance tracking</li>
              <li>• Commission splits</li>
            </ul>
          </Card>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Featured Carriers</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Allianz</Badge>
            <Badge variant="outline">Pacific Life</Badge>
            <Badge variant="outline">Nationwide</Badge>
            <Badge variant="outline">American National</Badge>
            <Badge variant="outline">Athene</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Marketplace Profile & Referrals",
    subtitle: "Showcase expertise and connect with high-net-worth families",
    icon: Users,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">47</div>
            <div className="text-sm text-muted-foreground">Family Referrals</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-sm text-muted-foreground">Close Rate</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">$1.2M</div>
            <div className="text-sm text-muted-foreground">Premium Volume</div>
          </Card>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Profile Visibility</h3>
          <p className="text-green-800 text-sm">Your founding member badge ensures premium placement in family office searches</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-3">
            <h4 className="font-medium text-sm mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">Estate Planning</Badge>
              <Badge variant="outline" className="text-xs">Business Succession</Badge>
              <Badge variant="outline" className="text-xs">Retirement Income</Badge>
            </div>
          </Card>
          <Card className="p-3">
            <h4 className="font-medium text-sm mb-2">Client Types</h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">Family Offices</Badge>
              <Badge variant="outline" className="text-xs">High Net Worth</Badge>
              <Badge variant="outline" className="text-xs">Business Owners</Badge>
            </div>
          </Card>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Analytics & Performance Dashboard",
    subtitle: "Track your insurance practice success metrics",
    icon: BarChart3,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <Badge variant="secondary" className="bg-gold/10 text-gold px-6 py-3 text-lg font-semibold">
            🌟 Insurance Analytics Pro
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Pipeline Metrics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prospects</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Applications</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Issued</span>
                <span className="font-semibold text-green-600">12</span>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Commission Tracking
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">YTD Commissions</span>
                <span className="font-semibold">$127,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Renewals</span>
                <span className="font-semibold">$45,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overrides</span>
                <span className="font-semibold">$18,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Goal Progress</span>
                <span className="font-semibold text-green-600">84%</span>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto p-4 flex flex-col items-center gap-2">
            <Shield className="w-6 h-6" />
            <span>Launch Profile</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Invite Agents</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Upload className="w-6 h-6" />
            <span>Upload Licenses</span>
          </Button>
        </div>
      </div>
    )
  }
];

export const InsuranceAgentsOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Insurance & Annuity Agents</h1>
            <p className="text-muted-foreground">VIP Onboarding for Insurance Professionals & IMO/FMO Executives</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Slide {currentSlide + 1} of {slides.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8 min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  {React.createElement(slides[currentSlide].icon, { className: "w-8 h-8 text-primary" })}
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-foreground">{slides[currentSlide].title}</h2>
                  <p className="text-muted-foreground">{slides[currentSlide].subtitle}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={
                  index === currentSlide 
                    ? 'w-3 h-3 rounded-full bg-primary transition-colors' 
                    : 'w-3 h-3 rounded-full bg-muted transition-colors'
                }
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};