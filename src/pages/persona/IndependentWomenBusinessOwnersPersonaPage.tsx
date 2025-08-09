import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  TrendingUp, 
  Heart, 
  Users, 
  BarChart3, 
  Brain, 
  Lock, 
  FileText, 
  Calendar, 
  Target,
  CheckCircle,
  Zap,
  ArrowRight,
  PlayCircle,
  Star,
  Settings,
  Award,
  BookOpen,
  DollarSign,
  Globe,
  Building2,
  PieChart,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const IndependentWomenBusinessOwnersPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: CheckCircle,
      title: 'Confidence in Every Decision',
      description: 'Access actionable insights for business and personal finances.'
    },
    {
      icon: Target,
      title: 'Tailored Planning Tools',
      description: 'From growth to retirement, built for women-led enterprises.'
    },
    {
      icon: Users,
      title: 'Supportive Ecosystem',
      description: 'Connect with vetted advisors and a community of women entrepreneurs.'
    }
  ];

  const keyFeatures = [
    { icon: PieChart, text: 'Unified dashboard for business KPIs and personal net worth' },
    { icon: Brain, text: 'AI-driven cash flow and tax planning tools' },
    { icon: TrendingUp, text: 'SWAG™ Retirement Roadmap for long-term personal planning' },
    { icon: FileText, text: 'Estate planning and family legacy tools' },
    { icon: Calendar, text: 'Business compliance reminders and document storage' },
    { icon: Users, text: 'Professional marketplace with women-focused advisory partners' },
    { icon: MessageSquare, text: 'Secure communication and collaboration tools' }
  ];

  const integratedTools = [
    {
      title: 'Linda AI Assistant',
      description: 'For proposal creation, meeting summaries, and marketing ideas'
    },
    {
      title: 'Built-in Compliance Platform',
      description: 'For business and financial records'
    },
    {
      title: 'Template Library',
      description: 'Access to templates for contracts, business plans, and funding pitches'
    }
  ];

  const testimonials = [
    {
      quote: "This platform gave me control over both my business and personal finances.",
      author: "Founder, Tech Consultancy"
    },
    {
      quote: "I love having tools designed with women business owners in mind.",
      author: "CEO, Creative Agency"
    },
    {
      quote: "The integrated retirement and legacy planning helps me think long-term.",
      author: "Owner, Wellness Business"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Independent Women Business Owners
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Own Your Business, Build Your Legacy
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Empowering independent women entrepreneurs with tools for business success and personal wealth mastery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=independent-women-business-owners')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('#features')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
              >
                See How It Works
                <PlayCircle className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-gold/30 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                      <prop.icon className="w-8 h-8 text-navy" />
                    </div>
                    <CardTitle className="text-xl">{prop.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {prop.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Empowering Women Entrepreneurs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tools designed specifically for women-led businesses and personal wealth building
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-card/30 border border-border"
              >
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-gold" />
                </div>
                <span className="text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Feature Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Business Success</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Leadership</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Legacy Building</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Community</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrated Tools Callout */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              AI-Powered Solutions for Women Entrepreneurs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced tools and resources designed with women-led businesses in mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {integratedTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border border-gold/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Zap className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{tool.title}</h3>
                        <p className="text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Trusted by Women Leaders
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full p-6 bg-card border border-gold/20">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                    </div>
                    <blockquote className="text-foreground mb-4 italic flex-1">
                      "{testimonial.quote}"
                    </blockquote>
                    <cite className="text-muted-foreground text-sm">— {testimonial.author}</cite>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Plans starting at $49/month — tailored for independent women entrepreneurs
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Professional platform designed to support women-led business success
            </p>
            
            <Button 
              size="lg"
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
            >
              View Plans & Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="font-serif text-5xl font-bold text-foreground">
              Lead with Confidence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your business. Your wealth. Your future — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=independent-women-business-owners')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Start Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/request')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
              >
                Book a Demo
                <Globe className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};