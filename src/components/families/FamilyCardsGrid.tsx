import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFamilyEntitlements } from '@/hooks/useFamilyEntitlements';
import { FamilySegment } from '@/data/familiesPricingTiers';
import { Lock, Crown, Shield } from 'lucide-react';

interface FamilyCardsGridProps {
  selectedSegment: FamilySegment;
}

export const FamilyCardsGrid: React.FC<FamilyCardsGridProps> = ({
  selectedSegment
}) => {
  const { 
    availableCards, 
    isCardAccessible, 
    currentTier, 
    getCardQuota 
  } = useFamilyEntitlements(selectedSegment);

  const handleCardClick = (cardId: string) => {
    console.log(`Card clicked: ${cardId}`);
    // Handle card navigation here
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium': return Crown;
      case 'elite': return Shield;
      default: return null;
    }
  };

  const groupedCards = availableCards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, typeof availableCards>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedCards).map(([category, cards]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold text-foreground mb-4">{category}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => {
              const isAccessible = isCardAccessible(card);
              const quota = getCardQuota(card.id);
              const TierIcon = getTierIcon(card.requiredTier);
              
              return (
                <Card
                  key={card.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    !isAccessible ? 'opacity-60 bg-muted/30' : 'hover:shadow-lg'
                  } ${card.requiredTier === 'premium' ? 'border-amber-200' : ''} ${
                    card.requiredTier === 'elite' ? 'border-purple-200' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        {card.name}
                        {TierIcon && <TierIcon className="w-4 h-4 text-amber-500" />}
                      </span>
                      {!isAccessible && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={isAccessible ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {card.requiredTier.toUpperCase()}
                      </Badge>
                      
                      {quota && (
                        <Badge variant="outline" className="text-xs">
                          {quota === 999 ? 'Unlimited' : `${quota} limit`}
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant={isAccessible ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => isAccessible && handleCardClick(card.id)}
                      disabled={!isAccessible}
                    >
                      {isAccessible ? 'Open' : `Upgrade to ${card.requiredTier.toUpperCase()}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};