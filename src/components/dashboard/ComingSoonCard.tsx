
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export function ComingSoonCard() {
  const navigate = useNavigate();
  
  return (
    <Card className="p-8 text-center max-w-2xl mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
      <p className="text-muted-foreground mb-6">
        This segment is currently under development. For now, our platform is optimized for pre-retirees and retirees.
      </p>
      <Button 
        variant="outline"
        onClick={() => navigate('/?segment=preretirees')}
      >
        View Pre-Retirees Portal
      </Button>
    </Card>
  );
}
