import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Calendar, FileText, Users, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BusinessEntity } from '@/hooks/useEntityManagement';

interface EntityCardProps {
  entity: BusinessEntity;
}

export const EntityCard = ({ entity }: EntityCardProps) => {
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Trust':
        return Users;
      case 'Nonprofit':
        return FileText;
      default:
        return Building2;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'dissolved':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const Icon = getEntityIcon(entity.entity_type);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-primary" />
          <Badge variant={getStatusColor(entity.status)}>
            {entity.status}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Entity</DropdownMenuItem>
            <DropdownMenuItem>Manage Ownership</DropdownMenuItem>
            <DropdownMenuItem>View Documents</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Entity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg mb-2">{entity.entity_name}</CardTitle>
        <CardDescription className="mb-4">
          {entity.entity_type} • {entity.description || 'No description provided'}
        </CardDescription>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {entity.jurisdiction}
          </div>
          {entity.formation_date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Formed: {new Date(entity.formation_date).toLocaleDateString()}
            </div>
          )}
          {entity.ein && (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              EIN: {entity.ein}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1">
            View Filings
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};