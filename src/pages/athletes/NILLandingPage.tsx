import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Shield, 
  DollarSign, 
  Users, 
  Star, 
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Heart,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NILLandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'NIL Compliance',
      description: 'Stay compliant with NCAA and state regulations while maximizing opportunities',
      color: 'text-blue-500'
    },
    {
      icon: DollarSign,
      title: 'Financial Education',
      description: 'Learn to manage NIL income, taxes, and build long-term wealth',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Brand Building',
      description: 'Develop your personal brand and social media presence professionally',
      color: 'text-purple-500'
    },
    {
      icon: Star,
      title: 'Risk Protection',
      description: 'Avoid scams, bad contracts, and costly mistakes with expert guidance',
      color: 'text-yellow-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Basketball Player, Stanford',
      quote: 'NIL Smart Money helped me understand contracts and build my brand safely. The education is game-changing.',
      avatar: '🏀'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Football Player, Ohio State',
      quote: 'The tax planning modules saved me thousands. Every athlete needs this education before signing deals.',
      avatar: '🏈'
    },
    {
      name: 'Coach Williams',
      role: 'Athletic Director, Texas A&M',
      quote: 'We recommend NIL Smart Money to all our athletes. The compliance focus gives us confidence.',
      avatar: '👨‍💼'
    }
  ];

  const userTypes = [
    {
      type: 'Athletes',
      icon: Trophy,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      description: 'Current and future college athletes'
    },
    {
      type: 'Parents',
      icon: Heart,
      color: 'bg-pink-50 text-pink-700 border-pink-200',
      description: 'Supporting families and guardians'
    },
    {
      type: 'Coaches',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Athletic directors and coaching staff'
    },
    {
      type: 'Advisors',
      icon: GraduationCap,
      color: 'bg-green-50 text-green-700 border-green-200',
      description: 'Financial and legal professionals'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30">
                🎓 Powered by Boutique Family Office™
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Empower Your NIL Journey
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                The only all-in-one NIL education platform for athletes, families, and coaches—
                100% privacy-first, always fiduciary
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/athletes/nil-onboarding')}
                >
                  Start Learning
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>100% Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>NCAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Expert Guidance</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for NIL Success</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive education covering compliance, finance, branding, and protection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary/20 transition-colors">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${feature.color}`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Everyone in the NIL Ecosystem</h2>
            <p className="text-lg text-muted-foreground">
              Tailored content and resources for each role
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((userType, index) => (
              <Card key={index} className={`border-2 ${userType.color}`}>
                <CardContent className="pt-6 text-center">
                  <userType.icon className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{userType.type}</h3>
                  <p className="text-sm opacity-80">{userType.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Athletes and Coaches</h2>
            <p className="text-lg text-muted-foreground">
              Real success stories from the NIL Smart Money community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your NIL Education?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of athletes, families, and coaches who trust NIL Smart Money 
              for their education and compliance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/athletes/nil-onboarding')}
              >
                Start Learning Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Refer a Teammate Section */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Refer a Teammate</h2>
            <p className="text-muted-foreground mb-6">
              Help your teammates get the NIL education they need. Both you and your referral 
              will unlock exclusive bonus content and progress tracking features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Invite Teammates
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Share Resources
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NILLandingPage;