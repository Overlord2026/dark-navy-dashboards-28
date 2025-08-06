import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, Users, MessageCircle } from 'lucide-react';

export const FamilyVaultSnapshot = () => {
  return (
    <Card className="relative overflow-hidden">
      {/* Gold tree watermark */}
      <div className="absolute top-4 right-4 opacity-10">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center">
          <div className="text-2xl">🌳</div>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Family Legacy Vault™ Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">48</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Video className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Video Messages</div>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">6</div>
            <div className="text-sm text-muted-foreground">Recipients</div>
          </div>
        </div>
        
        <Button className="w-full gap-2" size="lg">
          <MessageCircle className="h-4 w-4" />
          Leave a Message
        </Button>
      </CardContent>
    </Card>
  );
};