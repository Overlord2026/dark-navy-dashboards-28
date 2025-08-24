import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoDisclaimer } from '@/components/DemoDisclaimer';
import { useDemo } from '@/context/DemoContext';

interface ToolHeaderProps {
  title: string;
  backPath?: string;
  backLabel?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ 
  title, 
  backPath = '/family/home',
  backLabel = 'Family Home'
}) => {
  const { isDemo } = useDemo();

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link 
                to={backPath}
                className="flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                {backLabel}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">{title}</span>
            </nav>
          </div>
          
          {isDemo && (
            <DemoDisclaimer />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mt-2">{title}</h1>
      </div>
    </div>
  );
};