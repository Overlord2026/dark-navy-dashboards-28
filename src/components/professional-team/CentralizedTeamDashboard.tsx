import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  MessageCircle, 
  Calendar, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  Shield, 
  Clock,
  Settings,
  TrendingUp,
  Activity,
  Target,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UserPlus,
  Briefcase,
  FileText,
  ArrowRight
} from "lucide-react";
import { TeamMember, EnhancedProfessional, PROFESSIONAL_RELATIONSHIPS, PROFESSIONAL_CATEGORIES } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";

interface CentralizedTeamDashboardProps {
  onViewMarketplace: () => void;
  onViewProfile: (professional: EnhancedProfessional | TeamMember) => void;
  onAddProfessional: () => void;
}

export function CentralizedTeamDashboard({ 
  onViewMarketplace, 
  onViewProfile, 
  onAddProfessional 
}: CentralizedTeamDashboardProps) {
  const { team, allProfessionals, loading, assignProfessional } = useProfessionalTeam();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-12 w-full bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate team statistics
  const teamStats = {
    totalMembers: team.length,
    verified: team.filter(m => m.verified).length,
    avgRating: team.length > 0 
      ? (team.reduce((sum, m) => sum + m.ratings_average, 0) / team.length)
      : 0,
    activeProjects: team.filter(m => m.assignment.status === 'active').length,
    categories: Object.keys(PROFESSIONAL_CATEGORIES).length
  };

  // Mock active projects (this would come from a projects system in the future)
  const activeProjects = [
    {
      id: '1',
      name: 'Estate Planning Review 2025',
      status: 'in_progress',
      assignedTeam: team.filter(m => ['estate_attorney', 'cpa', 'lead_advisor'].includes(m.assignment.relationship)),
      dueDate: '2025-03-15',
      progress: 65
    },
    {
      id: '2', 
      name: 'Healthcare Directive Updates',
      status: 'planning',
      assignedTeam: team.filter(m => ['health_pro', 'estate_attorney'].includes(m.assignment.relationship)),
      dueDate: '2025-02-28',
      progress: 25
    },
    {
      id: '3',
      name: 'Investment Portfolio Rebalancing',
      status: 'active',
      assignedTeam: team.filter(m => ['investment_advisor', 'lead_advisor'].includes(m.assignment.relationship)),
      dueDate: '2025-01-30',
      progress: 90
    }
  ];

  // Get team by category
  const categorizedTeam = Object.entries(PROFESSIONAL_CATEGORIES).reduce((acc, [category, relationships]) => {
    const members = team.filter(member => 
      (relationships as readonly string[]).includes(member.assignment.relationship)
    );
    if (members.length > 0) {
      acc[category] = members;
    }
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Filter professionals for quick add
  const availableProfessionals = allProfessionals
    .filter(p => p.accepting_new_clients && !team.some(t => t.id === p.id))
    .slice(0, 6);

  const QuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full justify-start" 
          onClick={onAddProfessional}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onViewMarketplace}
        >
          <Search className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => {/* TODO: Implement project creation */}}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Start New Project
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => {/* TODO: Implement team meeting */}}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Team Meeting
        </Button>
      </CardContent>
    </Card>
  );

  const TeamOverviewCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
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
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">{activeProjects.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ProjectsSection = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Active Projects
          </CardTitle>
          <CardDescription>Your family's ongoing initiatives</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All Projects
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeProjects.map((project) => (
            <Card key={project.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      project.status === 'active' ? 'default' :
                      project.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {project.assignedTeam.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">Team:</span>
                    <div className="flex -space-x-2">
                      {project.assignedTeam.slice(0, 4).map((member) => (
                        <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={member.photo_url} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.assignedTeam.length > 4 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+{project.assignedTeam.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {activeProjects.length === 0 && (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-2">No Active Projects</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first project to coordinate your team's efforts.
              </p>
              <Button onClick={() => {/* TODO: Implement project creation */}}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const TeamMemberCard = ({ member }: { member: TeamMember }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewProfile(member)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.photo_url} />
            <AvatarFallback>
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{member.name}</h4>
              {member.verified && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {PROFESSIONAL_RELATIONSHIPS[member.assignment.relationship as keyof typeof PROFESSIONAL_RELATIONSHIPS]}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {member.firm || member.company}
            </p>
            {member.ratings_average > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs">{member.ratings_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1">
            <MessageCircle className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="h-3 w-3 mr-1" />
            Meet
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Family Office Team</h1>
          <p className="text-muted-foreground mt-1">
            Central command for your professional network and ongoing projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddProfessional}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          <Button variant="outline" onClick={onViewMarketplace}>
            Browse Professionals
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Roster</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="marketplace">Quick Add</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <TeamOverviewCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectsSection />
            </div>
            <QuickActions />
          </div>

          {/* Recent Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.photo_url} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{member.name}</span> joined your team
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(member.assignment.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {team.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No team activity yet. Add your first professional to get started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Team by Category */}
          <div className="space-y-6">
            {Object.entries(categorizedTeam).map(([category, members]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="outline">{members.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members
                    .filter(member => 
                      searchQuery === "" || 
                      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      member.firm?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
              </div>
            ))}
            {Object.keys(categorizedTeam).length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Build Your Professional Team</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding professionals from our marketplace or inviting your existing advisors.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={onViewMarketplace}>Browse Marketplace</Button>
                  <Button variant="outline" onClick={onAddProfessional}>
                    Invite Professional
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsSection />
        </TabsContent>

        <TabsContent value="marketplace" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommended Professionals
              </CardTitle>
              <CardDescription>
                Top-rated professionals available now for your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableProfessionals.map((professional) => (
                  <Card key={professional.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={professional.photo_url} />
                          <AvatarFallback>
                            {professional.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{professional.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {professional.firm || professional.company}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {professional.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                            {professional.ratings_average > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs">{professional.ratings_average.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" onClick={() => onViewProfile(professional)}>
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            Quick Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {availableProfessionals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No new professionals available at the moment.</p>
                  <Button variant="outline" className="mt-4" onClick={onViewMarketplace}>
                    Browse Full Marketplace
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}