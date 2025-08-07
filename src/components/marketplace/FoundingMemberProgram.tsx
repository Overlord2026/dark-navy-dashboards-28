import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  Globe,
  CheckCircle,
  Clock,
  Gift,
  Handshake,
  Zap,
  Target,
  DollarSign,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

const foundingMemberBenefits = [
  {
    icon: DollarSign,
    title: "Equity Participation",
    description: "Restricted shares or revenue sharing based on participation level"
  },
  {
    icon: Crown,
    title: "VIP Status & Branding",
    description: "Founding Member badge, premium profile placement, and co-marketing opportunities"
  },
  {
    icon: Globe,
    title: "Global Network Access",
    description: "Exclusive access to elite network of families, advisors, and service providers"
  },
  {
    icon: Handshake,
    title: "Strategic Partnership",
    description: "Input on platform development, priority feature requests, and advisory role"
  },
  {
    icon: Target,
    title: "Lead Generation",
    description: "Premium lead routing, featured listings, and referral bonuses"
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Beta features, new market launches, and platform enhancements"
  }
];

const foundingMemberTiers = [
  {
    name: "Champion",
    equity: "0.01-0.05%",
    requirements: ["Profile activation", "2 social shares", "1 referral"],
    spots: "50 remaining",
    color: "from-gold to-yellow-500"
  },
  {
    name: "Elite",
    equity: "0.05-0.15%",
    requirements: ["Profile activation", "Host 1 webinar", "5 referrals", "Case study participation"],
    spots: "25 remaining", 
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Legend",
    equity: "0.15-0.50%",
    requirements: ["Full partnership", "Brand ambassador", "10+ referrals", "Ongoing promotion"],
    spots: "10 remaining",
    color: "from-emerald-500 to-emerald-600"
  }
];

const hallOfChampions = [
  {
    name: "Michael Jordan",
    title: "Sports & Business Icon",
    avatar: "MJ",
    tier: "Legend",
    joinedDate: "Nov 2024"
  },
  {
    name: "Tony Robbins", 
    title: "Peak Performance Coach",
    avatar: "TR",
    tier: "Legend",
    joinedDate: "Nov 2024"
  },
  {
    name: "Goldman Sachs",
    title: "Investment Banking",
    avatar: "GS",
    tier: "Elite",
    joinedDate: "Dec 2024"
  },
  {
    name: "Mayo Clinic",
    title: "Healthcare Excellence",
    avatar: "MC",
    tier: "Elite", 
    joinedDate: "Dec 2024"
  }
];

interface FoundingMemberProgramProps {
  userProfile?: any;
}

export function FoundingMemberProgram({ userProfile }: FoundingMemberProgramProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);

  const programStats = {
    totalMembers: 147,
    totalEquityAllocated: "2.3%",
    averageReferrals: 8.5,
    networkValue: "$2.8B+"
  };

  const handleJoinProgram = (tierName: string) => {
    setSelectedTier(tierName);
    setShowAgreement(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-primary/5 to-purple-500/10" />
        <CardContent className="relative z-10 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-gold" />
              <Badge className="bg-gold/10 text-gold border-gold/20 text-lg px-4 py-1">
                FOUNDING MEMBER PROGRAM
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gold via-primary to-purple-500 bg-clip-text text-transparent">
              Shares-for-Champions Program
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get in on the ground floor of the next big thing in wealth and wellness. 
              Founding Members receive equity upside, VIP status, and exclusive network access.
            </p>

            <div className="flex justify-center items-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{programStats.totalMembers}</div>
                <div className="text-sm text-muted-foreground">Founding Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">{programStats.totalEquityAllocated}</div>
                <div className="text-sm text-muted-foreground">Equity Allocated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{programStats.networkValue}</div>
                <div className="text-sm text-muted-foreground">Network Value</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gold" />
            Founding Member Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundingMemberBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tier selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Choose Your Founding Member Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {foundingMemberTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  selectedTier === tier.name ? 'border-primary ring-2 ring-primary/20' : 'border-muted hover:border-primary/50'
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5`} />
                  
                  <CardHeader className="relative z-10 text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{tier.equity}</div>
                    <p className="text-sm text-muted-foreground">Equity Range</p>
                    <Badge variant="outline" className="w-fit mx-auto">
                      <Clock className="h-3 w-3 mr-1" />
                      {tier.spots}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Requirements:</h4>
                      <ul className="space-y-1">
                        {tier.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full"
                      variant={selectedTier === tier.name ? "default" : "outline"}
                      onClick={() => handleJoinProgram(tier.name)}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Join as {tier.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hall of Champions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gold" />
            Hall of Champions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hallOfChampions.map((champion, index) => (
              <motion.div
                key={champion.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors text-center"
              >
                <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-gold/20">
                  <AvatarFallback className="bg-gold/10 text-gold font-bold text-lg">
                    {champion.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{champion.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{champion.title}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    champion.tier === "Legend" ? "border-emerald-500/30 text-emerald-500" :
                    champion.tier === "Elite" ? "border-purple-500/30 text-purple-500" :
                    "border-gold/30 text-gold"
                  }`}
                >
                  {champion.tier}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{champion.joinedDate}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Join these industry leaders as a Founding Member
            </p>
            <Button variant="outline" className="gap-2">
              <Award className="h-4 w-4" />
              View All Champions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <Card>
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{programStats.averageReferrals}</div>
              <div className="text-sm text-muted-foreground">Avg. Referrals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">85</div>
              <div className="text-sm text-muted-foreground">Spots Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-500">12x</div>
              <div className="text-sm text-muted-foreground">Avg. ROI Potential</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA section */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-gold/10" />
        <CardContent className="relative z-10 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join the Elite?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Secure your spot as a Founding Member and help shape the future of family office excellence. 
            Limited spots available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground">
              <Crown className="h-5 w-5 mr-2" />
              Apply for Founding Membership
            </Button>
            <Button size="lg" variant="outline">
              <Gift className="h-5 w-5 mr-2" />
              Download Program Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}