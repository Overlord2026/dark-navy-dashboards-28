import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, FileText, Users, Target, DollarSign, Shield, Calculator, CheckCircle, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function InsuranceLifeAnnuityLanding() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Product Illustration Tools",
      description: "Built-in calculators for term, whole life, universal life, and annuities with side-by-side comparisons."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Retirement Roadmap™ Integration",
      description: "Show clients how insurance products fill income gaps and protect their retirement strategy."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Stress-Testing Scenarios",
      description: "Model market crashes, death of primary earner, early retirement, and LTC events."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Instant PDF Proposals",
      description: "Generate branded proposals combining insurance illustrations with retirement plan scenarios."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Cross-Sell Engine",
      description: "Auto-tag prospects for additional products based on retirement roadmap analysis."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Portal Access",
      description: "Clients can view how products fit their strategy and toggle different scenarios."
    }
  ];

  const benefits = [
    {
      title: "Higher Close Rates",
      description: "Visual retirement planning transforms product presentations into compelling needs-based conversations",
      metric: "32% increase",
      icon: <Target className="h-8 w-8 text-green-500" />
    },
    {
      title: "More Cross-Sells",
      description: "Retirement roadmap reveals natural opportunities for annuities, life insurance, and LTC coverage",
      metric: "45% more products",
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Professional Presentations",
      description: "White-labeled reports and client portals position you as a comprehensive financial professional",
      metric: "90% client satisfaction",
      icon: <Shield className="h-8 w-8 text-purple-500" />
    }
  ];

  const products = [
    { name: "Term Life", icon: "🛡️" },
    { name: "Whole Life", icon: "💎" },
    { name: "Universal Life", icon: "🔄" },
    { name: "Variable Annuities", icon: "📈" },
    { name: "Fixed Indexed Annuities", icon: "🏦" },
    { name: "LTC Hybrid Policies", icon: "🏥" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                <DollarSign className="h-4 w-4 mr-2" />
                Life Insurance & Annuity Sales
              </Badge>
              <h1 className="text-5xl font-bold leading-tight">
                Sell Smarter:{' '}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Life Insurance, Annuities
                </span>{' '}
                & Retirement Planning in One Platform
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Turn every quote into a holistic plan your clients can visualize — and close more business.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8"
                onClick={() => navigate('/insurance-life-annuity/onboarding')}
              >
                <Target className="mr-2 h-5 w-5" />
                Start My Free Planning & Sales Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate('/insurance-life-annuity/roadmap-demo')}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                See the Roadmap in Action
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">White-Labeled Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Instant Illustrations</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Agent Proven</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Product Illustrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/20 rounded"></div>
                    <div className="h-2 bg-primary/40 rounded w-3/4"></div>
                    <div className="h-2 bg-primary rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-secondary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Retirement Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary/40 rounded w-5/6"></div>
                    <div className="h-2 bg-secondary/60 rounded"></div>
                    <div className="h-2 bg-secondary rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Income Gap Identified</div>
                <div className="text-2xl font-bold text-orange-600">$2,400/mo</div>
                <div className="text-xs">Recommended: Fixed Indexed Annuity</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Focus Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-muted/50 to-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Complete Product Suite</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sell and illustrate all major life insurance and annuity products with integrated retirement planning
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{product.icon}</div>
                  <div className="font-medium text-sm">{product.name}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Proven Sales Results</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Agents using our platform see dramatic improvements in close rates and client satisfaction
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <Card className="text-center h-full border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{benefit.metric}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform every prospect interaction into a comprehensive financial plan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Enter Client Profile", description: "Input current assets and retirement goals into the Roadmap" },
            { step: "2", title: "Identify Gaps", description: "Stress-test scenarios reveal income shortfalls and protection needs" },
            { step: "3", title: "Model Solutions", description: "Show how different products solve gaps with side-by-side comparisons" },
            { step: "4", title: "Close with Confidence", description: "Export branded PDF proposal combining illustrations with retirement plan" }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">Ready to Sell Smarter?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of agents who've transformed their sales process with integrated retirement planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8"
              onClick={() => navigate('/insurance-life-annuity/onboarding')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
            >
              <FileText className="mr-2 h-5 w-5" />
              Download Sales Guide
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}