import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VIPProfileCreator } from '@/components/admin/VIPProfileCreator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Users, Mail, BarChart3 } from 'lucide-react';

export const VIPManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">VIP Management Center</h1>
          <p className="text-muted-foreground">
            Manage top industry leaders and founding members
          </p>
        </div>
      </div>

      <Tabs defaultValue="creator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="creator" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Profile Creator
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            VIP Members
          </TabsTrigger>
          <TabsTrigger value="outreach" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Outreach Log
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creator">
          <VIPProfileCreator />
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>VIP Members Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">VIP members list coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outreach">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Campaign Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Outreach tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>VIP Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};