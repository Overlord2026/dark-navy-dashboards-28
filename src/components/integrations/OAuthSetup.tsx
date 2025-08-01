import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Shield } from 'lucide-react';

interface OAuthSetupProps {
  platform: string;
  onConnect: () => void;
}

export function OAuthSetup({ platform, onConnect }: OAuthSetupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          OAuth Setup - {platform}
        </CardTitle>
        <CardDescription>
          Securely connect to {platform} using OAuth authorization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">This will redirect you to {platform} to authorize access.</p>
          <Badge variant="outline">Secure OAuth 2.0</Badge>
        </div>
        
        <Button onClick={onConnect} className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          Connect to {platform}
        </Button>
      </CardContent>
    </Card>
  );
}