import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckoutService } from '@/lib/checkout';
import type { PlanKey } from '@/lib/checkout';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { BADGES } from '@/config/tiers';

export default function CheckoutRouter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckout = async () => {
      const plan = searchParams.get('plan') as PlanKey;
      const successUrl = searchParams.get('success_url') || undefined;
      const cancelUrl = searchParams.get('cancel_url') || undefined;

      if (!plan) {
        setError('No plan specified');
        setIsLoading(false);
        return;
      }

      if (!CheckoutService.isValidPlan(plan)) {
        setError(`Invalid plan: ${plan}`);
        setIsLoading(false);
        return;
      }

      try {
        // For free plan, redirect to signup
        if (plan === 'free') {
          navigate('/signup?plan=free');
          return;
        }

        // Create checkout session
        const checkoutUrl = await CheckoutService.createCheckoutSession(plan, {
          successUrl,
          cancelUrl,
        });

        // Redirect to Stripe checkout
        window.location.href = checkoutUrl;
      } catch (err) {
        console.error('Checkout error:', err);
        setError(err instanceof Error ? err.message : 'Failed to create checkout session');
        
        toast({
          title: "Checkout Error",
          description: "Failed to start checkout process. Please try again.",
          variant: "destructive",
        });
        
        // Redirect back to pricing after error
        setTimeout(() => {
          navigate('/pricing');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    handleCheckout();
  }, [searchParams, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Setting up your checkout session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-destructive">Checkout Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to pricing page...
          </p>
        </div>
      </div>
    );
  }

  return null;
}