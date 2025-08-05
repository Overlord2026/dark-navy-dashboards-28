import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  Gift,
  Users,
  Shield,
  Sparkles,
  TrendingUp,
  Building2,
  GraduationCap,
  Plane,
  Home,
  Baby,
  Heart as Ring,
  Briefcase,
  Plus,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LIFE_EVENTS = [
  { id: 'wedding', name: 'Getting Married', icon: Ring, description: 'Plan your financial future together' },
  { id: 'baby', name: 'New Baby', icon: Baby, description: 'Protect and plan for your growing family' },
  { id: 'home', name: 'Buying a Home', icon: Home, description: 'Navigate the largest purchase of your life' },
  { id: 'career', name: 'Career Change', icon: Briefcase, description: 'Optimize finances during transitions' },
  { id: 'education', name: "Child's Education", icon: GraduationCap, description: 'Fund college and educational goals' },
  { id: 'travel', name: 'Dream Vacation', icon: Plane, description: 'Plan and save for memorable experiences' },
  { id: 'business', name: 'Starting Business', icon: Building2, description: 'Structure and protect your venture' },
  { id: 'retirement', name: 'Retirement Planning', icon: TrendingUp, description: 'Secure your golden years' }
];

const SERVICE_CATEGORIES = [
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: Heart,
    tagline: 'Your family\'s wellbeing comes first',
    services: ['Primary Care Concierge', 'Mental Health Support', 'Nutrition Coaching', 'Executive Physicals'],
    featured: true
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: TrendingUp,
    tagline: 'Grow your wealth with purpose',
    services: ['Portfolio Management', 'ESG Investing', 'Alternative Investments', 'Family Office Services'],
    featured: true
  },
  {
    id: 'tax',
    name: 'Tax Strategy',
    icon: Shield,
    tagline: 'Keep more of what you earn',
    services: ['Tax Planning', 'Estate Tax Strategy', 'Business Tax', 'International Tax'],
    featured: true
  },
  {
    id: 'estate',
    name: 'Estate Planning',
    icon: Award,
    tagline: 'Protect your family\'s legacy',
    services: ['Wills & Trusts', 'Family Governance', 'Succession Planning', 'Philanthropy'],
    featured: false
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: Shield,
    tagline: 'Comprehensive protection strategies',
    services: ['Life Insurance', 'Disability Insurance', 'Property & Casualty', 'Umbrella Coverage'],
    featured: false
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Services',
    icon: Sparkles,
    tagline: 'Elevate your family experience',
    services: ['Travel Planning', 'Home Management', 'Personal Shopping', 'Event Planning'],
    featured: false
  }
];

const FAMILY_OUTCOMES = [
  {
    id: 1,
    title: 'The Johnson Family Success',
    challenge: 'Complex multi-generational wealth transfer',
    solution: 'Structured family governance and trust planning',
    outcome: 'Saved $2.3M in estate taxes while maintaining family harmony',
    category: 'Estate Planning',
    testimonial: '"The team helped us navigate complex family dynamics while optimizing our tax strategy."'
  },
  {
    id: 2,
    title: 'Tech Executive Transition',
    challenge: 'IPO liquidity event planning',
    solution: 'Coordinated tax, investment, and risk management',
    outcome: 'Diversified $50M portfolio while minimizing tax impact',
    category: 'Investments',
    testimonial: '"Professional, discreet guidance through our most important financial milestone."'
  },
  {
    id: 3,
    title: 'Healthcare Crisis Navigation',
    challenge: 'Serious family health emergency',
    solution: 'Concierge medical coordination and insurance advocacy',
    outcome: 'Secured best-in-class care while reducing costs by 40%',
    category: 'Health',
    testimonial: '"They became our advocates when we needed them most."'
  }
];

interface FamilyMarketplaceHubProps {
  userName?: string;
}

export function FamilyMarketplaceHub({ userName = 'Family' }: FamilyMarketplaceHubProps) {
  const { userProfile } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLifeEvent, setSelectedLifeEvent] = useState<string>('');
  const [showFiduciaryPrinciples, setShowFiduciaryPrinciples] = useState(false);
  const [showFamilyPurchase, setShowFamilyPurchase] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState(0);

  // Auto-rotate family outcomes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOutcome((prev) => (prev + 1) % FAMILY_OUTCOMES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const FiduciaryBanner = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-navy-900 to-navy-800 text-white py-2 px-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold-400" />
          <span className="text-sm font-medium">
            Our Trademarked Fiduciary Duty Principles™: Transparency. Your best interest. Ongoing optimization.
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFiduciaryPrinciples(true)}
          className="text-white hover:text-gold-400"
        >
          Learn More
        </Button>
      </div>
    </motion.div>
  );

  const HeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-900 text-white pt-16">
      {/* Gold tree watermark */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Welcome, {userName}.
            <span className="block text-gold-400 mt-2">Your private marketplace—handpicked for your needs.</span>
          </h1>
          
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Discover curated solutions & experts—always at your pace. No sales pressure. Learn, compare, choose.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-100">
              <Shield className="w-4 h-4 text-gold-400" />
              Fiduciary Standard
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Star className="w-4 h-4 text-gold-400" />
              Vetted Professionals
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Users className="w-4 h-4 text-gold-400" />
              Family-First Approach
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8"
              onClick={() => setShowFamilyPurchase(true)}
            >
              <Gift className="w-5 h-5 mr-2" />
              Gift to Family
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-navy-900 px-8"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Talk to a Fiduciary Advisor
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const LifeEventExplorer = () => (
    <div className="py-16 bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Explore by Life Event</h2>
          <p className="text-navy-600 max-w-2xl mx-auto">
            Life brings changes. We help you navigate them with confidence and expert guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {LIFE_EVENTS.map((event, index) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedLifeEvent === event.id ? 'transform scale-105' : ''
                }`}
                onClick={() => setSelectedLifeEvent(selectedLifeEvent === event.id ? '' : event.id)}
              >
                <Card className={`h-full transition-colors ${
                  selectedLifeEvent === event.id 
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                    : 'border-border/50 hover:border-emerald-300'
                }`}>
                  <CardContent className="p-4 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      selectedLifeEvent === event.id ? 'text-emerald-600' : 'text-navy-600'
                    }`} />
                    <h3 className="font-semibold text-sm mb-1">{event.name}</h3>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {selectedLifeEvent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8"
          >
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  Recommended for {LIFE_EVENTS.find(e => e.id === selectedLifeEvent)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-emerald-800">Financial Planning</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Certified Financial Planner consultation</li>
                      <li>• Goal-based investment strategy</li>
                      <li>• Risk assessment and protection</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-emerald-800">Legal Support</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Estate planning review</li>
                      <li>• Document updates and creation</li>
                      <li>• Tax optimization strategies</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-emerald-800">Lifestyle Services</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Concierge planning support</li>
                      <li>• Insurance reviews</li>
                      <li>• Family coordination</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    See Benefits
                  </Button>
                  <Button size="sm" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );

  const ServiceGallery = () => (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Your Recommendations</h2>
          <p className="text-navy-600 max-w-2xl mx-auto">
            Based on your profile and goals, here are services curated specifically for your family.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.filter(cat => cat.featured).map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-border/50 hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.tagline}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.services.slice(0, 3).map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                      {category.services.length > 3 && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Plus className="w-3 h-3" />
                          <span className="text-xs">+{category.services.length - 3} more services</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        See Benefits
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="gap-2">
            <ArrowRight className="w-5 h-5" />
            Explore All Services
          </Button>
        </div>
      </div>
    </div>
  );

  const FamilyOutcomesCarousel = () => (
    <div className="py-16 bg-gradient-to-br from-emerald-50 to-navy-50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Family Outcomes</h2>
          <p className="text-navy-600 max-w-2xl mx-auto">
            Real families, real results. See how our network has helped families like yours achieve their goals.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOutcome}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Badge variant="outline" className="mb-4">
                        {FAMILY_OUTCOMES[currentOutcome].category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-4">
                        {FAMILY_OUTCOMES[currentOutcome].title}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-red-600 mb-1">Challenge:</h4>
                          <p className="text-sm text-muted-foreground">
                            {FAMILY_OUTCOMES[currentOutcome].challenge}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-600 mb-1">Solution:</h4>
                          <p className="text-sm text-muted-foreground">
                            {FAMILY_OUTCOMES[currentOutcome].solution}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-emerald-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-emerald-800 mb-2">Outcome:</h4>
                        <p className="text-lg font-bold text-emerald-700 mb-4">
                          {FAMILY_OUTCOMES[currentOutcome].outcome}
                        </p>
                        <blockquote className="text-sm italic text-emerald-600 border-l-2 border-emerald-300 pl-3">
                          {FAMILY_OUTCOMES[currentOutcome].testimonial}
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {FAMILY_OUTCOMES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOutcome(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentOutcome ? 'bg-emerald-500' : 'bg-emerald-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <FiduciaryBanner />
      <HeroSection />
      <LifeEventExplorer />
      <ServiceGallery />
      <FamilyOutcomesCarousel />

      {/* Fiduciary Principles Modal */}
      <Dialog open={showFiduciaryPrinciples} onOpenChange={setShowFiduciaryPrinciples}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-500" />
              Our Fiduciary Duty Principles™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-navy-50 to-emerald-50 rounded-lg">
              <p className="text-lg font-medium text-navy-800 mb-2">
                Always your best interest, always transparent. No commissions.
              </p>
              <p className="text-sm text-navy-600">
                This is our trademark commitment to you and your family.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear fees, no hidden costs, open communication about all recommendations
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Your Best Interest</h3>
                <p className="text-sm text-muted-foreground">
                  Every recommendation prioritizes your family's goals and financial wellbeing
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Ongoing Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Continuous monitoring and adjustment as your life and goals evolve
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700">
                <strong>Trademark Promise:</strong> This is our legal and ethical commitment, 
                backed by our professional licensing and reputation. We put this commitment in writing 
                because your trust is everything.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Family Purchase Modal */}
      <Dialog open={showFamilyPurchase} onOpenChange={setShowFamilyPurchase}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-500" />
              Gift Family Office Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Share the Family Office experience with your loved ones. Purchase seats for family members 
              or gift subscriptions to friends.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <Card className="cursor-pointer hover:border-emerald-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold">Family Seats</h3>
                      <p className="text-sm text-muted-foreground">
                        Add spouse, parents, or adult children to your family group
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-emerald-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6 text-gold-500" />
                    <div>
                      <h3 className="font-semibold">Gift Subscription</h3>
                      <p className="text-sm text-muted-foreground">
                        Give friends the gift of financial empowerment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Continue
              </Button>
              <Button variant="outline" onClick={() => setShowFamilyPurchase(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}