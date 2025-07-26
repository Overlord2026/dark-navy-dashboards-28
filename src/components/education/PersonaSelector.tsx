import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield,
  Briefcase
} from "lucide-react";

interface PersonaSelectorProps {
  onPersonaSelect: (persona: string) => void;
  selectedPersona?: string;
}

export interface Persona {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  recommendedPath: string;
  timeCommitment: string;
  focusAreas: string[];
}

const personas: Persona[] = [
  {
    id: "business-owner",
    title: "Business Owner",
    description: "Entrepreneurs and business owners looking to optimize both personal and business wealth strategies.",
    icon: <Building2 className="h-8 w-8 text-primary" />,
    features: [
      "Business succession planning",
      "Tax optimization strategies", 
      "Exit planning preparation",
      "Cash flow management"
    ],
    recommendedPath: "Start with DIY to Delegated, then Private Markets",
    timeCommitment: "6-8 hours total",
    focusAreas: ["Tax Planning", "Business Strategy", "Exit Planning"]
  },
  {
    id: "multi-generational",
    title: "Multi-Generational Family",
    description: "Families managing wealth across generations with complex governance and legacy planning needs.",
    icon: <Users className="h-8 w-8 text-primary" />,
    features: [
      "Family governance structures",
      "Multi-generational tax planning",
      "Next-gen wealth education",
      "Legacy preservation"
    ],
    recommendedPath: "Family Office Blueprint (complete series)",
    timeCommitment: "8-10 hours total",
    focusAreas: ["Family Governance", "Estate Planning", "Legacy Building"]
  },
  {
    id: "pre-retiree",
    title: "Pre-Retiree",
    description: "High-earning professionals approaching retirement with significant assets to manage and preserve.",
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    features: [
      "Retirement income strategies",
      "Healthcare cost planning",
      "Social Security optimization",
      "Tax-efficient withdrawals"
    ],
    recommendedPath: "Advisor Due Diligence, then Tax Planning modules",
    timeCommitment: "4-6 hours total",
    focusAreas: ["Retirement Planning", "Tax Strategy", "Income Planning"]
  }
];

export const PersonaSelector = ({ onPersonaSelect, selectedPersona }: PersonaSelectorProps) => {
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">No sales agenda—real education</span>
        </div>
        
        <h2 className="text-3xl font-bold text-foreground">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized education recommendations based on your situation and goals. 
          All content is designed by CFP® professionals with fiduciary duty.
        </p>
      </motion.div>

      {/* Persona Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <Card 
            key={persona.id}
            className={`cursor-pointer transition-all duration-300 h-full ${
              selectedPersona === persona.id 
                ? 'ring-2 ring-primary border-primary bg-primary/5' 
                : hoveredPersona === persona.id
                  ? 'shadow-lg border-primary/50'
                  : 'hover:shadow-md'
            }`}
            onMouseEnter={() => setHoveredPersona(persona.id)}
            onMouseLeave={() => setHoveredPersona(null)}
            onClick={() => onPersonaSelect(persona.id)}
          >
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                {persona.icon}
              </div>
              <div>
                <CardTitle className="text-xl mb-2">{persona.title}</CardTitle>
                <CardDescription className="text-sm">
                  {persona.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Key Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-foreground">What you'll learn:</h4>
                <ul className="space-y-1">
                  {persona.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Focus Areas */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-foreground">Focus areas:</h4>
                <div className="flex flex-wrap gap-1">
                  {persona.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Time Commitment */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time commitment:</span>
                  <span className="font-medium text-foreground">{persona.timeCommitment}</span>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedPersona === persona.id && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 pt-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Selected</span>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* CTA Section */}
      {selectedPersona && (
        <motion.div 
          variants={itemVariants}
          className="text-center space-y-4 pt-6"
        >
          <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Perfect! Your personalized learning path is ready.
              </h3>
              <p className="text-muted-foreground">
                {personas.find(p => p.id === selectedPersona)?.recommendedPath}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="gap-2">
                  Start Learning Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Get PDF Learning Guide
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <motion.div variants={itemVariants} className="text-center space-y-4 pt-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>CFP® Designed</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>Fiduciary Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>HNW Focused</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          We respect your privacy and will never share your information. 
          Advertising-free environment—your data is never sold. You are always in control.
        </p>
      </motion.div>
    </motion.div>
  );
};