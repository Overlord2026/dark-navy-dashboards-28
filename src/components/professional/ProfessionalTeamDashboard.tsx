import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  UserCheck, 
  Building, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Award,
  TrendingUp,
  Network,
  CheckCircle
} from 'lucide-react';
import { useProfessionalTeams } from '@/hooks/useProfessionalTeams';

export function ProfessionalTeamDashboard() {
  const { professionals, metrics, loading } = useProfessionalTeams();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProfessionalTypeColor = (type: string) => {
    if (type.includes('Tax') || type.includes('Accountant')) return 'bg-blue-500';
    if (type.includes('Estate') || type.includes('Attorney')) return 'bg-purple-500';
    if (type.includes('Insurance')) return 'bg-green-500';
    if (type.includes('Financial') || type.includes('Advisor')) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Professionals</p>
                <p className="text-2xl font-bold">{metrics.totalProfessionals}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.activeProfessionals} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Multi-Professional Clients</p>
                <p className="text-2xl font-bold">{metrics.multiProfessionalClients}</p>
              </div>
              <Network className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              of {metrics.totalClients} total clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{metrics.averageResponseTime}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-success mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              15% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Satisfaction</p>
                <p className="text-2xl font-bold">{metrics.clientSatisfactionScore.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {metrics.completedHandoffs} interactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Professional Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Professional Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {professionals.map((professional) => (
            <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={`${getProfessionalTypeColor(professional.type)} text-white`}>
                      {getInitials(professional.name)}
                    </AvatarFallback>
                  </Avatar>
                  {professional.verified && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-4 w-4 text-green-500 bg-background rounded-full" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{professional.name}</h3>
                    <Badge variant={professional.status === 'active' ? 'default' : 'secondary'}>
                      {professional.status}
                    </Badge>
                    {professional.verified && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{professional.type}</p>
                  {professional.company && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {professional.company}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{professional.clientCount} clients</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {professional.responseTime} avg response
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {professional.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last active</p>
                  <p className="text-xs">{professional.lastActivity}</p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {professional.phone && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                  {professional.email && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Specialties Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Team Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {professionals.flatMap(p => p.specialties).filter((specialty, index, arr) => 
              arr.indexOf(specialty) === index
            ).map((specialty) => (
              <div key={specialty} className="p-3 border rounded-lg text-center">
                <p className="text-sm font-medium">{specialty}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {professionals.filter(p => p.specialties.includes(specialty)).length} professionals
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}