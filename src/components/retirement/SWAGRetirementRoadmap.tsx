import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, Calculator, Users, MapPin, TrendingUp, Lock } from "lucide-react";

interface SWAGRetirementRoadmapProps {
  className?: string;
}

export const SWAGRetirementRoadmap: React.FC<SWAGRetirementRoadmapProps> = ({ className }) => {
  const features = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "SMART Goals-Based Planning",
      description: "Clarify your Needs, Wants, and Wishes—customized to your lifestyle, legacy, and retirement vision."
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "4-Phase, Time-Segmented Strategies",
      description: "Income Now, Income Later, Growth, and Legacy—see where you stand at every phase of your financial journey."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Surviving Spouse (Widow's Penalty) Analysis",
      description: "Plan for your partner's financial security. We model Social Security reductions, tax bracket changes, and portfolio needs if one spouse passes first."
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Long-Term Care (LTC) Stress Testing",
      description: "Can you self-insure, or should you hedge with LTC coverage? We test your plan against real-world costs to protect your lifestyle and your heirs."
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      title: "Social Security Optimization",
      description: "Maximize benefits, minimize taxes, and coordinate with your income and legacy goals for optimal claiming strategies."
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Proactive Tax Planning & Roth Conversions",
      description: "Model and execute multi-year tax reduction, including Roth conversions, bracket management, and legacy tax minimization."
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Secure SWAG™ Vault",
      description: "All your planning docs, digital legacy, and recommendations—organized, up-to-date, and always accessible."
    }
  ];

  const processSteps = [
    "Start Your Free Scorecard",
    "Book a Right Fit Call—review goals and scorecard with an advisor",
    "Get Your Customized Roadmap—including surviving spouse and LTC stress tests",
    "Decide your next steps—DIY, ongoing support, or premium Family Office services"
  ];

  const handleStartScorecard = () => {
    // TODO: Implement scorecard functionality
    console.log("Starting SWAG™ Scorecard");
  };

  const handleBookRightFitCall = () => {
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handleDownloadSample = () => {
    // TODO: Implement sample roadmap download
    console.log("Downloading sample roadmap");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Hero Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-2xl border border-primary/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Personalized SWAG™ Retirement Roadmap
          </h1>
          <p className="text-xl text-muted-foreground">
            The Family Office Solution for Confident, Tax-Smart, and Secure Retirement
          </p>
          <p className="text-base text-muted-foreground mt-2">
            Protect your family, reduce your taxes, and achieve true peace of mind with our advanced, holistic process—delivered on your terms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border">
              <div className="text-primary mt-1">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-4">Ready to Take Control?</h3>
          <p className="text-muted-foreground mb-6">
            Start with our free scorecard or book your complimentary "Right Fit" call.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={handleStartScorecard}
            >
              Start Free Scorecard
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleBookRightFitCall}
            >
              Book My Right Fit Call
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleDownloadSample}
            >
              Download Sample Roadmap
            </Button>
          </div>
        </div>
      </Card>

      {/* Process Steps */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          A 4-Step Process to Retirement Confidence
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center p-4 bg-card/50 rounded-lg border">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                {index + 1}
              </div>
              <p className="text-sm font-medium text-foreground">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Value Proposition */}
      <Card className="bg-muted/30 p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-3">
            Find out if your family is at risk for the widow's penalty
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
            <div>
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">See if you can self-insure for long-term care</p>
            </div>
            <div>
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Discover your true Social Security, tax, and Roth conversion opportunities</p>
            </div>
            <div>
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Get clear, actionable steps—no pressure, just peace of mind</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Most "retirement plans" miss these critical risks—don't let that be your family's story.</strong> Our fiduciary process stress-tests for what matters most, so you can retire (and stay retired) with confidence.
          </p>
        </div>
      </Card>

      {/* Premium Callout */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 p-6 border border-accent/20">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-3">
            Our SWAG™ Roadmap is the ultimate first step
          </h3>
          <p className="text-muted-foreground mb-4">
            Whether you're a do-it-yourselfer, want a second opinion, or just want a true family office experience. 
            Secure your future, protect your spouse, and maximize your legacy—all with one, holistic plan.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>DIY or ongoing support—our roadmap is satisfaction guaranteed, with no sales pitch or pressure.</strong>
          </p>
        </div>
      </Card>
    </div>
  );
};