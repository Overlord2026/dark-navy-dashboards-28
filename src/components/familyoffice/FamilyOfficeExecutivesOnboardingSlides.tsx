import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Crown, Users, FileText, BarChart3, Building, Award, Shield, TrendingUp, Briefcase, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const slides = [
  {
    id: 1,
    title: "Welcome, Family Office Executive",
    subtitle: "Lead the elite ecosystem for ultra-high-net-worth family management",
    icon: Crown,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <Badge variant="secondary" className="bg-gold/10 text-gold px-4 py-2 text-lg font-medium">
            👑 Founding Family Office Executive
          </Badge>
        </div>
        <div className="bg-gradient-to-r from-gold/10 to-yellow-50 p-6 rounded-lg border border-gold/20">
          <h3 className="font-semibold text-gold-foreground mb-3">Your Executive Platform Includes:</h3>
          <ul className="space-y-2 text-gold-foreground">
            <li className="flex items-center gap-2"><Crown className="w-4 h-4" /> Family office dashboard</li>
            <li className="flex items-center gap-2"><Users className="w-4 h-4" /> Bulk family member and staff invitations</li>
            <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> Advanced security and privacy controls</li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Global provider network access</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Multi-Entity Management",
    subtitle: "Manage family offices, trusts, and business entities",
    icon: Building,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Entity Structure
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Primary family office setup</li>
              <li>• Subsidiary entity management</li>
              <li>• Trust and foundation oversight</li>
              <li>• Investment entity tracking</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Family Hierarchy
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Principal Family</Badge>
              <Badge variant="outline">Next Generation</Badge>
              <Badge variant="outline">Extended Family</Badge>
              <Badge variant="outline">Key Staff</Badge>
              <Badge variant="outline">Board Members</Badge>
            </div>
          </Card>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">💡 Centralized control with granular permissions for each entity</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Team & Provider Invitations",
    subtitle: "Onboard family members, staff, and trusted advisors",
    icon: Users,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">127</div>
            <div className="text-sm text-muted-foreground">Family Members</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">43</div>
            <div className="text-sm text-muted-foreground">Staff Members</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-muted-foreground">Trusted Advisors</div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Bulk Invitation Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• CSV upload for family rosters</li>
              <li>• Role-based access assignment</li>
              <li>• Automated onboarding workflows</li>
              <li>• Privacy tier management</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Provider Integration</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Vetted advisor network access</li>
              <li>• Service provider credentials</li>
              <li>• Performance tracking</li>
              <li>• Contract management</li>
            </ul>
          </Card>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Legacy Document Management",
    subtitle: "Secure storage and organization of family office archives",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Document Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Family governance documents</li>
              <li>• Investment policies and strategies</li>
              <li>• Trust and estate documents</li>
              <li>• Board resolutions and meeting minutes</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Security Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Bank-level encryption</li>
              <li>• Access audit trails</li>
              <li>• Version control</li>
              <li>• Emergency access protocols</li>
            </ul>
          </Card>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Digital Transformation</h3>
          <p className="text-purple-800 text-sm">Seamlessly migrate decades of family office documentation to our secure platform</p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Analytics & Reporting",
    subtitle: "Comprehensive insights across all family office operations",
    icon: BarChart3,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">$2.7B</div>
            <div className="text-sm text-muted-foreground">Assets Under Management</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-muted-foreground">Investment Vehicles</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-muted-foreground">Family Satisfaction</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">47</div>
            <div className="text-sm text-muted-foreground">Service Providers</div>
          </Card>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Executive Dashboard</h3>
          <p className="text-green-800 text-sm">Real-time insights across investments, family engagement, and operational efficiency</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Launch Your Family Office Platform",
    subtitle: "Activate your comprehensive family office management system",
    icon: Briefcase,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <Badge variant="secondary" className="bg-gold/10 text-gold px-6 py-3 text-lg font-semibold">
            👑 Family Office Executive Platform
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto p-4 flex flex-col items-center gap-2">
            <Building className="w-6 h-6" />
            <span>Setup Entities</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Invite Family & Staff</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <FileText className="w-6 h-6" />
            <span>Upload Documents</span>
          </Button>
        </div>
        <div className="bg-gradient-to-r from-gold/10 to-yellow-50 p-6 rounded-lg border border-gold/20">
          <h3 className="font-semibold text-gold-foreground mb-2">🚀 Transform Your Family Office</h3>
          <p className="text-gold-foreground">Join the elite network of family offices leveraging technology for multi-generational success.</p>
        </div>
      </div>
    )
  }
];

export const FamilyOfficeExecutivesOnboardingSlides: React.FC = () => {
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
            <h1 className="text-3xl font-bold text-foreground">Family Office Executives</h1>
            <p className="text-muted-foreground">VIP Onboarding for Family Office & Executive Leaders</p>
          </div>
          <Badge variant="secondary" className="bg-gold/10 text-gold">
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