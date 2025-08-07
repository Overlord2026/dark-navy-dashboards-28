import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { EliteMarketplaceHeader } from "@/components/marketplace/EliteMarketplaceHeader";
import { EliteDirectory } from "@/components/marketplace/EliteDirectory";
import { FoundingMemberProgram } from "@/components/marketplace/FoundingMemberProgram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Users, 
  Star, 
  Award,
  TrendingUp,
  Globe,
  Building
} from "lucide-react";

export default function EliteMarketplace() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("directory");

  const featuredSolutions = [
    {
      title: "Wealth Optimization Suite",
      description: "AI-powered portfolio management and tax optimization",
      category: "Wealth Management",
      provider: "Goldman Sachs Private Wealth",
      tier: "Platinum",
      icon: TrendingUp
    },
    {
      title: "Longevity & Peak Performance",
      description: "Executive health and performance optimization",
      category: "Health & Wellness", 
      provider: "Mayo Clinic Executive Health",
      tier: "Gold",
      icon: Star
    },
    {
      title: "Global Estate Planning",
      description: "Cross-border estate and legacy structuring",
      category: "Legal Services",
      provider: "Kirkland & Ellis LLP", 
      tier: "Gold",
      icon: Building
    }
  ];

  return (
    <ThreeColumnLayout title="Elite Family Office Marketplace">
      <div className="space-y-8 px-4 py-6 max-w-7xl mx-auto">
        <EliteMarketplaceHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background/60 backdrop-blur-sm border">
            <TabsTrigger value="directory" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Elite Directory
            </TabsTrigger>
            <TabsTrigger value="founding-members" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Founding Members
            </TabsTrigger>
            <TabsTrigger value="solutions" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Featured Solutions
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Apply to Join
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            <EliteDirectory searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="founding-members" className="space-y-6">
            <FoundingMemberProgram />
          </TabsContent>

          <TabsContent value="solutions" className="space-y-6">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Featured Elite Solutions</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Curated premium services from our most trusted partners and founding members.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredSolutions.map((solution, index) => {
                  const Icon = solution.icon;
                  return (
                    <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5" />
                      <CardContent className="relative z-10 p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              solution.tier === "Platinum" ? "border-purple-500/30 text-purple-500" : "border-gold/30 text-gold"
                            }`}
                          >
                            {solution.tier}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{solution.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {solution.category}
                            </Badge>
                            <span>•</span>
                            <span>{solution.provider}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardContent className="py-8 text-center">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Global Solution Network</h3>
                  <p className="text-muted-foreground mb-4">
                    Access our complete catalog of 500+ premium solutions across wealth, health, legal, and lifestyle categories.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline">500+ Solutions</Badge>
                    <Badge variant="outline">25+ Countries</Badge>
                    <Badge variant="outline">100+ Verified Providers</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="apply" className="space-y-6">
            <Card>
              <CardContent className="py-12 text-center space-y-6">
                <Crown className="h-16 w-16 mx-auto text-gold" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Join the Elite Marketplace</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Apply to become a verified provider in the world's most exclusive family office marketplace. 
                    Rigorous vetting ensures only the finest professionals join our network.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="p-4 rounded-lg border bg-card/50">
                    <Star className="h-8 w-8 mx-auto text-gold mb-2" />
                    <h3 className="font-semibold mb-1">Elite Standards</h3>
                    <p className="text-sm text-muted-foreground">Top 1% of providers in your field</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/50">
                    <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Verified Excellence</h3>
                    <p className="text-sm text-muted-foreground">Rigorous background and performance checks</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/50">
                    <Users className="h-8 w-8 mx-auto text-accent mb-2" />
                    <h3 className="font-semibold mb-1">Exclusive Network</h3>
                    <p className="text-sm text-muted-foreground">Access to UHNW families and advisors</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ready to join the world's most prestigious family office network?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-gold hover:bg-gold/90 text-gold-foreground rounded-lg font-medium transition-colors">
                      Start Elite Application
                    </button>
                    <button className="px-6 py-3 border border-primary/30 hover:bg-primary/5 rounded-lg font-medium transition-colors">
                      Download Requirements
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}