
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Shield, TrendingUp, Users } from "lucide-react";

const PublicHomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Secure Family Office Financial Management</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Comprehensive tools for high-net-worth families to manage investments, 
            estate planning, and wealth preservation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              asChild
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <Link to="/secure-login">Get Started</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Family Office Solutions</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10" />}
              title="Investment Management"
              description="Sophisticated portfolio management tools with real-time analytics and insights for optimal wealth growth."
            />
            
            <FeatureCard 
              icon={<Shield className="h-10 w-10" />}
              title="Estate Planning"
              description="Secure document vault and tools to simplify estate planning, inheritance, and wealth preservation."
            />
            
            <FeatureCard 
              icon={<Users className="h-10 w-10" />}
              title="Family Collaboration"
              description="Tools designed for multi-generational family governance and secure information sharing."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Family Office?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join other high-net-worth families who trust our platform for their financial management needs.
          </p>
          <Button 
            size="lg" 
            asChild
            className="px-6"
          >
            <Link to="/secure-login">
              Get Started Today
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
        {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default PublicHomePage;
