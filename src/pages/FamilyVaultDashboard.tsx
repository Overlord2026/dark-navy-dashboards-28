import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  FileText, 
  Settings, 
  Shield,
  Plus,
  Calendar,
  Eye,
  Download
} from 'lucide-react';
import { useFamilyVault } from '@/hooks/useFamilyVault';
import { VaultOverview } from '@/components/vault/VaultOverview';
import { VaultMembers } from '@/components/vault/VaultMembers';
import { LegacyItems } from '@/components/vault/LegacyItems';
import { VaultSettings } from '@/components/vault/VaultSettings';
import { VaultAuditLog } from '@/components/vault/VaultAuditLog';
import { CreateVaultDialog } from '@/components/vault/CreateVaultDialog';
import { LeaveMessageWizard } from '@/components/vault/LeaveMessageWizard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FamilyVaultDashboard() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMessageWizard, setShowMessageWizard] = useState(false);
  
  const { 
    vaults, 
    members, 
    legacyItems, 
    auditLogs, 
    loading, 
    error,
    createVault,
    refetch 
  } = useFamilyVault(vaultId);

  // Find current vault
  const currentVault = vaultId ? vaults.find(v => v.id === vaultId) : null;

  // If vaultId is provided but vault not found and not loading, redirect
  if (vaultId && !loading && !currentVault) {
    return <Navigate to="/family-vault" replace />;
  }

  // Show all vaults overview if no specific vault selected
  if (!vaultId) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              Family Legacy Vault™
            </h1>
            <p className="text-muted-foreground mt-2">
              Preserve and share your family's stories, values, and memories for future generations.
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Vault
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive">{error}</p>
              <Button onClick={refetch} variant="outline" className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : vaults.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No vaults yet</h3>
                <p className="text-muted-foreground">
                  Create your first family legacy vault to start preserving memories.
                </p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Vault
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((vault) => (
              <Card key={vault.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {vault.vault_photo_url ? (
                    <img
                      src={vault.vault_photo_url}
                      alt={vault.vault_name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-2">{vault.vault_name}</h3>
                  {vault.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {vault.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {new Date(vault.created_at).toLocaleDateString()}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = `/family-vault/${vault.id}`}
                    >
                      Open Vault
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateVaultDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={() => {
            setShowCreateDialog(false);
            refetch();
          }}
        />
      </div>
    );
  }

  // Show specific vault dashboard
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={refetch} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentVault) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Vault not found</p>
            <Button onClick={() => window.location.href = '/family-vault'} className="mt-4">
              Back to Vaults
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentVault.vault_photo_url ? (
            <img
              src={currentVault.vault_photo_url}
              alt={currentVault.vault_name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{currentVault.vault_name}</h1>
            {currentVault.description && (
              <p className="text-muted-foreground">{currentVault.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowMessageWizard(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Leave Message
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="items" className="gap-2">
            <FileText className="h-4 w-4" />
            Legacy Items
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Shield className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <VaultOverview 
            vault={currentVault}
            members={members}
            legacyItems={legacyItems}
          />
        </TabsContent>

        <TabsContent value="members">
          <VaultMembers 
            vaultId={currentVault.id}
            members={members}
            onMemberAdded={refetch}
          />
        </TabsContent>

        <TabsContent value="items">
          <LegacyItems 
            vaultId={currentVault.id}
            items={legacyItems}
            onItemAdded={refetch}
          />
        </TabsContent>

        <TabsContent value="audit">
          <VaultAuditLog 
            vaultId={currentVault.id}
            logs={auditLogs}
          />
        </TabsContent>

        <TabsContent value="settings">
          <VaultSettings 
            vault={currentVault}
            onVaultUpdated={refetch}
          />
        </TabsContent>
      </Tabs>

      {/* Message Wizard */}
      {showMessageWizard && (
        <LeaveMessageWizard
          vaultId={currentVault.id}
          members={members}
          onClose={() => setShowMessageWizard(false)}
          onSuccess={() => {
            setShowMessageWizard(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}