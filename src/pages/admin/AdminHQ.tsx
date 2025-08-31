import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IPLedgerTab } from '@/components/admin/hq/IPLedgerTab';
import { ReceiptsTab } from '@/components/admin/hq/ReceiptsTab';
import { SecurityTab } from '@/components/admin/hq/SecurityTab';
import { OverviewTab } from '@/components/admin/hq/OverviewTab';

export default function AdminHQ() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HQ</h1>
          <p className="text-muted-foreground">Strategic oversight and intellectual property management</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ip-ledger">IP Ledger</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="ip-ledger">
            <IPLedgerTab />
          </TabsContent>

          <TabsContent value="receipts">
            <ReceiptsTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}