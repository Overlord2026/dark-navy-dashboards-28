import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, GitBranch, Globe, CheckCircle, AlertCircle } from 'lucide-react';

export function PublishTab() {
  const [selectedEnvironment, setSelectedEnvironment] = useState('staging');
  
  const environments = [
    {
      name: 'Development',
      value: 'development',
      status: 'active',
      lastDeploy: '2024-03-15 14:30',
      version: 'v2.4.1-dev',
      health: 'healthy'
    },
    {
      name: 'Staging',
      value: 'staging',
      status: 'active',
      lastDeploy: '2024-03-15 12:15',
      version: 'v2.4.0',
      health: 'healthy'
    },
    {
      name: 'Production',
      value: 'production',
      status: 'stable',
      lastDeploy: '2024-03-14 09:00',
      version: 'v2.3.2',
      health: 'healthy'
    }
  ];

  const deploymentHistory = [
    {
      environment: 'staging',
      version: 'v2.4.0',
      timestamp: '2024-03-15 12:15',
      status: 'success',
      author: 'CTO',
      changes: ['Security enhancements', 'UI improvements', 'Bug fixes']
    },
    {
      environment: 'production',
      version: 'v2.3.2',
      timestamp: '2024-03-14 09:00',
      status: 'success',
      author: 'DevOps',
      changes: ['Critical security patch', 'Performance optimizations']
    },
    {
      environment: 'staging',
      version: 'v2.3.1',
      timestamp: '2024-03-13 16:45',
      status: 'failed',
      author: 'Dev Team',
      changes: ['Database migrations', 'API updates']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case 'healthy': case 'stable': return 'bg-green-600 text-white';
      case 'failed': case 'error': return 'bg-red-600 text-white';
      case 'active': case 'deploying': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bfo-subheader p-4 -m-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-bfo-gold" />
            <h2 className="text-xl font-semibold">Publish & Deploy</h2>
          </div>
          <Button className="bfo-cta">
            <Rocket className="h-4 w-4 mr-2" />
            Deploy to Production
          </Button>
        </div>
        <p className="text-sm mt-1 opacity-80">Manage deployments across environments</p>
      </div>

      {/* Environment Status */}
      <div className="grid gap-4 md:grid-cols-3">
        {environments.map((env, index) => (
          <Card key={index} className="bfo-stat">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{env.name}</h3>
                  {getHealthIcon(env.health)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Version:</span>
                    <span className="text-bfo-gold font-mono">{env.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Status:</span>
                    <Badge className={getStatusColor(env.status)}>{env.status}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Last Deploy:</span>
                    <span className="text-white text-xs">{env.lastDeploy}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deployment Controls */}
      <Card className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Deploy New Version</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Target Environment</label>
                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                  <SelectTrigger className="bg-background border-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Version</label>
                <Select defaultValue="latest">
                  <SelectTrigger className="bg-background border-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">v2.4.1-dev (Latest)</SelectItem>
                    <SelectItem value="current">v2.4.0 (Current)</SelectItem>
                    <SelectItem value="previous">v2.3.2 (Previous)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button className="bfo-cta">
                <GitBranch className="h-4 w-4 mr-2" />
                Deploy
              </Button>
              <Button variant="outline" className="text-white border-bfo-gold/40 hover:bg-bfo-gold/10">
                <Globe className="h-4 w-4 mr-2" />
                View Environment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment History */}
      <Card className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentHistory.map((deployment, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-black/20 border border-bfo-gold/20">
                <div className="flex-shrink-0">
                  <Badge className={getStatusColor(deployment.status)}>
                    {deployment.status}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{deployment.environment}</span>
                    <span className="font-mono text-sm text-bfo-gold">{deployment.version}</span>
                    <span className="text-xs text-gray-400">{deployment.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Deployed by <span className="text-white">{deployment.author}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {deployment.changes.join(' • ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}