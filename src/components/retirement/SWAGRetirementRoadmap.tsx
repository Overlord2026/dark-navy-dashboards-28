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
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Income Now, Later, Growth, Legacy",
      description: "A year-by-year, tax-smart income forecast for every stage of your financial journey."
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "S.M.A.R.T. Goals",
      description: "Needs, Wants, Wishes, all planned—so nothing is left out of your family's financial strategy."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Surviving Spouse (Widow's Penalty) Analysis",
      description: "We model what happens if one spouse passes first, so your family never faces an avoidable tax shock or income drop."
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "LTC Stress Test",
      description: "Know—before it's too late—whether you can self-insure for LTC or should hedge this risk."
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      title: "Social Security & Roth Optimization",
      description: "Make the most of every benefit with coordinated, multi-year planning and integrated strategy."
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Proactive Tax & Roth Strategy",
      description: "Model Roth conversions, minimize lifetime taxes, and protect your legacy."
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Ongoing Updates",
      description: "Your roadmap is a living document, updated as your life changes—just like a business reviews its financials quarterly or annually."
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
            Your Family Office. Your Personal CFO. Your Customized Retirement Roadmap.
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Just like every great business has a CFO and a forward-looking plan, your family deserves its own financial GPS. Our SWAG™ Retirement Roadmap is your holistic, living strategy—integrating income, taxes, Social Security, long-term care, and legacy planning.
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
          <h3 className="text-xl font-bold text-foreground mb-4">Ready for True Financial Confidence?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-2">
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
              Book Right Fit Call
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={handleDownloadSample}
            >
              See Sample Roadmap
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Your family deserves a financial forecast—led by your own CFO.</strong> DIY or ongoing support, satisfaction guaranteed.
          </p>
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
            Our SWAG™ Roadmap isn't just a one-time "plan"—it's your ongoing financial GPS.
          </h3>
          <p className="text-muted-foreground mb-4">
            Your family. Your legacy. Your own personal CFO.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Whether you're a DIYer, working with another advisor, or want the full family office experience.</strong>
          </p>
        </div>
      </Card>
    </div>
  );
};