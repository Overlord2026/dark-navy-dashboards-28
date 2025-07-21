import React, { useState } from 'react';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirmManagement } from '@/hooks/useFirmManagement';
import { Building2, Users, CreditCard, Settings, UserPlus, Crown, Shield } from 'lucide-react';
import { InviteProfessionalDialog } from '@/components/firm-admin/InviteProfessionalDialog';
import { SeatManagement } from '@/components/firm-admin/SeatManagement';
import { BillingManagement } from '@/components/firm-admin/BillingManagement';
import { FirmSettings } from '@/components/firm-admin/FirmSettings';

export function FirmAdmin() {
  const { firm, professionals, subscription, loading } = useFirmManagement();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  if (loading) {
    return (
      <AdminPortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPortalLayout>
    );
  }

  if (!firm) {
    return (
      <AdminPortalLayout>
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Firm Associated</h3>
          <p className="text-muted-foreground mb-4">
            You need to be part of a firm to access the admin portal.
          </p>
        </div>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{firm.name} Admin</h1>
              <p className="text-muted-foreground">
                {firm.type} Firm • {firm.seats_in_use}/{firm.seats_purchased} seats used
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={firm.subscription_status === 'active' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {firm.subscription_status}
            </Badge>
            {firm.branding_enabled && (
              <Badge variant="outline">
                <Crown className="h-3 w-3 mr-1" />
                White Label
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {professionals.filter(p => p.status === 'active').length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold text-foreground">
                  ${subscription ? (subscription.price_per_seat * subscription.seats).toFixed(0) : '0'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-warning" />
                <span className="text-2xl font-bold text-foreground">
                  {firm.seats_purchased - firm.seats_in_use}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="seats" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="seats" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Seat Management
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing & Plans
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Firm Settings
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seats" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">User & Seat Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your team members, assign roles, and control seat usage
                </p>
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Professional
              </Button>
            </div>
            <SeatManagement />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Billing & Subscription Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage your subscription, view usage, and upgrade plans
              </p>
            </div>
            <BillingManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Firm Settings & Branding</h3>
              <p className="text-sm text-muted-foreground">
                Configure your firm's profile, branding, and marketplace visibility
              </p>
            </div>
            <FirmSettings />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Marketplace Presence</h3>
              <p className="text-sm text-muted-foreground">
                Control how your firm and professionals appear in the marketplace
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Visibility</CardTitle>
                <CardDescription>
                  Manage which of your professionals are discoverable in the public marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Listing</p>
                      <p className="text-sm text-muted-foreground">
                        Allow clients to discover your firm in the marketplace
                      </p>
                    </div>
                    <Badge variant={firm.marketplace_visibility ? 'default' : 'secondary'}>
                      {firm.marketplace_visibility ? 'Visible' : 'Private'}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure Marketplace Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <InviteProfessionalDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </AdminPortalLayout>
  );
}