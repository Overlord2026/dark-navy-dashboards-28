
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { runtimeFlags } from '@/config/runtimeFlags';

interface BoutiqueFamilyOfficeBannerProps {
  onDismiss: () => void;
}

export function BoutiqueFamilyOfficeBanner({ onDismiss }: BoutiqueFamilyOfficeBannerProps) {
  const navigate = useNavigate();
  
  // Hide entirely if in prelaunch mode
  if (runtimeFlags.prelaunchMode) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-500/20 rounded-lg p-6 mb-6 animate-fade-in border border-indigo-500/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold">
              Boutique Family Office Client
            </h2>
          </div>
          <Badge className="bg-indigo-500/20 text-indigo-500 border-indigo-500/20">
            Premium Access Included
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          As a client of our Boutique Family Office, you receive complimentary access to all 
          Premium-level features and specialized planning tools. Enjoy enhanced financial 
          analytics and personalized wealth management solutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-background/80 p-4 rounded-md border border-border/40">
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-500/10 p-2 rounded-full">
              <Star className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Elite Advisory Services</h3>
              <p className="text-xs text-muted-foreground mt-1">Upgrade your relationship with our advisors for more personalized service</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/advisor-profile')}
              >
                Learn More <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-500/10 p-2 rounded-full">
              <Star className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Premium Planning Resources</h3>
              <p className="text-xs text-muted-foreground mt-1">Access exclusive tools and resources for comprehensive wealth management</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/financial-plans')}
              >
                Explore Now <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            Interested in upgrading to Elite advisory services?
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate('/subscription')}
            >
              Upgrade Relationship
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
