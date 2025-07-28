import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Crown, Zap, ArrowRight, Plus } from 'lucide-react';
import { PremiumUpgradePrompt } from '@/types/subscription';
import { useNavigate } from 'react-router-dom';

interface UpgradePaywallProps {
  promptData: PremiumUpgradePrompt;
  showUsageProgress?: boolean;
  onAddOnPurchase?: () => void;
  onUpgrade?: () => void;
}

export function UpgradePaywall({ 
  promptData, 
  showUsageProgress = true,
  onAddOnPurchase,
  onUpgrade
}: UpgradePaywallProps) {
  const navigate = useNavigate();
  
  const usagePercentage = promptData.current_usage && promptData.usage_limit 
    ? Math.min((promptData.current_usage / promptData.usage_limit) * 100, 100)
    : 0;

  const isUsageLimitReached = promptData.current_usage !== undefined && 
                             promptData.usage_limit !== undefined && 
                             promptData.current_usage >= promptData.usage_limit;

  const isAddOnRequired = !!promptData.add_on_required;

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/subscription');
    }
  };

  const handleAddOnClick = () => {
    if (onAddOnPurchase) {
      onAddOnPurchase();
    } else {
      navigate('/subscription?tab=add-ons');
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {isAddOnRequired ? (
            <Plus className="h-8 w-8 text-primary" />
          ) : isUsageLimitReached ? (
            <Zap className="h-8 w-8 text-primary" />
          ) : (
            <Lock className="h-8 w-8 text-primary" />
          )}
        </div>
        
        <CardTitle className="text-xl">
          {isAddOnRequired 
            ? `${promptData.feature_name} Add-On Required`
            : isUsageLimitReached
            ? `${promptData.feature_name} Usage Limit Reached`
            : `Unlock ${promptData.feature_name}`
          }
        </CardTitle>
        
        <CardDescription>
          {isAddOnRequired 
            ? `Purchase the ${promptData.feature_name} add-on to access this feature`
            : isUsageLimitReached
            ? `You've reached your monthly limit. Upgrade or purchase additional usage.`
            : `Upgrade to ${promptData.required_tier} to access ${promptData.feature_name}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Usage Progress */}
        {showUsageProgress && promptData.current_usage !== undefined && promptData.usage_limit !== undefined && promptData.usage_limit > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Usage this month</span>
              <span>{promptData.current_usage} / {promptData.usage_limit}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        )}

        {/* Feature Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            What you get:
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {isAddOnRequired ? (
              <>
                <li>• Full access to {promptData.feature_name}</li>
                <li>• Dedicated usage allocation</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
              </>
            ) : (
              <>
                <li>• Unlimited {promptData.feature_name} access</li>
                <li>• Priority customer support</li>
                <li>• Advanced analytics & reporting</li>
                <li>• Early access to new features</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isAddOnRequired ? (
            <>
              <Button 
                onClick={handleAddOnClick}
                className="w-full"
                size="lg"
              >
                Purchase {promptData.feature_name} Add-On
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={handleUpgradeClick}
                variant="outline"
                className="w-full"
              >
                Or Upgrade Plan (Includes All Add-Ons)
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleUpgradeClick}
                className="w-full"
                size="lg"
              >
                Upgrade to {promptData.required_tier}
                <Crown className="ml-2 h-4 w-4" />
              </Button>
              {isUsageLimitReached && (
                <Button 
                  onClick={handleAddOnClick}
                  variant="outline"
                  className="w-full"
                >
                  Buy Additional Usage
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Pricing Preview */}
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <div className="text-sm text-muted-foreground">Starting at</div>
          <div className="text-2xl font-bold">
            {isAddOnRequired ? '$19' : promptData.required_tier === 'premium' ? '$49' : '$99'}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}