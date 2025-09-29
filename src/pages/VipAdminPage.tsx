import React from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VipInviteEngine } from '@/components/admin/VipInviteEngine';
import { VipWallDisplay } from '@/components/admin/VipWallDisplay';
import { VipAutomationEngine } from '@/components/admin/VipAutomationEngine';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export default function VipAdminPage() {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return <Navigate to="/client-dashboard" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engine">VIP Invite Engine</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="wall">VIP Wall</TabsTrigger>
          <TabsTrigger value="legacy">Legacy Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="engine">
          <VipInviteEngine />
        </TabsContent>

        <TabsContent value="automation">
          <VipAutomationEngine />
        </TabsContent>

        <TabsContent value="wall">
          <VipWallDisplay />
        </TabsContent>

        <TabsContent value="legacy">
          {/* Keep the original component for backwards compatibility */}
          <div className="space-y-4">
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Legacy VIP Manager</h2>
              <p className="text-muted-foreground">
                The original VIP bulk invite manager. Use the new VIP Invite Engine for enhanced features.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}