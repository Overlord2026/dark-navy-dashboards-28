import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '../styles/accessibility.css';
import { 
  LinkedinIcon, 
  Shield,
  Bolt,
  Network,
  Users,
  Award,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecentlyJoinedTicker from '@/components/marketplace/RecentlyJoinedTicker';
import TrustedPartners from '@/components/landing/TrustedPartners';
import SocialProofSection from '@/components/landing/SocialProofSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';

const JoinProsLanding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLinkedInAuth = () => {
    setLoading(true);
    const clientId = '78c9g8au2ddoil';
    const redirectUri = encodeURIComponent(`${window.location.origin}/pro-onboarding`);
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const state = 'join-pros-' + Math.random().toString(36).substring(7);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  };

  const handleManualSignup = () => {
    navigate('/pro-onboarding?manual=true');
  };

  const benefits = [
    {
      icon: <Bolt className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Create your account in seconds—no tedious forms."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Professional Grade",
      description: "Bring over your credentials, education, and testimonials."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Instant Credibility",
      description: "Verified LinkedIn import for trust and transparency."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Seamless Onboarding",
      description: "Your personalized dashboard is ready as soon as you sign in."
    }
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-black mb-6 leading-tight"
            style={{ fontFamily: 'Inter, Lato, sans-serif', fontWeight: 900 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Experience the Next Generation of Professional Networking
            </span>
          </motion.h1>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Our Family Office Marketplace™ is designed for top advisors, attorneys, accountants, consultants, and coaches. Import your LinkedIn profile to join an exclusive community, showcase your expertise, and connect with families seeking trusted guidance.
          </p>

          {/* Main CTA Button */}
          <motion.div
            className="mb-16"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.div
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                onClick={handleLinkedInAuth}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl border-2 border-blue-500/20 relative overflow-hidden group"
                disabled={loading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={isHovered ? { x: ["100%", "-100%"] } : {}}
                  transition={{ duration: 0.6 }}
                />
                <LinkedinIcon className="w-6 h-6 mr-4" />
                 {loading ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Connecting...
                  </motion.span>
                ) : (
                  '🔗 Import from LinkedIn'
                )}
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Or Divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-muted-foreground text-sm">— or complete your profile manually —</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <Button 
            onClick={handleManualSignup}
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Complete Profile Manually
          </Button>
        </motion.div>
      </div>

      {/* Recently Joined Ticker */}
      <RecentlyJoinedTicker />

      {/* Trusted Partners */}
      <TrustedPartners />

      {/* Benefits Section */}
      <div className="py-16 bg-gradient-to-br from-background via-muted/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Import from LinkedIn?</h2>
            <p className="text-xl text-muted-foreground">Create your professional profile in seconds with these exclusive benefits</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full text-center border-muted/40 group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-xl">
                  <CardContent className="p-8">
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary/20 transition-colors">
                        {benefit.icon}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in just 4 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Click \"Import from LinkedIn\"",
                description: "Start your journey with a single click"
              },
              {
                step: "2", 
                title: "Authorize securely with LinkedIn (one click)",
                description: "Quick and secure OAuth authentication"
              },
              {
                step: "3",
                title: "Preview and edit your imported profile", 
                description: "Review and customize your professional information"
              },
              {
                step: "4",
                title: "Go live instantly in the Family Office Marketplace",
                description: "Your profile becomes discoverable immediately"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* How We Use Your Data Section */}
      <div className="py-12 bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto px-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary text-lg">
              How We Use Your Data
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We use your LinkedIn data only to create your professional profile. Your privacy is our top priority—no data is ever sold or shared.
          </p>
        </motion.div>
      </div>

      {/* Social Proof/Trust Section */}
      <div className="py-16 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-8">Already Trusted By</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold">Top Advisors</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold">Elite Attorneys</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="font-semibold">Expert Accountants</h3>
            </div>
          </div>

          <blockquote className="text-xl italic text-muted-foreground mb-4">
            "Finally, a platform where professionals and families can connect with trust and transparency."
          </blockquote>
          <cite className="text-sm text-primary font-semibold">— Industry Leader</cite>
        </motion.div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <Button 
          onClick={handleLinkedInAuth}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-bold"
          disabled={loading}
        >
          <LinkedinIcon className="w-5 h-5 mr-2" />
          Join Now
        </Button>
      </div>
    </div>
  );
};

export default JoinProsLanding;