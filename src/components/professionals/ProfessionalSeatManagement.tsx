import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Link, Send, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SeatPurchaseFlow } from './SeatPurchaseFlow';
import { ProfessionalInviteFlow } from './ProfessionalInviteFlow';

interface SeatPurchase {
  id: string;
  seats_purchased: number;
  purchase_type: string;
  total_amount: number;
  status: string;
  created_at: string;
  purchased_for: any;
}

interface ClientLink {
  id: string;
  client_user_id: string;
  relationship_type: string;
  status: string;
  linked_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export const ProfessionalSeatManagement = () => {
  const [seatPurchases, setSeatPurchases] = useState<SeatPurchase[]>([]);
  const [clientLinks, setClientLinks] = useState<ClientLink[]>([]);
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [showInviteFlow, setShowInviteFlow] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get professional profile
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!professional) return;

      // Load seat purchases - simulate for now since table may not have data
      setSeatPurchases([
        {
          id: '1',
          seats_purchased: 5,
          purchase_type: 'client_seats',
          total_amount: 99,
          status: 'active',
          created_at: new Date().toISOString(),
          purchased_for: { description: 'Client management package' }
        }
      ]);

      // Load client links - simulate for now
      setClientLinks([
        {
          id: '1',
          client_user_id: '123',
          relationship_type: 'primary',
          status: 'active',
          linked_at: new Date().toISOString(),
          profiles: {
            name: 'John Smith',
            email: 'john@example.com'
          }
        }
      ]);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load seat management data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalSeats = seatPurchases.reduce((sum, purchase) => sum + purchase.seats_purchased, 0);
  const usedSeats = clientLinks.filter(link => link.status === 'active').length;
  const availableSeats = totalSeats - usedSeats;

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Seats</p>
                <p className="text-2xl font-bold">{totalSeats}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Used Seats</p>
                <p className="text-2xl font-bold">{usedSeats}</p>
              </div>
              <Link className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableSeats}</p>
              </div>
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowPurchaseFlow(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Purchase Seats
        </Button>
        <Button 
          variant="outline"
          onClick={() => setShowInviteFlow(true)}
          disabled={availableSeats === 0}
        >
          <Send className="w-4 h-4 mr-2" />
          Invite Client
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="purchases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchases">Seat Purchases</TabsTrigger>
          <TabsTrigger value="clients">Linked Clients</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Your Seat Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seatPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{purchase.purchase_type.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-muted-foreground">
                        {purchase.seats_purchased} seats • ${purchase.total_amount}/month
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Purchased {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={purchase.status === 'active' ? 'default' : 'secondary'}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Linked Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{link.profiles?.name || 'Unknown Client'}</h4>
                      <p className="text-sm text-muted-foreground">{link.profiles?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.relationship_type} • Linked {new Date(link.linked_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                        {link.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending invitations</p>
                <p className="text-sm">Invite clients to link their accounts with yours</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showPurchaseFlow && (
        <SeatPurchaseFlow 
          isOpen={showPurchaseFlow}
          onClose={() => setShowPurchaseFlow(false)}
          onSuccess={() => {
            setShowPurchaseFlow(false);
            loadData();
          }}
        />
      )}

      {showInviteFlow && (
        <ProfessionalInviteFlow
          isOpen={showInviteFlow}
          onClose={() => setShowInviteFlow(false)}
          onSuccess={() => {
            setShowInviteFlow(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};