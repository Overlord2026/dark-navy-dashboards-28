import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, FileText, Calendar } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type FamilyVault = Database['public']['Tables']['family_vaults']['Row'];
type VaultMember = Database['public']['Tables']['vault_members']['Row'];
type LegacyItem = Database['public']['Tables']['legacy_items']['Row'];

interface VaultOverviewProps {
  vault: FamilyVault;
  members: VaultMember[];
  legacyItems: LegacyItem[];
}

export function VaultOverview({ vault, members, legacyItems }: VaultOverviewProps) {
  const activeMembers = members.filter(m => m.status === 'active');
  const activeLegacyItems = legacyItems.filter(item => item.status === 'active');

  return (
    <div className="space-y-6">
      {/* Family Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Family Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vault.family_motto && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Family Motto</h4>
              <p className="italic text-lg">"{vault.family_motto}"</p>
            </div>
          )}
          
          {vault.family_values && vault.family_values.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Family Values</h4>
              <div className="flex flex-wrap gap-2">
                {vault.family_values.map((value, index) => (
                  <Badge key={index} variant="secondary">{value}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {vault.description && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Description</h4>
              <p className="text-muted-foreground">{vault.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeMembers.length}</p>
                <p className="text-sm text-muted-foreground">Family Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeLegacyItems.length}</p>
                <p className="text-sm text-muted-foreground">Legacy Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Date(vault.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeLegacyItems.length > 0 ? (
              activeLegacyItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description || 'No description'}
                    </p>
                  </div>
                  <Badge variant="outline">{item.item_type}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No legacy items yet</p>
                <p className="text-sm">Start by leaving your first message or uploading content.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}