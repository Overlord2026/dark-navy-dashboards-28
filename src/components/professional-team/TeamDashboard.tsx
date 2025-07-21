import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Calendar, Plus, Settings, Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import { TeamMember, PROFESSIONAL_RELATIONSHIPS } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";

interface TeamDashboardProps {
  onAddProfessional: () => void;
  onViewMarketplace: () => void;
}

export function TeamDashboard({ onAddProfessional, onViewMarketplace }: TeamDashboardProps) {
  const { team, loading, removeProfessionalFromTeam } = useProfessionalTeam();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const groupedTeam = team.reduce((acc, member) => {
    const relationship = member.assignment.relationship;
    if (!acc[relationship]) {
      acc[relationship] = [];
    }
    acc[relationship].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Boutique Family Office Team</h1>
          <p className="text-muted-foreground mt-1">
            Your dedicated professionals working together for your family's success
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddProfessional} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Professional
          </Button>
          <Button variant="outline" onClick={onViewMarketplace}>
            Browse Marketplace
          </Button>
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{team.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Badge className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{team.filter(m => m.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {team.length > 0 
                    ? (team.reduce((sum, m) => sum + m.ratings_average, 0) / team.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members by Role */}
      {Object.entries(groupedTeam).map(([relationship, members]) => (
        <div key={relationship}>
          <h2 className="text-xl font-semibold mb-4">
            {PROFESSIONAL_RELATIONSHIPS[relationship as keyof typeof PROFESSIONAL_RELATIONSHIPS] || relationship}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.photo_url} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {member.name}
                          {member.verified && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{member.firm || member.company}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {member.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{member.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {member.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  {member.ratings_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{member.ratings_average.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">
                        ({member.reviews_count} reviews)
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>

                  {/* Assignment Notes */}
                  {member.assignment.notes && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <strong>Notes:</strong> {member.assignment.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {team.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Build Your Professional Team</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding professionals from our marketplace or inviting your existing advisors.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={onViewMarketplace}>
                  Browse Marketplace
                </Button>
                <Button variant="outline" onClick={onAddProfessional}>
                  Invite Professional
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}