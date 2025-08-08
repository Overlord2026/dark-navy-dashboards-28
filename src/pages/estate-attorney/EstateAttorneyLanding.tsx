import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Shield, 
  Users, 
  FileText, 
  Target,
  ArrowRight,
  CheckCircle,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EstateAttorneyLanding() {
  const valueProps = [
    {
      icon: Shield,
      title: 'Client Vaults',
      description: 'Secure, encrypted storage for all estate documents'
    },
    {
      icon: Target,
      title: 'SWAG Retirement Roadmap™',
      description: 'Model legacy & tax implications with integrated planning'
    },
    {
      icon: Users,
      title: 'Compliance & Collaboration',
      description: 'Work with clients, accountants, and advisors in one portal'
    },
    {
      icon: Award,
      title: 'White-Label Ready',
      description: 'Your brand, our infrastructure'
    }
  ];

  const features = [
    'Secure Digital Vault for all estate documents',
    'Legacy Impact Reports with tax implications',
    'Scenario modeling for estate planning',
    'Integrated notary scheduling',
    'Referral network access',
    'White-label branding options'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 text-white"
            >
              <div>
                <Badge className="mb-4 bg-white/10 text-white border-white/20">
                  Estate Planning Excellence
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Your Digital{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Family Office
                  </span>{' '}
                  for Estate Planning
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Streamline client engagement, expand your practice, and give clients 
                  the lifetime wealth and legacy tools the ultra-wealthy have.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  <Scale className="h-5 w-5 mr-2" />
                  For Attorneys - Start Your Portal
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Shield className="h-5 w-5 mr-2" />
                  For Clients - Protect Your Legacy
                </Button>
              </div>
            </motion.div>

            {/* Right Column - Split Screen Imagery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attorney Side */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <Scale className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Attorney Portal</h3>
                      <p className="text-sm text-blue-100">
                        Digital trust reviews, client collaboration, and practice management
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Side */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Family Portal</h3>
                      <p className="text-sm text-blue-100">
                        Secure vault access, legacy planning, and wealth roadmap
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything You Need to Modernize Your Practice
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform how you serve clients with integrated tools for estate planning, 
            wealth management, and legacy protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <prop.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Complete Estate Planning Suite</h3>
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button className="mt-8" size="lg">
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center">Ready to Transform Your Practice?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600">10 Minutes</div>
              <p className="text-muted-foreground">
                That's all it takes to set up your branded estate planning portal 
                and start serving clients in a whole new way.
              </p>
              <Button className="w-full" size="lg">
                Begin Setup Process
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Join the Future of Estate Planning
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Give your clients the comprehensive wealth and legacy planning experience 
              they deserve, while growing your practice with modern tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Schedule Demo
              </Button>
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}