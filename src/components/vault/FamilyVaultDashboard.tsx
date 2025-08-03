import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Camera, 
  Upload, 
  MessageSquare, 
  UserPlus, 
  FileText, 
  Video, 
  Music, 
  Image,
  FolderOpen,
  Clock,
  Heart,
  Star,
  Settings,
  Bell,
  Play,
  Plus,
  ChevronRight,
  Archive,
  Share,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFamilyVault } from '@/hooks/useFamilyVault';
import { SecureFileUpload } from './SecureFileUpload';
import { LeaveMessageWizard } from './LeaveMessageWizard';
import { VaultMembers } from './VaultMembers';
import { LegacyItems } from './LegacyItems';
import { VaultBrandingCustomizer } from './VaultBrandingCustomizer';
import { SecureVaultAccess } from './SecureVaultAccess';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface FamilyVaultDashboardProps {
  vaultId?: string;
}

export function FamilyVaultDashboard({ vaultId }: FamilyVaultDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [vaultAccess, setVaultAccess] = useState<{ granted: boolean; masterKey?: CryptoKey }>({ granted: false });
  const [selectedVaultId, setSelectedVaultId] = useState(vaultId);
  
  const { vaults, items, members, isLoading, createVault, inviteMember } = useFamilyVault(selectedVaultId);

  // If no specific vaultId provided, use the first available vault
  useEffect(() => {
    if (!selectedVaultId && vaults && vaults.length > 0) {
      setSelectedVaultId(vaults[0].id);
    }
  }, [vaults, selectedVaultId]);

  const currentVault = vaults?.find(v => v.id === selectedVaultId) || vaults?.[0];

  const handleCreateFirstVault = async () => {
    try {
      const newVault = await createVault({
        vault_name: "My Family Vault",
        description: "A secure space to store our family memories and messages"
      });
      setSelectedVaultId(newVault?.id || '');
      toast.success("Your Family Vault has been created!");
    } catch (error) {
      toast.error("Failed to create vault. Please try again.");
    }
  };

  const handleVaultAccessGranted = (masterKey: CryptoKey) => {
    setVaultAccess({ granted: true, masterKey });
  };

  const handleInviteMember = async (email: string, role: string) => {
    try {
      await inviteMember(selectedVaultId!, { email, role, permissions: { can_view: true, can_upload: false, can_manage_members: false } });
      toast.success(`Invitation sent to ${email}`);
      setShowMembersDialog(false);
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  // Show vault access screen if not granted access yet
  if (selectedVaultId && !vaultAccess.granted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy/5 via-background to-emerald/5 p-4 flex items-center justify-center">
        <SecureVaultAccess
          vaultId={selectedVaultId}
          userRole="member" // This should be fetched from user's actual role
          onAccessGranted={handleVaultAccessGranted}
          onAccessDenied={() => setSelectedVaultId(undefined)}
        />
      </div>
    );
  }

  // Show create vault screen if no vaults exist
  if (!isLoading && (!vaults || vaults.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy/5 via-background to-emerald/5 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Card className="text-center border-2 border-dashed border-gold/30 bg-gradient-to-br from-gold/5 to-emerald/5 animate-fade-in">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-navy mb-4">
                Welcome to Family Vault
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Create your secure family vault to store precious memories, important documents, and leave meaningful messages for your loved ones.
              </p>
              <Button 
                onClick={handleCreateFirstVault} 
                size="lg"
                className="bg-gradient-to-r from-gold to-emerald text-navy font-semibold px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover-scale"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your Family Vault
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy/5 via-background to-emerald/5 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-emerald rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your Family Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy/5 via-background to-emerald/5">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-navy">
                  {currentVault?.vault_name || 'Family Vault'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentVault?.description || 'Secure family memories'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="bg-emerald/10 text-emerald-700 border-emerald/20 hidden sm:flex"
              >
                <Lock className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Primary CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Record Message CTA */}
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer border-2 border-transparent hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover-scale bg-gradient-to-br from-gold/5 to-gold/10">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Record a Message</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Leave heartfelt messages for future delivery
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gold/30 text-gold hover:bg-gold/10 font-medium"
                  >
                    Start Recording
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-navy">Create a Legacy Message</DialogTitle>
              </DialogHeader>
              <LeaveMessageWizard 
                vaultId={selectedVaultId!}
                members={members?.map(m => ({ ...m, role: m.permission_level })) || []}
                onClose={() => setShowMessageDialog(false)}
                onSuccess={() => setShowMessageDialog(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Upload File CTA */}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer border-2 border-transparent hover:border-emerald/30 transition-all duration-300 hover:shadow-lg hover-scale bg-gradient-to-br from-emerald/5 to-emerald/10">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald/20 to-emerald/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-emerald" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Upload Files</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Store photos, documents & videos securely
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald/30 text-emerald hover:bg-emerald/10 font-medium"
                  >
                    Choose Files
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-navy">Upload Secure Files</DialogTitle>
              </DialogHeader>
              <SecureFileUpload
                vaultId={selectedVaultId!}
                userRole="member"
                masterKey={vaultAccess.masterKey!}
                onUploadComplete={() => setShowUploadDialog(false)}
                showMobileCapture={true}
              />
            </DialogContent>
          </Dialog>

          {/* Invite Family CTA */}
          <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer border-2 border-transparent hover:border-navy/30 transition-all duration-300 hover:shadow-lg hover-scale bg-gradient-to-br from-navy/5 to-navy/10">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-navy/20 to-navy/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Invite Family</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add family members to your vault
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-navy/30 text-navy hover:bg-navy/10 font-medium"
                  >
                    Send Invite
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-navy">Invite Family Members</DialogTitle>
              </DialogHeader>
              <VaultMembers
                vaultId={selectedVaultId!}
                members={members || []}
                onMemberAdded={() => window.location.reload()}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-navy"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-navy"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="files"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-navy"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-navy"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-navy hidden lg:flex"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger 
              value="legacy"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-navy hidden lg:flex"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Legacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-white to-gold/5 border-gold/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <FileText className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-navy">{items?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Items Stored</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-emerald/5 border-emerald/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald/10 rounded-lg">
                      <Users className="h-5 w-5 text-emerald" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-navy">{members?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Family Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-navy/5 border-navy/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-navy/10 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                       <p className="text-2xl font-bold text-navy">
                        {items?.filter(item => item.content_type === 'text/plain').length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-gold/5 border-gold/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <Shield className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-navy">100%</p>
                      <p className="text-sm text-muted-foreground">Encrypted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items && items.length > 0 ? (
                    items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {item.content_type?.includes('application/') && <FileText className="h-4 w-4 text-navy" />}
                          {item.content_type === 'text/plain' && <MessageSquare className="h-4 w-4 text-gold" />}
                          {item.content_type?.startsWith('video/') && <Video className="h-4 w-4 text-emerald" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-navy">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.item_type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Archive className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No items yet. Start by uploading files or recording messages.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <LegacyItems 
              vaultId={selectedVaultId!} 
              items={items?.filter(item => item.content_type === 'text/plain') || []}
              onItemAdded={() => window.location.reload()}
            />
          </TabsContent>

          <TabsContent value="files">
            <LegacyItems 
              vaultId={selectedVaultId!} 
              items={items?.filter(item => item.content_type !== 'text/plain') || []}
              onItemAdded={() => window.location.reload()}
            />
          </TabsContent>

          <TabsContent value="members">
            <VaultMembers
              vaultId={selectedVaultId!}
              members={members || []}
              onMemberAdded={() => window.location.reload()}
            />
          </TabsContent>

          <TabsContent value="settings">
            <VaultBrandingCustomizer 
              vaultId={selectedVaultId!} 
              currentBranding={{
                familyMotto: currentVault?.family_motto || '',
                familyValues: currentVault?.family_values || [],
                primaryColor: '#4F46E5',
                secondaryColor: '#10B981',
                fontStyle: 'modern' as const
              }}
              onSave={async (branding) => { console.log('Branding saved:', branding); return true; }}
            />
          </TabsContent>

          <TabsContent value="legacy">
            <LegacyItems 
              vaultId={selectedVaultId!} 
              items={items || []}
              onItemAdded={() => window.location.reload()}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}