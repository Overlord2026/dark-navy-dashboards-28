import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LinkedinIcon, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  Shield,
  Award,
  Building,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      icon: <Users className="w-6 h-6" />,
      title: "Elite Client Network",
      description: "Connect with high-net-worth families and ultra-high-net-worth individuals"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Verified Credentials",
      description: "Showcase your expertise with verified professional credentials"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Visibility",
      description: "Featured placement in our exclusive professional marketplace"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Ready",
      description: "GDPR compliant platform with enterprise-grade security"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Elite Professionals" },
    { number: "$2.8B+", label: "Assets Under Management" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "150+", label: "Family Offices" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Award className="w-4 h-4 mr-2" />
            Exclusive Professional Network
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Join the Elite
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Connect with ultra-high-net-worth families through our exclusive marketplace.
            <br />
            <span className="font-semibold text-foreground">Import your LinkedIn profile in seconds.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={handleLinkedInAuth}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              disabled={loading}
            >
              <LinkedinIcon className="w-5 h-5 mr-3" />
              {loading ? 'Connecting...' : 'Sign in with LinkedIn'}
            </Button>
            
            <Button 
              onClick={handleManualSignup}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Manual Setup
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center h-full border-muted/40">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {benefit.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* LinkedIn Import Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                <LinkedinIcon className="w-6 h-6" />
                LinkedIn Import Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <Building className="w-8 h-8 mx-auto text-blue-600" />
                  <h4 className="font-semibold">Professional Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Name, headline, current role, company, and bio automatically imported
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Award className="w-8 h-8 mx-auto text-blue-600" />
                  <h4 className="font-semibold">Experience & Education</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete work history and educational background with one click
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Globe className="w-8 h-8 mx-auto text-blue-600" />
                  <h4 className="font-semibold">Professional Photo</h4>
                  <p className="text-sm text-muted-foreground">
                    High-quality profile photo imported directly from LinkedIn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700 dark:text-green-300">
              Privacy & Security Guaranteed
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your LinkedIn data is imported securely and stored with enterprise-grade encryption. 
            We never post to your LinkedIn without permission and comply with all GDPR requirements.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinProsLanding;