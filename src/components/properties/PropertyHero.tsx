import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Building, 
  DollarSign,
  Sparkles
} from "lucide-react";
import { useCelebration } from "@/hooks/useCelebration";

interface PropertyHeroProps {
  totalProperties: number;
  totalValue: number;
  monthlyIncome: number;
  onAddProperty: () => void;
  onListProperty: () => void;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  totalProperties,
  totalValue,
  monthlyIncome,
  onAddProperty,
  onListProperty
}) => {
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleListProperty = () => {
    onListProperty();
    triggerCelebration('milestone', 'Ready to List!');
  };

  return (
    <>
      <Card className="relative overflow-hidden bg-gradient-subtle border-0 shadow-elegant">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-gold opacity-10 rounded-full blur-3xl animate-slow-bounce" />
        
        <CardContent className="relative p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Welcome Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge className="bg-gradient-emerald text-emerald-foreground mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Your Family's Real Estate Center
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Portfolio Overview
                </h1>
                <p className="text-xl text-muted-foreground">
                  Manage, track, and optimize your real estate investments
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-elegant"
                  onClick={handleListProperty}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  List Property
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={onAddProperty}
                >
                  <Building className="h-5 w-5 mr-2" />
                  Add Property
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalProperties}</p>
                    <p className="text-sm text-muted-foreground">Properties</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {CelebrationComponent}
    </>
  );
};