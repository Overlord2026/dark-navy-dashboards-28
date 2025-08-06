import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Calendar, FileText, BarChart3, Users, Award, Upload, Clock, Stethoscope, Brain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const slides = [
  {
    id: 1,
    title: "Welcome, Healthcare Pioneer",
    subtitle: "Join the elite network of longevity clinics and precision medicine experts",
    icon: Award,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-4 py-2 text-lg font-medium">
            🏆 Founding Healthcare Partner
          </Badge>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
          <h3 className="font-semibold text-emerald-900 mb-3">Your VIP Benefits Include:</h3>
          <ul className="space-y-2 text-emerald-800">
            <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> Priority clinic placement in marketplace</li>
            <li className="flex items-center gap-2"><Users className="w-4 h-4" /> Direct referrals from family offices</li>
            <li className="flex items-center gap-2"><Brain className="w-4 h-4" /> Advanced analytics and health insights</li>
            <li className="flex items-center gap-2"><FileText className="w-4 h-4" /> Research publication platform</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Clinic Profile & Team Setup",
    subtitle: "Showcase your clinic's expertise and innovative treatments",
    icon: Stethoscope,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Clinic Details
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Upload clinic logo and branding</li>
              <li>• Add specialties (longevity, precision medicine)</li>
              <li>• Team member credentials and photos</li>
              <li>• Clinic certifications and awards</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Longevity Medicine</Badge>
              <Badge variant="outline">Precision Medicine</Badge>
              <Badge variant="outline">Cancer Screening</Badge>
              <Badge variant="outline">Genomic Analysis</Badge>
              <Badge variant="outline">Biomarker Testing</Badge>
            </div>
          </Card>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">💡 Pro Tip: Detailed profiles receive 3x more family referrals</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Services & Booking Integration",
    subtitle: "Streamline appointments and showcase your cutting-edge services",
    icon: Calendar,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Service Calendar
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Set availability for consultations</li>
              <li>• Block time for procedures</li>
              <li>• Automated booking confirmations</li>
              <li>• Waitlist management</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Featured Services
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Executive health assessments</li>
              <li>• Advanced cancer screening</li>
              <li>• Epigenetic testing</li>
              <li>• IV therapy protocols</li>
            </ul>
          </Card>
        </div>
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Integration Ready</h3>
          <p className="text-purple-800 text-sm">Connect your existing booking system or use our built-in scheduler</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Research & Thought Leadership",
    subtitle: "Share your expertise with the family office community",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Publications Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Upload research papers</li>
              <li>• Share case studies</li>
              <li>• Publish health insights</li>
              <li>• Featured in family newsletters</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Engagement Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Host webinars and AMAs</li>
              <li>• Q&A with families</li>
              <li>• Health education content</li>
              <li>• Podcast opportunities</li>
            </ul>
          </Card>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Referral Network & Analytics",
    subtitle: "Track your impact and grow your family office connections",
    icon: BarChart3,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">127</div>
            <div className="text-sm text-muted-foreground">Family Referrals</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">$2.4M</div>
            <div className="text-sm text-muted-foreground">Revenue Impact</div>
          </Card>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Referral Dashboard</h3>
          <p className="text-green-800 text-sm">Real-time tracking of family referrals, bookings, and health outcomes</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "VIP Marketplace Launch",
    subtitle: "Go live and start connecting with elite families",
    icon: Users,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <Badge variant="secondary" className="bg-gold/10 text-gold px-6 py-3 text-lg font-semibold">
            🌟 Founding Healthcare Partner
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto p-4 flex flex-col items-center gap-2">
            <Stethoscope className="w-6 h-6" />
            <span>Publish Clinic Profile</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Invite Team Members</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <FileText className="w-6 h-6" />
            <span>Upload First Research</span>
          </Button>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 Ready to Transform Healthcare?</h3>
          <p className="text-blue-800">Join the revolution in family-centric healthcare and start making an impact today.</p>
        </div>
      </div>
    )
  }
];

export const HealthcareExecutivesOnboardingSlides: React.FC = () => {
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
            <h1 className="text-3xl font-bold text-foreground">Healthcare Executives & Clinics</h1>
            <p className="text-muted-foreground">VIP Onboarding for Longevity & Precision Medicine Leaders</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
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