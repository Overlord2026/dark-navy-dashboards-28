import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTools } from '@/contexts/ToolsContext';
import { Lock, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';

interface ToolCardProps {
  toolKey: string;
  showInstallOption?: boolean;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  toolKey,
  showInstallOption = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const { isToolEnabled, isToolAvailable, getToolInfo } = useTools();

  const tool = getToolInfo(toolKey);

  if (!tool) {
    return null;
  }

  const isEnabled = isToolEnabled(toolKey);
  const isAvailable = isToolAvailable(toolKey);
  const hasPrivateRoute = tool.routePriv !== null;

  const handleClick = () => {
    if (isEnabled && tool.routePriv) {
      navigate(tool.routePriv);
    } else if (hasPrivateRoute) {
      // This will trigger the ToolGate and show install modal
      navigate(tool.routePriv);
    } else {
      navigate(tool.routePub);
    }
  };

  const getStatusIcon = () => {
    if (isEnabled) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (hasPrivateRoute && isAvailable) {
      return <Lock className="h-4 w-4 text-yellow-600" />;
    } else {
      return <ExternalLink className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (isEnabled) {
      return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Installed</Badge>;
    } else if (hasPrivateRoute && isAvailable) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Available</Badge>;
    } else {
      return <Badge variant="outline" className="text-xs">Preview</Badge>;
    }
  };

  const getButtonText = () => {
    if (isEnabled) {
      return 'Open Tool';
    } else if (hasPrivateRoute && isAvailable) {
      return 'Install & Open';
    } else {
      return 'View Preview';
    }
  };

  const getButtonIcon = () => {
    if (isEnabled) {
      return <CheckCircle className="h-4 w-4 mr-2" />;
    } else if (hasPrivateRoute && isAvailable) {
      return <Sparkles className="h-4 w-4 mr-2" />;
    } else {
      return <ExternalLink className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {tool.label}
            </CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        
        <CardDescription className="text-sm leading-relaxed">
          {tool.summary}
        </CardDescription>
        
        {/* Solution tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {tool.solutions.slice(0, 2).map((solution) => (
            <Badge key={solution} variant="outline" className="text-xs px-2 py-1">
              {solution}
            </Badge>
          ))}
          {tool.solutions.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{tool.solutions.length - 2}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button 
          variant={isEnabled ? "default" : "outline"} 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
};