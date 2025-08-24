import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, FileText, Users, Plus, Shield, Activity } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'Ready Check Enhanced',
      description: 'Comprehensive route auditing and preview management',
      icon: Shield,
      route: '/admin/ready-check-enhanced',
      color: 'text-green-600'
    },
    {
      title: 'Environment Inspector',
      description: 'View feature flags and environment configuration',
      icon: Settings,
      route: '/admin/env',
      color: 'text-blue-600'
    },
    {
      title: 'QA Coverage',
      description: 'Test coverage and quality assurance metrics',
      icon: Database,
      route: '/admin/qa-coverage',
      color: 'text-purple-600'
    },
    {
      title: 'Rules Coverage',
      description: 'Estate, deed, and healthcare rules coverage dashboard',
      icon: FileText,
      route: '/admin/rules-coverage',
      color: 'text-green-600'
    },
    {
      title: 'Rules Import',
      description: 'Bulk import and update estate rules via JSON',
      icon: Database,
      route: '/admin/rules-import',
      color: 'text-cyan-600'
    },
    {
      title: 'County Quick Add',
      description: 'Generate and add county metadata with templates',
      icon: Plus,
      route: '/admin/county-add',
      color: 'text-indigo-600'
    },
    {
      title: 'Publish Panel',
      description: 'Production deployment and CDN management',
      icon: FileText,
      route: '/admin/publish',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            System administration, monitoring, and configuration tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card 
                key={section.route}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => navigate(section.route)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-6 w-6 ${section.color}`} />
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Active Tools</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}