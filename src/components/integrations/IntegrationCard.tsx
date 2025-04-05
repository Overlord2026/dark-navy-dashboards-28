
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, ExternalLink, HelpCircle, RefreshCw, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category: string;
  isConnected: boolean;
  lastSynced?: Date;
  onConnect: (id: string) => void;
  onLearnMore: (id: string) => void;
  onSyncNow?: (id: string) => void;
  onSettings?: (id: string) => void;
  benefits: string[];
  isPopular?: boolean;
}

export function IntegrationCard({
  id,
  name,
  description,
  logoUrl,
  category,
  isConnected,
  lastSynced,
  onConnect,
  onLearnMore,
  onSyncNow,
  onSettings,
  benefits,
  isPopular
}: IntegrationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
            <img 
              src={logoUrl} 
              alt={`${name} logo`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/40x40/gray/white?text=${name.charAt(0)}`;
              }}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center">
              <CardTitle className="text-lg">{name}</CardTitle>
              {isPopular && (
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{category}</p>
          </div>
          {isConnected && (
            <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-100" variant="outline">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" className="p-0 h-auto text-xs flex items-center mt-2" onClick={(e) => e.stopPropagation()}>
                <HelpCircle className="h-3 w-3 mr-1" /> 
                How this helps you
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1 p-1">
                <p className="font-medium text-sm">Key Benefits:</p>
                <ul className="text-xs list-disc pl-4">
                  {benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {isConnected && lastSynced && (
          <div className="mt-3 text-xs text-muted-foreground">
            Last synced: {formatDistanceToNow(lastSynced)} ago
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onLearnMore(id)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Learn More
        </Button>
        
        {isConnected ? (
          <div className="flex gap-2">
            {onSyncNow && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSyncNow(id)}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync
              </Button>
            )}
            
            {onSettings && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSettings(id)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            )}
          </div>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onConnect(id)}
          >
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
