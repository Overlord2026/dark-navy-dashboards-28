
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionTier } from '@/types/subscription';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/context/SubscriptionContext';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  onSelectTier: (tierId: string) => void;
}

export function SubscriptionTierCard({ tier, onSelectTier }: SubscriptionTierCardProps) {
  const { currentTier } = useSubscription();
  const isCurrentTier = currentTier === tier.id;

  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-200 hover:shadow-lg",
      tier.recommended && "border-2 border-primary shadow-md scale-105",
      isCurrentTier && "bg-primary/5 border-primary"
    )}>
      <CardHeader className={cn(
        "pb-4",
        tier.recommended && "bg-primary/10 rounded-t-lg"
      )}>
        {tier.recommended && (
          <div className="py-1 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-full w-fit mx-auto mb-2">
            Recommended
          </div>
        )}
        <CardTitle className="text-xl text-center">{tier.name}</CardTitle>
        <div className="text-center">
          {typeof tier.price === 'number' ? (
            <div className="mt-2">
              <span className="text-3xl font-bold">${tier.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          ) : (
            <div className="mt-2">
              <span className="text-2xl font-bold">{tier.price}</span>
            </div>
          )}
        </div>
        <CardDescription className="text-center mt-2">
          {tier.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {tier.features.map((feature) => (
            <li key={feature.id} className="flex items-start gap-2">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
              )}
              <span className={cn(
                "text-sm",
                !feature.included && "text-muted-foreground"
              )}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className={cn("w-full", tier.color && `bg-[${tier.color}] hover:bg-[${tier.color}]/90`)}
          onClick={() => onSelectTier(tier.id)}
          disabled={isCurrentTier}
          variant={isCurrentTier ? "outline" : "default"}
        >
          {isCurrentTier ? 'Current Plan' : tier.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
