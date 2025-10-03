import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Shield, 
  Star, 
  Trophy,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { getRoleDisplayName } from '@/utils/roleHierarchy';

interface RoleSpecificCTA {
  role: string;
  primary: string;
  secondary: string;
  urgency?: string;
  benefits: string[];
}

const roleSpecificCTAs: RoleSpecificCTA[] = [
  {
    role: 'client',
    primary: 'Schedule Your Wealth Review',
    secondary: 'Get My Personalized Roadmap',
    urgency: 'Limited slots available this month',
    benefits: ['Personalized investment strategy', 'Tax optimization plan', 'Estate planning review']
  },
  {
    role: 'advisor',
    primary: 'Apply for Partnership',
    secondary: 'Explore Partner Benefits',
    urgency: 'Early access for Q1 applications',
    benefits: ['Advanced client management tools', 'Revenue sharing opportunities', 'Marketing support']
  },
  {
    role: 'accountant',
    primary: 'Access Professional Suite',
    secondary: 'Explore Tax Integration',
    urgency: 'Tax season preparation starts now',
    benefits: ['Automated tax workflows', 'Client portal integration', 'Compliance tracking']
  },
  {
    role: 'attorney',
    primary: 'Join Legal Network',
    secondary: 'Explore Estate Tools',
    benefits: ['Estate planning software', 'Document automation', 'Client collaboration tools']
  }
];

export const EnhancedLandingPage: React.FC = () => {
  const { userProfile } = useUser();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [visitorCount, setVisitorCount] = useState(847);
  
  const userRole = userProfile?.role || 'client';
  const roleConfig = roleSpecificCTAs.find(r => r.role === userRole) || roleSpecificCTAs[0];

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Simulate live visitor count
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Physician",
      content: "The healthcare-specific planning saved me $50K in taxes this year.",
      rating: 5
    },
    {
      name: "Mark Williams",
      role: "Financial Advisor",
      content: "My client retention improved 40% since joining this platform.",
      rating: 5
    },
    {
      name: "Jennifer Chen",
      role: "CPA",
      content: "The automated workflows cut my tax prep time in half.",
      rating: 5
    }
  ];

  const pressMentions = [
    { name: "Forbes", logo: "📈" },
    { name: "WSJ", logo: "📰" },
    { name: "Financial Planning", logo: "💼" },
    { name: "CPA Journal", logo: "📊" }
  ];

  return (
    <div className="min-h-screen bg-[#0B2239]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Social Proof Banner */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="animate-pulse">
              <Users className="h-3 w-3 mr-1" />
              {visitorCount} advisors online
            </Badge>
            <Badge variant="outline">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              4.9/5 rating
            </Badge>
            <Badge variant="outline">
              <Trophy className="h-3 w-3 mr-1 text-primary" />
              #1 Family Office Platform
            </Badge>
          </div>

          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            The Only Family Office Platform
            <br />
            Built for {getRoleDisplayName(userRole)}s
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {userRole === 'advisor' 
              ? "Join 500+ advisors managing $2.3B in assets with our comprehensive platform"
              : userRole === 'accountant'
              ? "Streamline tax workflows and collaborate seamlessly with financial advisors"
              : "Access institutional-quality wealth management tools previously available only to ultra-high-net-worth families"
            }
          </p>

          {/* Urgency Element */}
          {roleConfig.urgency && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="text-red-600 font-medium">{roleConfig.urgency}</span>
            </div>
          )}

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/25">
              {roleConfig.primary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:bg-secondary/10">
              {roleConfig.secondary}
            </Button>
          </div>

          {/* Benefits Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {roleConfig.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-3 p-4 bg-white/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          {/* Press Mentions */}
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-muted-foreground mb-6">As Featured In</h3>
            <div className="flex justify-center items-center gap-8 opacity-60">
              {pressMentions.map((press, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-2xl">{press.logo}</span>
                  <span className="font-semibold">{press.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Carousel */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl italic mb-4">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
              </div>
              
              {/* Testimonial Indicators */}
              <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle>Wait! Don't miss out</CardTitle>
              <CardDescription>
                Get a free consultation before you go
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Book a 15-minute call with our {userRole} specialist and get:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Free portfolio review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Personalized recommendations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  No obligation consultation
                </li>
              </ul>
              <div className="flex gap-2">
                <Button className="flex-1">Book Free Call</Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowExitIntent(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};