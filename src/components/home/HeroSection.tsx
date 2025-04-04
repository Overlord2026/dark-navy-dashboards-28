
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-[#1B1B32] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Financial Expertise Tailored for Your Legacy</h1>
          <p className="text-xl mb-8 text-gray-300">
            Boutique Family Office provides comprehensive wealth management services designed specifically for high-net-worth individuals and families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90" asChild>
              <Link to="/login">
                Client Portal 
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
