import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Calendar, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  Shield, 
  Clock,
  Users,
  Settings,
  Plus
} from "lucide-react";
import { TeamMember, PROFESSIONAL_RELATIONSHIPS, PROFESSIONAL_CATEGORIES } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";

interface TeamRosterProps {
  onAddProfessional: () => void;
  onViewMarketplace: () => void;
}

export function TeamRoster({ onAddProfessional, onViewMarketplace }: TeamRosterProps) {
  const { team, loading, removeProfessionalFromTeam } = useProfessionalTeam();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Group team members by category
  const categorizedTeam = Object.entries(PROFESSIONAL_CATEGORIES).reduce((acc, [category, relationships]) => {
    const members = team.filter(member => 
      (relationships as readonly string[]).includes(member.assignment.relationship)
    );
    if (members.length > 0) {
      acc[category] = members;
    }
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Get team members for selected category
  const getFilteredTeam = () => {
    if (selectedCategory === "all") return team;
    return categorizedTeam[selectedCategory] || [];
  };

  const filteredTeam = getFilteredTeam();

  // Team statistics
  const teamStats = {
    total: team.length,
    verified: team.filter(m => m.verified).length,
    avgRating: team.length > 0 
      ? (team.reduce((sum, m) => sum + m.ratings_average, 0) / team.length)
      : 0,
    activeProjects: team.filter(m => m.assignment.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Office Team Roster</h1>
          <p className="text-muted-foreground mt-1">
            Meet your dedicated professionals working together for your family's success
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{teamStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{teamStats.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{teamStats.avgRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{teamStats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="all">All Team</TabsTrigger>
          {Object.keys(categorizedTeam).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeam.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.photo_url} />
                      <AvatarFallback className="text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                        {member.verified && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {PROFESSIONAL_RELATIONSHIPS[member.assignment.relationship as keyof typeof PROFESSIONAL_RELATIONSHIPS]}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {member.firm || member.company}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Bio/Description */}
                  {member.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-2">
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{member.location}</span>
                      </div>
                    )}
                    {member.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                        <a 
                          href={member.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Specialties & Languages */}
                  <div className="space-y-3">
                    {member.specialties && member.specialties.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {member.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {member.languages && member.languages.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Languages</p>
                        <div className="flex flex-wrap gap-1">
                          {member.languages.map((language, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rating & Reviews */}
                  {member.ratings_average > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{member.ratings_average.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({member.reviews_count} review{member.reviews_count !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}

                  <Separator />

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Schedule
                    </Button>
                  </div>

                  {/* Assignment Notes */}
                  {member.assignment.notes && (
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                      <p className="font-medium mb-1">Assignment Notes:</p>
                      <p>{member.assignment.notes}</p>
                    </div>
                  )}

                  {/* Assignment Date */}
                  <div className="text-xs text-muted-foreground">
                    Joined team: {new Date(member.assignment.start_date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTeam.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedCategory === "all" 
                      ? "Build Your Professional Team" 
                      : `No ${selectedCategory} Professionals`
                    }
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedCategory === "all"
                      ? "Start by adding professionals from our marketplace or inviting your existing advisors."
                      : `Add professionals in the ${selectedCategory} category to complete your family office team.`
                    }
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
        </TabsContent>
      </Tabs>
    </div>
  );
}