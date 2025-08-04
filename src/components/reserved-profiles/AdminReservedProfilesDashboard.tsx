import React, { useEffect, useState } from 'react';
import { Plus, Send, Eye, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReservedProfiles } from '@/hooks/useReservedProfiles';
import { ReservedProfile, ReservedProfileAnalytics } from '@/types/reservedProfiles';
import { CreateReservedProfileModal } from './CreateReservedProfileModal';
import { InvitationTracker } from './InvitationTracker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const AdminReservedProfilesDashboard: React.FC = () => {
  const { 
    profiles, 
    loading, 
    fetchReservedProfiles, 
    sendInvitation,
    getAnalytics 
  } = useReservedProfiles();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [analytics, setAnalytics] = useState<ReservedProfileAnalytics[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ReservedProfile | null>(null);

  useEffect(() => {
    fetchReservedProfiles();
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await getAnalytics();
    setAnalytics(data);
  };

  const handleSendInvitation = async (profileId: string, method: 'email' | 'sms' | 'linkedin' | 'heygen') => {
    await sendInvitation(profileId, method);
    fetchReservedProfiles(); // Refresh data
  };

  const totalReserved = profiles.length;
  const totalClaimed = profiles.filter(p => p.claimed_at).length;
  const totalInvited = profiles.filter(p => p.invitation_sent_at).length;
  const claimRate = totalReserved > 0 ? (totalClaimed / totalReserved) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VIP Reserved Profiles</h1>
          <p className="text-muted-foreground">
            Manage exclusive invitations for industry leaders
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Reserved Profile
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReserved}</div>
            <p className="text-xs text-muted-foreground">
              Active VIP profiles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Claimed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{totalClaimed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully activated
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalInvited}</div>
            <p className="text-xs text-muted-foreground">
              Invitations sent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Claim Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold">{claimRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profiles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Reserved Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{profile.organization}</p>
                      <p className="text-sm text-muted-foreground">{profile.role_title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{profile.persona_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {profile.claimed_at ? (
                      <Badge className="bg-emerald-100 text-emerald-800">Claimed</Badge>
                    ) : profile.invitation_sent_at ? (
                      <Badge className="bg-blue-100 text-blue-800">Invited</Badge>
                    ) : (
                      <Badge variant="secondary">Reserved</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        profile.priority_level === 'high' ? 'destructive' : 
                        profile.priority_level === 'normal' ? 'default' : 
                        'secondary'
                      }
                    >
                      {profile.priority_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProfile(profile)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!profile.claimed_at && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendInvitation(profile.id, 'email')}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateReservedProfileModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchReservedProfiles();
        }}
      />

      {selectedProfile && (
        <InvitationTracker
          profile={selectedProfile}
          open={!!selectedProfile}
          onOpenChange={() => setSelectedProfile(null)}
          onSendInvitation={handleSendInvitation}
        />
      )}
    </div>
  );
};