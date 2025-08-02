import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Shield, BookOpen, Sparkles } from "lucide-react";

interface AnnuitiesHeroProps {
  onScheduleExpert: () => void;
}

export const AnnuitiesHero = ({ onScheduleExpert }: AnnuitiesHeroProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-8 py-16 text-center">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full border border-amber-400/30 mb-6">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-amber-300 font-medium">Premium Annuity Center</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          Annuities Made
          <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent"> Clear</span>
        </h1>

        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Learn, compare, and analyze annuity products with institutional-grade tools and fiduciary guidance.
        </p>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
          {[
            { icon: DollarSign, label: "Avg. Portfolio Value", value: "$2.4M", color: "text-emerald-400" },
            { icon: TrendingUp, label: "Income Projected", value: "8.2%", color: "text-amber-400" },
            { icon: Shield, label: "Fiduciary Products", value: "100%", color: "text-blue-400" },
            { icon: BookOpen, label: "Education Hours", value: "12+", color: "text-purple-400" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-semibold px-8 py-6 text-lg"
            onClick={onScheduleExpert}
          >
            <Shield className="h-5 w-5 mr-2" />
            Get Expert Review
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Start Learning
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 mb-2">Trusted by over 10,000 families</p>
          <div className="flex justify-center items-center gap-6 text-xs text-slate-500">
            <span>✓ Fiduciary Standard</span>
            <span>✓ Fee-Only Advice</span>
            <span>✓ Institutional Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};