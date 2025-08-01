import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Calendar,
  Users,
  DollarSign,
  Target,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { EnhancedCalculatorChart } from '@/components/calculators/EnhancedCalculatorChart';
import { Celebration } from '@/components/ConfettiAnimation';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function TaxCenter() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [chartData, setChartData] = useState([]);
  const { toast } = useToast();

  // Generate sample tax projection data
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const projectionData = [];
    for (let i = 0; i < 5; i++) {
      projectionData.push({
        year: currentYear + i,
        savings: 27000 + (i * 1000)
      });
    }
    setChartData(projectionData);
  }, []);

  const actionCards = [
    {
      title: "Roth Conversion Analyzer",
      description: "Optimize your retirement tax strategy with smart conversion timing",
      icon: TrendingUp,
      route: "/calculators",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      savings: "$47K",
      timeframe: "over 10 years"
    },
    {
      title: "Tax Return Analyzer", 
      description: "Upload your tax return for personalized optimization insights",
      icon: FileText,
      route: "/tax-return-upload",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      savings: "$12K",
      timeframe: "annually"
    },
    {
      title: "Withdrawal Sequencing",
      description: "Minimize taxes with optimal account withdrawal strategies",
      icon: Target,
      route: "/calculators",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      savings: "$23K",
      timeframe: "in retirement"
    },
    {
      title: "Tax Bracket Projector",
      description: "Forecast future tax brackets and plan accordingly",
      icon: Calculator,
      route: "/calculators",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      savings: "$8K",
      timeframe: "next year"
    }
  ];

  const handleActionClick = (card: any) => {
    toast({
      title: "Launching Analysis",
      description: `Opening ${card.title} to help you save ${card.savings} ${card.timeframe}`
    });
    
    // Trigger confetti for engagement
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Celebration trigger={showConfetti} />
      
      <motion.div 
        className="container mx-auto px-4 py-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Banner */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary-foreground text-white p-8">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Tax Optimization & Education Center
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                Slash Taxes. Boost Wealth.
                <span className="block text-primary-foreground/90">Confidently.</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover personalized strategies to minimize your tax burden and maximize your wealth with AI-powered insights.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 mt-6"
                onClick={() => handleActionClick({ title: "Tax Analysis", savings: "$25K+", timeframe: "this year" })}
              >
                Run My Tax Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Animated Chart Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  5-Year Tax Savings Projection
                </h2>
                <p className="text-muted-foreground">
                  See how optimization strategies compound your savings over time
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">$158,000</div>
                <div className="text-sm text-muted-foreground">Total Projected Savings</div>
              </div>
            </div>
            
            <EnhancedCalculatorChart
              data={chartData}
              type="area"
              xKey="year"
              yKey="savings"
              title="Annual Tax Savings Projection"
              color="#10b981"
              animated={true}
              height={300}
            />
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-600">$27K+</div>
                <div className="text-sm text-muted-foreground">Year 1 Savings</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-600">$31K+</div>
                <div className="text-sm text-muted-foreground">Year 5 Projected</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-600">32%</div>
                <div className="text-sm text-muted-foreground">Tax Reduction</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Cards Gallery */}
        <motion.div variants={itemVariants}>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Smart Tax Tools</h2>
              <p className="text-muted-foreground mt-2">
                Choose your optimization strategy and start saving immediately
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {actionCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="relative overflow-hidden group cursor-pointer h-full">
                    <Link to={card.route} onClick={() => handleActionClick(card)}>
                      <div className={`${card.color} p-6 text-white relative`}>
                        <div className="absolute top-4 right-4">
                          <card.icon className="w-8 h-8 opacity-80" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold">{card.title}</h3>
                          <p className="text-white/90 text-sm">{card.description}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{card.savings}</div>
                            <div className="text-xs text-white/80">{card.timeframe}</div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                          >
                            Try Now
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Personalized recommendations</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Instant results</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Export to CPA</span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Access Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Education Library</h3>
                <p className="text-sm text-muted-foreground">
                  Access expert guides on tax planning strategies
                </p>
                <Link to="/client-education">
                  <Button variant="outline" size="sm">Browse Guides</Button>
                </Link>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">CPA Connect</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule consultations with tax professionals
                </p>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consult
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">My Tax Reports</h3>
                <p className="text-sm text-muted-foreground">
                  View your personalized tax analysis history
                </p>
                <Button variant="outline" size="sm">View Reports</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sticky Help Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            size="lg" 
            className="shadow-lg bg-primary hover:bg-primary/90 rounded-full px-6"
          >
            <Users className="w-5 h-5 mr-2" />
            Need Help? Chat Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
}