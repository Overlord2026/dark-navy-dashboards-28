
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DownloadCloud, ToggleRight, Settings, Shield } from 'lucide-react';

export const PluginsTab: React.FC = () => {
  const plugins = [
    {
      id: 'p1',
      name: 'Document Scanner',
      description: 'Scan and process documents automatically',
      status: 'active',
      author: 'AWM Tech',
      version: '1.2.3',
      category: 'documents'
    },
    {
      id: 'p2',
      name: 'Advanced Analytics',
      description: 'Enhanced reporting and analytics tools',
      status: 'active',
      author: 'Data Insights Inc',
      version: '2.0.1',
      category: 'reporting'
    },
    {
      id: 'p3',
      name: 'Compliance Checker',
      description: 'Regulatory compliance verification toolkit',
      status: 'inactive',
      author: 'RegTech Solutions',
      version: '1.0.5',
      category: 'compliance'
    }
  ];

  const availablePlugins = [
    {
      id: 'a1',
      name: 'Secure Messaging',
      description: 'End-to-end encrypted messaging system',
      author: 'SecureComm LLC',
      version: '2.1.0',
      category: 'communication'
    },
    {
      id: 'a2',
      name: 'Portfolio Analyzer',
      description: 'Advanced portfolio performance analysis',
      author: 'Investment Tech',
      version: '1.3.2',
      category: 'investments'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Plugins</h2>
        <p className="text-muted-foreground">
          Extend functionality with plugins and integrations
        </p>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-3">Installed Plugins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plugins.map(plugin => (
            <Card key={plugin.id} className={plugin.status === 'inactive' ? 'opacity-70' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{plugin.name}</CardTitle>
                    <CardDescription>{plugin.description}</CardDescription>
                  </div>
                  <Badge variant={plugin.status === 'active' ? 'success' : 'secondary'}>
                    {plugin.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author</span>
                    <span>{plugin.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>{plugin.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{plugin.category}</Badge>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm" variant={plugin.status === 'active' ? 'destructive' : 'default'}>
                      <ToggleRight className="h-4 w-4 mr-2" />
                      {plugin.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-3">Available Plugins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availablePlugins.map(plugin => (
            <Card key={plugin.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{plugin.name}</CardTitle>
                <CardDescription>{plugin.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author</span>
                    <span>{plugin.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>{plugin.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{plugin.category}</Badge>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button size="sm">
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Install
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
