import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AnimatedTreeHero } from './AnimatedTreeHero';
import { LandingNavigation } from './LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import { withTrademarks } from '@/utils/trademark';
import { 
  Shield, 
  TrendingUp, 
  FileText, 
  Vault, 
  PieChart, 
  DollarSign,
  Calculator,
  Download,
  Check,
  Lock,
  Users,
  ArrowRight,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PublicLandingPage: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState('');
  const [currentFee, setCurrentFee] = useState('');
  const [showCalculation, setShowCalculation] = useState(false);
  const [email, setEmail] = useState('');
  const [guideDownloaded, setGuideDownloaded] = useState(false);

  const calculateSavings = () => {
    const portfolio = parseFloat(portfolioValue.replace(/[,$]/g, ''));
    const feePercent = parseFloat(currentFee) / 100;
    
    if (portfolio && feePercent) {
      const traditionalFees = portfolio * feePercent * 30; // 30 years
      const bfoFlatFee = 9500 * 30; // $9,500/year for 30 years
      const savings = traditionalFees - bfoFlatFee;
      const potentialGrowth = savings * Math.pow(1.06, 30) - savings; // 6% growth on savings
      
      return {
        traditionalFees: traditionalFees.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        bfoFees: bfoFlatFee.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        savings: savings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        potentialGrowth: potentialGrowth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      };
    }
    return null;
  };

  const calculation = showCalculation ? calculateSavings() : null;

  const differentiators = [
    {
      icon: Users,
      title: "True Family Office Integration",
      description: "We coordinate every aspect of your wealth: investments, tax, estate, insurance, private markets, and even healthcare."
    },
    {
      icon: TrendingUp,
      title: withTrademarks("Customized Retirement Roadmap"),
      description: withTrademarks("Our proprietary SWAG GPS™ process creates a science-driven plan for sustainable retirement income through all phases of life.")
    },
    {
      icon: PieChart,
      title: "Proactive Tax Planning",
      description: "Minimize lifetime taxes with integrated Roth conversions, withdrawal sequencing, and proactive strategies that work across your entire plan."
    },
    {
      icon: Vault,
      title: withTrademarks("Family Legacy Box™"),
      description: "Your estate, trusts, digital assets, and vital documents—organized and protected in a secure digital vault, reviewed and updated annually."
    },
    {
      icon: Star,
      title: "Private Market Alpha",
      description: "Exclusive access to endowment-style investments inspired by David Swensen's Yale model—now available to qualified families."
    },
    {
      icon: DollarSign,
      title: "Value-Driven, Transparent Pricing",
      description: "Flat or percentage-based fees tailored to your needs—always disclosed, never hidden."
    }
  ];

  const guides = [
    "Leveraging the Yale Endowment Model for Family Wealth (Inspired by David Swensen)",
    "Tax Optimization for Retirees & Pre-Retirees", 
    "The Ultimate Guide to Retirement Income Planning"
  ];

  const handleGuideDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setGuideDownloaded(true);
      // Here would integrate with email service
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 opacity-20">
          <AnimatedTreeHero />
        </div>
        
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Headlines */}
          <motion.div 
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <h1 className="font-serif text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                {withTrademarks("Boutique Family Office")} for Millionaires Next Door
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Retire once. Stay retired. Unlock a full suite of family office services—traditionally reserved for the ultra-wealthy—delivered with transparency, trust, and your interests first.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-elegant px-8 py-4 text-lg"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Discover Your Family Office Advantage
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gold/50 text-gold hover:bg-gold/10 px-8 py-4 text-lg"
                asChild
              >
                <Link to="/about#how-it-works">How It Works</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Tree Animation */}
          <motion.div 
            className="relative h-[400px] lg:h-[600px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedTreeHero />
          </motion.div>
        </div>
      </section>

      {/* How We're Different Section */}
      <section className="py-24 bg-card/30" id="differentiators">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
              How We're Different
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border border-border hover:border-gold/50 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Calculator Section */}
      <section className="py-24" id="calculator">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
              How Much Are You Really Paying for Investment Management?
            </h2>
            <p className="text-xl text-muted-foreground">
              If you have a $2,000,000 portfolio and pay a traditional 1.25% annual fee, you'll pay $1,665,459 over 30 years.
            </p>
          </motion.div>

          <Card className="bg-card/80 backdrop-blur-sm border border-gold/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Calculator className="h-6 w-6 text-gold" />
                Calculate Your Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio Value</label>
                  <Input
                    placeholder="$2,000,000"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Annual Fee (%)</label>
                  <Input
                    placeholder="1.25"
                    value={currentFee}
                    onChange={(e) => setCurrentFee(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white py-3 text-lg"
                onClick={() => setShowCalculation(true)}
                disabled={!portfolioValue || !currentFee}
              >
                Calculate My Fee & See My Value
              </Button>

              {calculation && (
                <motion.div 
                  className="mt-8 p-6 bg-emerald/10 border border-emerald/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-4">Your Potential Savings</h3>
                  <div className="space-y-3 text-lg">
                    <p>Traditional 30-year fees: <span className="font-bold text-error">{calculation.traditionalFees}</span></p>
                    <p>BFO typical flat fee: <span className="font-bold text-emerald">{calculation.bfoFees}</span></p>
                    <p className="text-2xl font-bold text-emerald border-t border-emerald/30 pt-3">
                      Potential savings: {calculation.savings}
                    </p>
                    <p className="text-emerald">Plus potential growth: {calculation.potentialGrowth}</p>
                  </div>

                  <div className="mt-6 p-4 bg-card/50 rounded-lg">
                    <h4 className="font-bold mb-3">For that fee, BFO families enjoy:</h4>
                    <ul className="space-y-2">
                      {[
                        "A customized retirement income roadmap",
                        withTrademarks("The Family Legacy Box™"),
                        "Ongoing tax planning",
                        "Private Market Alpha investments",
                        "Concierge-level advisory support"
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-primary hover:bg-gradient-primary/90 text-white">
                    Book My Custom Fee & Service Review
                  </Button>
                </motion.div>
              )}

              <p className="text-sm text-muted-foreground text-center">
                Actual pricing depends on your services, meeting frequency, and complexity. Some clients may choose percentage-based fees to bundle additional services.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Downloadable Guides Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Unlock Exclusive Insights—Free for All Visitors
            </h2>
          </motion.div>

          <Card className="bg-card/80 backdrop-blur-sm border border-gold/30 shadow-xl">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Available Guides:</h3>
                  <ul className="space-y-4">
                    {guides.map((guide, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-lg">{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {!guideDownloaded ? (
                    <form onSubmit={handleGuideDownload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="text-lg"
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white py-3 text-lg"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download My Guides
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center p-6 bg-emerald/10 border border-emerald/30 rounded-lg">
                      <Check className="h-12 w-12 text-emerald mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-emerald mb-2">Guides Sent!</h3>
                      <p className="text-emerald">Check your email for the download links.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {withTrademarks("Why Families Trust the Boutique Family Office™")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border border-border text-center">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-emerald mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">100% Fiduciary</h3>
                <p className="text-muted-foreground">No proprietary products, no commissions, no asset custody.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-border text-center">
              <CardContent className="p-8">
                <DollarSign className="h-16 w-16 text-gold mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Transparent Fees</h3>
                <p className="text-muted-foreground">Transparent, tailored fees—flat or percentage.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-border text-center">
              <CardContent className="p-8">
                <Star className="h-16 w-16 text-emerald mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Comprehensive Service</h3>
                <p className="text-muted-foreground">Comprehensive, concierge-level service for every aspect of your wealth.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Already invited? Enter your magic link below.
            </p>
            <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10" asChild>
              <Link to="/invite">Access Your Invitation</Link>
            </Button>
          </div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};