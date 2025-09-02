import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Auto-generated stub component for missing routes
 */
export default function AdminPanel() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Construction className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Administrative dashboard and management tools
          </p>
          <p className="text-sm text-muted-foreground">
            This page is under construction. The component needs to be implemented.
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg text-left">
            <h4 className="font-semibold mb-2">Development Info:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Route:</strong> /admin</li>
              <li><strong>Component:</strong> AdminPanel</li>
              <li><strong>File:</strong> src/pages/stubs/AdminPanel.tsx</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}