import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Crown, Star, Award, Users, Globe, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface EliteMarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function EliteMarketplaceHeader({ 
  searchQuery, 
  setSearchQuery 
}: EliteMarketplaceHeaderProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const elitePartners = [
    { name: "Goldman Sachs", type: "Investment Banking", logo: "🏛️" },
    { name: "Morgan Stanley", type: "Wealth Management", logo: "📈" },
    { name: "Blackstone", type: "Private Equity", logo: "💎" },
    { name: "Mayo Clinic", type: "Healthcare", logo: "🏥" },
    { name: "Ritz-Carlton", type: "Hospitality", logo: "🏨" },
    { name: "Sotheby's", type: "Art & Collectibles", logo: "🎨" }
  ];

  const stats = [
    { label: "Elite Partners", value: "100+", icon: Users },
    { label: "Global Markets", value: "25+", icon: Globe },
    { label: "VIP Members", value: "500+", icon: Crown }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % elitePartners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [elitePartners.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-primary/5 to-accent/5" />
      
      <div className="relative z-10 space-y-8 py-8">
        {/* Main header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Crown className="h-8 w-8 text-gold" />
            <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
              WORLD'S ELITE MARKETPLACE
            </Badge>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-gold to-accent bg-clip-text text-transparent">
            The World's Elite Family Office Marketplace
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Where Families, Advisors, Champions, and Innovators Meet
          </p>
        </div>

        {/* Rotating carousel of elite partners */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 p-4 bg-background/60 backdrop-blur-sm rounded-full border border-gold/20">
            <span className="text-sm font-medium text-muted-foreground">Featuring:</span>
            <motion.div
              key={currentCarouselIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">{elitePartners[currentCarouselIndex].logo}</span>
              <div className="text-left">
                <div className="font-semibold text-sm">{elitePartners[currentCarouselIndex].name}</div>
                <div className="text-xs text-muted-foreground">{elitePartners[currentCarouselIndex].type}</div>
              </div>
            </motion.div>
            <Badge variant="outline" className="border-gold/30 text-gold">
              {currentCarouselIndex + 1} of {elitePartners.length}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                <stat.icon className="h-5 w-5" />
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search and CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search elite firms, champions, solutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gold/20 focus:border-gold/40"
            />
          </div>
          
          <div className="flex gap-2">
            <Button asChild className="bg-gold hover:bg-gold/90 text-gold-foreground">
              <Link to="/elite/claim-vip">
                <Crown className="h-4 w-4 mr-2" />
                Claim VIP Portal
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-primary/30">
              <Link to="/elite/apply">
                <Star className="h-4 w-4 mr-2" />
                Apply to Join
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="text-accent hover:text-accent/80">
              <Link to="/family-portal">
                Family Portal
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured callout */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Now accepting VIP Founding Members with equity participation
            </span>
            <Button asChild size="sm" variant="link" className="p-0 h-auto text-primary">
              <Link to="/founding-members">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}