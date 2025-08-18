import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { runtimeFlags } from '@/config/runtimeFlags';

export const BrandHeader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-card via-background to-card border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
          aria-label="Boutique Family Office - Home"
        >
          <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🌳</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BFO
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {runtimeFlags.showPatentBadge && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600 hover:bg-yellow-50 cursor-help">
                  Patent-Pending Technology
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Multi-Persona Computer® systems. <br />See Legal page for details.</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <div className="flex items-center gap-2">
            <Link 
              to="/signin" 
              className="px-3 py-1.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Sign In
            </Link>
            <Link 
              to="/get-started" 
              className="px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};