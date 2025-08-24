import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Package } from 'lucide-react';

interface EmptyTabStateProps {
  tabKey: string;
  tabLabel: string;
  segment: string;
}

export const EmptyTabState: React.FC<EmptyTabStateProps> = ({ 
  tabKey, 
  tabLabel, 
  segment 
}) => {
  const navigate = useNavigate();

  const handleOpenCatalog = () => {
    // Pre-filter catalog by segment and tab category
    const filterParams = new URLSearchParams({
      segment,
      category: tabKey,
      source: 'family-home'
    });
    navigate(`/discover?${filterParams.toString()}`);
  };

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No {tabLabel} Tools Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Discover personalized {tabLabel.toLowerCase()} tools designed for your financial journey.
        </p>
        <Button onClick={handleOpenCatalog} className="gap-2">
          <Search className="w-4 h-4" />
          Open Catalog
        </Button>
      </CardContent>
    </Card>
  );
};

export const EmptyReceiptsState: React.FC = () => (
  <div className="text-center py-8">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
      <Sparkles className="w-8 h-8 text-primary/60" />
    </div>
    <h3 className="font-semibold mb-2">Your Journey Starts Here</h3>
    <p className="text-muted-foreground text-sm max-w-md mx-auto">
      Your proof slips will show here after your first action. Try running the Retirement Roadmap or uploading documents to get started.
    </p>
  </div>
);