import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirmManagement } from '@/hooks/useFirmManagement';
import { Users, Mail, Shield, MoreVertical, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SeatManagement() {
  const { firm, professionals, updateProfessionalStatus, removeProfessional } = useFirmManagement();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'invited': return 'warning';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (professionalId: string, newStatus: string) => {
    await updateProfessionalStatus(professionalId, newStatus);
  };

  const handleRemoveProfessional = async (professionalId: string) => {
    if (confirm('Are you sure you want to remove this professional? This will deactivate all their client assignments.')) {
      await removeProfessional(professionalId);
    }
  };

  if (!firm) return null;

  return (
    <div className="space-y-6">
      {/* Seat Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Seat Usage Overview
          </CardTitle>
          <CardDescription>
            Monitor your current seat usage and manage team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {firm.seats_in_use} / {firm.seats_purchased}
              </p>
              <p className="text-sm text-muted-foreground">Seats Used</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-lg font-semibold text-success">
                {firm.seats_purchased - firm.seats_in_use} Available
              </p>
              <p className="text-sm text-muted-foreground">Seats Remaining</p>
            </div>
          </div>
          <div className="mt-4 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ 
                width: `${Math.min((firm.seats_in_use / firm.seats_purchased) * 100, 100)}%` 
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members, their roles, and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {professionals.map((professional) => (
              <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={professional.profile_url} />
                    <AvatarFallback>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{professional.name}</h4>
                      {getRoleIcon(professional.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">{professional.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {professional.role.replace('_', ' ')}
                      </Badge>
                      {professional.specialties && professional.specialties.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {professional.specialties[0]}
                          {professional.specialties.length > 1 && ` +${professional.specialties.length - 1}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant={getStatusColor(professional.status)} className="capitalize">
                    {professional.status}
                  </Badge>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{professional.assigned_clients} clients</p>
                    {professional.last_active_at && (
                      <p>Active {new Date(professional.last_active_at).toLocaleDateString()}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Clients
                      </DropdownMenuItem>
                      {professional.status === 'invited' && (
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Invitation
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {professional.status === 'active' ? (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(professional.id, 'suspended')}
                          className="text-warning"
                        >
                          Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(professional.id, 'active')}
                          className="text-success"
                        >
                          Activate User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleRemoveProfessional(professional.id)}
                        className="text-destructive"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Remove User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {professionals.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
                <p className="text-muted-foreground mb-4">
                  Start by inviting your first team member to the firm.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}