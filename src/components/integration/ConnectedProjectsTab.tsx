
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, Check, ArrowUpRight, Calendar } from 'lucide-react';

export const ConnectedProjectsTab: React.FC = () => {
  const connectedProjects = [
    {
      id: 'p1',
      name: 'Client Portal',
      description: 'Main client portal for family office members',
      status: 'active',
      lastSync: '2025-05-12T14:30:00',
      type: 'frontend'
    },
    {
      id: 'p2',
      name: 'Document Management System',
      description: 'Secure document storage and sharing platform',
      status: 'active',
      lastSync: '2025-05-14T09:45:00',
      type: 'service'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Connected Projects</h2>
        <Button size="sm">
          <Link className="h-4 w-4 mr-2" />
          Connect New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectedProjects.map(project => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                  {project.status === 'active' ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Connected
                    </>
                  ) : 'Pending'}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Last synced: {new Date(project.lastSync).toLocaleString()}</span>
              </div>
              <Badge variant="outline" className="mt-2">
                {project.type === 'frontend' ? 'Frontend App' : 'Service'}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View Details
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
