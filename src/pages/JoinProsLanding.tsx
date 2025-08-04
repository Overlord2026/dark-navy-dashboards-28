import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      icon: <Shield className="w-8 h-8" />,
      title: "Get Discovered by High-Net-Worth Families",
      description: "Connect with ultra-high-net-worth individuals actively seeking trusted financial professionals"
    },
    {
      icon: <Bolt className="w-8 h-8" />,
      title: "Access Premium Tech & Training",
      description: "Cutting-edge tools, compliance resources, and exclusive educational content"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Invite Your Professional Network",
      description: "Build referral partnerships and expand your reach within the elite financial ecosystem"
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
          <Badge variant="secondary" className="mb-6 px-6 py-3 text-base">
            <Award className="w-5 h-5 mr-2" />
            Elite Family Office Marketplace
          </Badge>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-black mb-6 leading-tight"
            style={{ fontFamily: 'Inter, Lato, sans-serif', fontWeight: 900 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Join the Elite
            </span>
            <br />
            <span className="text-foreground">
              Family Office Marketplace
            </span>
          </motion.h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed max-w-4xl mx-auto">
            <span className="font-semibold text-foreground">One-Click LinkedIn Onboarding</span>
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Advisors, CPAs, Attorneys: Showcase your expertise, connect with clients, and grow your practice.
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
                  'Sign in with LinkedIn'
                )}
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>
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
            <h2 className="text-4xl font-bold mb-4">Why Elite Professionals Choose Us</h2>
            <p className="text-xl text-muted-foreground">Join thousands of top-tier professionals already growing their practice</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
      <HowItWorksSection />

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Privacy Notice */}
      <div className="py-12 bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto px-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary text-lg">
              Privacy & Security Guaranteed
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Your LinkedIn data is imported securely and stored with enterprise-grade encryption. 
            We never post to your LinkedIn without permission and comply with all GDPR requirements.
            <span className="block mt-2 text-sm">
              <CheckCircle className="w-4 h-4 inline mr-2 text-primary" />
              SOC 2 Compliant • GDPR Ready • Bank-Level Security
            </span>
          </p>
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