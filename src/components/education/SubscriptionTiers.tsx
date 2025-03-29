
import React from "react";
import { Check, X } from "lucide-react";
import { SubscriptionPlan } from "@/types/education";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SubscriptionTiersProps {
  tiers: SubscriptionPlan[];
  currentTier?: string;
  onSubscribe?: (tier: SubscriptionPlan) => void;
}

export const SubscriptionTiers: React.FC<SubscriptionTiersProps> = ({
  tiers,
  currentTier = "Basic",
  onSubscribe
}) => {
  const handleSubscribe = (tier: SubscriptionPlan) => {
    if (onSubscribe) {
      onSubscribe(tier);
    } else {
      toast.success(`Subscribed to ${tier.name}! This is a demo.`);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Educational Journey</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the subscription tier that best fits your financial education needs and goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`flex flex-col ${
              tier.recommended ? "border-primary shadow-lg" : "border-border"
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                {tier.recommended && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Recommended
                  </Badge>
                )}
              </div>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{tier.price.split('/')[0]}</span>
                {tier.price.includes('/') && (
                  <span className="text-muted-foreground">/{tier.price.split('/')[1]}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary">
                      <Check size={16} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(tier)} 
                className="w-full" 
                variant={currentTier === tier.id ? "outline" : "default"}
                disabled={currentTier === tier.id}
              >
                {currentTier === tier.id ? "Current Plan" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
        <p className="mt-2">Need help choosing? <a href="#" className="text-primary hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
};
