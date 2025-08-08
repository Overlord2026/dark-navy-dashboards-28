import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TreePine,
  Heart,
  Users,
  DollarSign,
  Clock,
  Shield,
  CheckCircle2,
  Hand,
  Dna,
  Scale,
  BarChart3,
  ArrowRight,
  Smartphone,
  Monitor,
  Download,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPageStoryboard: React.FC = () => {
  const [activeFrame, setActiveFrame] = useState('frame1');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const frames = [
    {
      id: 'frame1',
      title: 'Hero Section',
      description: 'Animated gradient background with golden tree and longevity calculator preview'
    },
    {
      id: 'frame2', 
      title: 'Value Pillars',
      description: '3 horizontal cards showcasing complete wealth strategy, health optimization, and legacy collaboration'
    },
    {
      id: 'frame3',
      title: 'Two-Path Onboarding',
      description: 'Split screen cards for Families vs Professionals with distinct CTAs'
    },
    {
      id: 'frame4',
      title: 'Differentiators Strip',
      description: 'Horizontal strip with 4 key differentiator icons and labels'
    },
    {
      id: 'frame5',
      title: 'Final CTA Section',
      description: 'Full-width gradient section with main value proposition and dual CTAs'
    },
    {
      id: 'frame6',
      title: 'Footer',
      description: 'Dark slate footer with navigation columns and social links'
    }
  ];

  const Frame1 = () => (
    <div className={`bg-gradient-to-br from-gold/10 via-emerald/5 to-background p-8 rounded-lg border-2 border-gold/20 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'min-h-[600px]'}`}>
      <div className={`${viewMode === 'mobile' ? 'space-y-6' : 'grid grid-cols-2 gap-12 items-center h-full'}`}>
        {/* Left Content / Mobile Top */}
        <div className="space-y-6">
          {/* Animated Tree (Desktop left, Mobile center) */}
          <div className={`${viewMode === 'mobile' ? 'text-center' : 'absolute left-4 top-1/2 transform -translate-y-1/2'} ${viewMode === 'mobile' ? 'relative' : ''}`}>
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <TreePine className={`text-gold ${viewMode === 'mobile' ? 'w-16 h-16 mx-auto mb-4' : 'w-24 h-24'}`} />
              {/* Glowing effects */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-emerald-400/50 rounded-full blur-sm" />
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gold/60 rounded-full blur-sm" />
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-slate-300/40 rounded-full blur-sm" />
            </motion.div>
          </div>

          <div className={`${viewMode === 'mobile' ? 'text-center' : 'pl-32'}`}>
            <h1 className={`font-bold leading-tight ${viewMode === 'mobile' ? 'text-3xl' : 'text-5xl'}`}>
              Your Boutique Family Office™
            </h1>
            <h2 className={`font-bold bg-gradient-to-r from-emerald-600 to-gold bg-clip-text text-transparent ${viewMode === 'mobile' ? 'text-xl mt-2' : 'text-3xl mt-4'}`}>
              Live Longer. Prosper Longer.
            </h2>
            <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-sm mt-3' : 'text-lg mt-4'}`}>
              One secure command center to manage your wealth, protect your health, and preserve your legacy — with a trusted team of experts at your side.
            </p>
          </div>

          <div className={`${viewMode === 'mobile' ? 'space-y-3' : 'space-y-4 pl-32'}`}>
            <Button className={`bg-gradient-to-r from-emerald-600 to-emerald-700 text-white ${viewMode === 'mobile' ? 'w-full text-sm py-2' : 'px-6 py-3'}`}>
              Get Started – Families
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className={`border-gold hover:bg-gold/10 ${viewMode === 'mobile' ? 'w-full text-sm py-2' : 'px-6 py-3 ml-4'}`}>
              Get Started – Professionals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right Content - Longevity Calculator / Mobile Bottom */}
        <div className={`${viewMode === 'mobile' ? 'mt-6' : ''}`}>
          <Card className="bg-gradient-to-br from-emerald-50 to-gold-50 border-2 border-emerald-200">
            <CardHeader className="text-center pb-4">
              <Badge className="mx-auto mb-2 bg-emerald-100 text-emerald-800 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Longevity Calculator
              </Badge>
              <CardTitle className={`${viewMode === 'mobile' ? 'text-lg' : 'text-xl'}`}>
                How Long Could Your Money Last?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className={`font-bold text-emerald-600 ${viewMode === 'mobile' ? 'text-2xl' : 'text-3xl'}`}>
                100 Years
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
              </div>
              <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                If you lived to 100, would your wealth support your lifestyle?
              </p>
              <Button className={`bg-emerald-600 hover:bg-emerald-700 text-white ${viewMode === 'mobile' ? 'w-full text-xs py-2' : 'text-sm'}`}>
                Calculate Your Longevity
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Badge variant="secondary" className="text-xs">
          <Layers className="w-3 h-3 mr-1" />
          FRAME 1: Hero Section - {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
        </Badge>
      </div>
    </div>
  );

  const Frame2 = () => (
    <div className={`bg-muted/30 p-8 rounded-lg border-2 border-emerald-200 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'min-h-[500px]'}`}>
      <div className="text-center mb-8">
        <h2 className={`font-bold mb-4 ${viewMode === 'mobile' ? 'text-2xl' : 'text-3xl'}`}>
          Three Pillars of Elite Family Office Life
        </h2>
        <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-sm' : 'text-lg'}`}>
          Everything the ultra-wealthy have, now accessible to every family
        </p>
      </div>

      <div className={`${viewMode === 'mobile' ? 'space-y-4' : 'grid grid-cols-3 gap-6'}`}>
        {/* Pillar 1 */}
        <Card className="border-2 border-gold/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="relative">
                <DollarSign className="w-6 h-6 text-white" />
                <Hand className="w-3 h-3 text-white absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className={`${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
              Complete Wealth & Life Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              Same fee covers investments, retirement planning, tax optimization, estate planning, insurance, and healthcare guidance.
            </p>
          </CardContent>
        </Card>

        {/* Pillar 2 */}
        <Card className="border-2 border-emerald-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="relative">
                <Heart className="w-6 h-6 text-white" />
                <Dna className="w-3 h-3 text-white absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className={`${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
              Health & Longevity Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              Access world-leading preventative care, epigenetics testing, and cutting-edge therapies.
            </p>
          </CardContent>
        </Card>

        {/* Pillar 3 */}
        <Card className="border-2 border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="relative">
                <TreePine className="w-6 h-6 text-white" />
                <Users className="w-3 h-3 text-white absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className={`${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
              Legacy & Family Collaboration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              Store and share vital documents, values, and instructions securely in one family command center.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Badge variant="secondary" className="text-xs">
          <Layers className="w-3 h-3 mr-1" />
          FRAME 2: Value Pillars - {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
        </Badge>
      </div>
    </div>
  );

  const Frame3 = () => (
    <div className={`p-8 rounded-lg border-2 border-slate-200 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'min-h-[500px]'}`}>
      <div className="text-center mb-8">
        <h2 className={`font-bold mb-4 ${viewMode === 'mobile' ? 'text-2xl' : 'text-3xl'}`}>
          Choose Your Path
        </h2>
        <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-sm' : 'text-lg'}`}>
          Whether you're building wealth or serving elite families
        </p>
      </div>

      <div className={`${viewMode === 'mobile' ? 'space-y-6' : 'grid grid-cols-2 gap-8'}`}>
        {/* Families Path */}
        <Card className="bg-gradient-to-br from-emerald-50 to-gold-50 border-2 border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className={`mb-2 ${viewMode === 'mobile' ? 'text-lg' : 'text-xl'}`}>
              Families & Individuals
            </CardTitle>
            <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
              Discover your health and wealth blueprint
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className={`${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Complete wealth management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className={`${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Health optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className={`${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Legacy preservation</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              Get Started – Families
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Professionals Path */}
        <Card className="bg-gradient-to-br from-gold-50 to-yellow-50 border-2 border-gold-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className={`mb-2 ${viewMode === 'mobile' ? 'text-lg' : 'text-xl'}`}>
              Professionals
            </CardTitle>
            <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
              Join the trusted network serving elite families
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span className={`${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Elite client connections</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span className={`${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Practice growth tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span className={`${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Vetted network access</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-gold to-yellow-400 text-white">
              Get Started – Professionals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Badge variant="secondary" className="text-xs">
          <Layers className="w-3 h-3 mr-1" />
          FRAME 3: Two-Path Onboarding - {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
        </Badge>
      </div>
    </div>
  );

  const Frame4 = () => (
    <div className={`bg-muted/20 p-8 rounded-lg border-2 border-gold-200 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'min-h-[300px]'}`}>
      <div className={`${viewMode === 'mobile' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-4 gap-8'}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <h3 className={`font-semibold mb-2 ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Flexible Fee Structures
          </h3>
          <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            Percentage, flat, or hybrid
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <div className="relative">
              <DollarSign className="w-6 h-6 text-white" />
              <CheckCircle2 className="w-3 h-3 text-white absolute -top-1 -right-1" />
            </div>
          </div>
          <h3 className={`font-semibold mb-2 ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Value Beyond Investments
          </h3>
          <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            Complete life solution
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <div className="relative">
              <Shield className="w-6 h-6 text-white" />
              <CheckCircle2 className="w-3 h-3 text-white absolute -top-1 -right-1" />
            </div>
          </div>
          <h3 className={`font-semibold mb-2 ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Vetted Network
          </h3>
          <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            Verified, licensed, fiduciary
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <div className="relative">
              <Clock className="w-6 h-6 text-white" />
              <DollarSign className="w-3 h-3 text-white absolute -top-1 -right-1" />
            </div>
          </div>
          <h3 className={`font-semibold mb-2 ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Longevity Calculator
          </h3>
          <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            See how long savings last
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Badge variant="secondary" className="text-xs">
          <Layers className="w-3 h-3 mr-1" />
          FRAME 4: Differentiators Strip - {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
        </Badge>
      </div>
    </div>
  );

  const Frame5 = () => (
    <div className={`bg-gradient-to-r from-emerald-900/10 to-gold/10 p-8 rounded-lg border-2 border-emerald-300 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'min-h-[400px]'} flex items-center justify-center`}>
      <div className="text-center space-y-6">
        <h2 className={`font-bold ${viewMode === 'mobile' ? 'text-2xl' : 'text-4xl'}`}>
          Your life is your greatest investment.
        </h2>
        <p className={`text-muted-foreground ${viewMode === 'mobile' ? 'text-lg' : 'text-2xl'}`}>
          Let's make sure it lasts.
        </p>
        
        <div className={`${viewMode === 'mobile' ? 'space-y-3' : 'flex gap-4 justify-center'}`}>
          <Button className={`bg-gradient-to-r from-emerald-600 to-emerald-700 text-white ${viewMode === 'mobile' ? 'w-full' : 'px-8 py-4 text-lg'}`}>
            Get Started – Families
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button className={`bg-gradient-to-r from-gold to-yellow-400 text-white ${viewMode === 'mobile' ? 'w-full' : 'px-8 py-4 text-lg'}`}>
            Get Started – Professionals
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Badge variant="secondary" className="text-xs">
            <Layers className="w-3 h-3 mr-1" />
            FRAME 5: Final CTA Section - {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
          </Badge>
        </div>
      </div>
    </div>
  );

  const Frame6 = () => (
    <div className={`bg-slate-900 text-white p-8 rounded-lg border-2 border-slate-700 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'min-h-[300px]'}`}>
      <div className={`${viewMode === 'mobile' ? 'space-y-6' : 'grid grid-cols-4 gap-8'}`}>
        <div>
          <h3 className={`font-semibold mb-3 text-gold ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Families
          </h3>
          <ul className={`space-y-2 text-slate-300 ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            <li>Wealth Management</li>
            <li>Health Optimization</li>
            <li>Legacy Planning</li>
            <li>Family Coordination</li>
          </ul>
        </div>

        <div>
          <h3 className={`font-semibold mb-3 text-gold ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Professionals
          </h3>
          <ul className={`space-y-2 text-slate-300 ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            <li>Advisors</li>
            <li>CPAs</li>
            <li>Attorneys</li>
            <li>Insurance</li>
          </ul>
        </div>

        <div>
          <h3 className={`font-semibold mb-3 text-gold ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            About
          </h3>
          <ul className={`space-y-2 text-slate-300 ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            <li>Our Story</li>
            <li>Leadership</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>

        <div>
          <h3 className={`font-semibold mb-3 text-gold ${viewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
            Contact
          </h3>
          <ul className={`space-y-2 text-slate-300 ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            <li>Support</li>
            <li>Sales</li>
            <li>Partners</li>
            <li>Media</li>
          </ul>
        </div>
      </div>

      <div className={`border-t border-slate-700 pt-6 mt-6 ${viewMode === 'mobile' ? 'text-center' : 'flex justify-between items-center'}`}>
        <p className={`text-slate-400 ${viewMode === 'mobile' ? 'text-xs mb-4' : 'text-sm'}`}>
          © 2024 Boutique Family Office™. All rights reserved.
        </p>
        <div className={`flex gap-4 ${viewMode === 'mobile' ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">f</span>
          </div>
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">in</span>
          </div>
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">tw</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Badge variant="secondary" className="text-xs">
          <Layers className="w-3 h-3 mr-1" />
          FRAME 6: Footer - {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
        </Badge>
      </div>
    </div>
  );

  const renderFrame = () => {
    switch (activeFrame) {
      case 'frame1': return <Frame1 />;
      case 'frame2': return <Frame2 />;
      case 'frame3': return <Frame3 />;
      case 'frame4': return <Frame4 />;
      case 'frame5': return <Frame5 />;
      case 'frame6': return <Frame6 />;
      default: return <Frame1 />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Landing Page Storyboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Visual mockups for the new "Live Longer. Prosper Longer." positioning
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              onClick={() => setViewMode('desktop')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              onClick={() => setViewMode('mobile')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </Button>
          </div>
        </div>

        {/* Frame Navigation */}
        <Tabs value={activeFrame} onValueChange={setActiveFrame} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-6">
            {frames.map((frame) => (
              <TabsTrigger key={frame.id} value={frame.id} className="text-xs">
                {frame.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Frame Content */}
          <div className="mt-8">
            {renderFrame()}
          </div>

          {/* Frame Description */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">
                {frames.find(f => f.id === activeFrame)?.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {frames.find(f => f.id === activeFrame)?.description}
              </p>
            </CardContent>
          </Card>
        </Tabs>

        {/* Design System Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Design System Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gold rounded"></div>
                    <span className="text-sm">Gold (#C9A646)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <span className="text-sm">Deep Green (#2F4F4F)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-700 rounded"></div>
                    <span className="text-sm">Slate Gray (#2B2B2B)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Typography</h4>
                <div className="space-y-2">
                  <p className="text-sm font-serif">Modern Serif - Headings</p>
                  <p className="text-sm">Clean Sans-serif - Body</p>
                  <p className="text-xs text-muted-foreground">Generous spacing throughout</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Interactive Elements</h4>
                <div className="space-y-2">
                  <p className="text-sm">Hover states on all buttons/cards</p>
                  <p className="text-sm">Subtle lift animations</p>
                  <p className="text-sm">Gradient backgrounds for CTAs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <div className="text-center mt-8">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Figma Implementation Notes</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-4xl mx-auto">
              <div>
                <h4 className="font-medium mb-2">Desktop Specifications:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1440px width for desktop frames</li>
                  <li>• 24px grid system with 8px baseline</li>
                  <li>• Hero section minimum 600px height</li>
                  <li>• Consistent 80px section padding</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mobile Specifications:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 375px width for mobile frames</li>
                  <li>• 16px side margins, 24px vertical spacing</li>
                  <li>• Stack all elements vertically</li>
                  <li>• Full-width CTAs on mobile</li>
                </ul>
              </div>
            </div>
            
            <Button className="mt-6" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PNG Previews for Figma Reference
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};