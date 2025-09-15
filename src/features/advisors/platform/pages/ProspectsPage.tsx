import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Filter, Download, Search } from 'lucide-react';

// Reuse existing prospect components if available
// TODO: Import existing LeadsPage and PipelinePage components
// import { ProspectsList } from '@/components/advisor/ProspectsList';
// import { PipelineBoard } from '@/components/advisor/PipelineBoard';

export default function ProspectsPage() {
  return (
    <>
      <Helmet>
        <title>Prospects Management | Advisor Platform</title>
        <meta name="description" content="Manage prospects, track pipeline, and convert leads with integrated CRM tools" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Prospects Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your prospect pipeline with advanced CRM features
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Prospects</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <Badge variant="secondary">+12</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hot Leads</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Badge variant="destructive">+5</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">18.5%</p>
                </div>
                <Badge variant="default">+2.1%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pipeline Value</p>
                  <p className="text-2xl font-bold">$485K</p>
                </div>
                <Badge variant="secondary">+12%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter Prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search prospects by name, company, or notes..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <Button variant="outline">
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prospects List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Prospects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* TODO: Replace with existing ProspectsList component */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Sarah Johnson</h3>
                        <p className="text-sm text-muted-foreground">Johnson Family Trust • Estate Planning</p>
                        <p className="text-xs text-muted-foreground">Last contact: 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">Hot</Badge>
                        <p className="text-sm font-medium">$125K AUM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Michael Chen</h3>
                        <p className="text-sm text-muted-foreground">Tech Executive • Retirement Planning</p>
                        <p className="text-xs text-muted-foreground">Last contact: 5 days ago</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Warm</Badge>
                        <p className="text-sm font-medium">$250K AUM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Davis Family</h3>
                        <p className="text-sm text-muted-foreground">Multi-generational • Wealth Management</p>
                        <p className="text-xs text-muted-foreground">Last contact: 1 week ago</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Cold</Badge>
                        <p className="text-sm font-medium">$500K AUM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Initial Contact</span>
                    <Badge variant="secondary">45</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Qualification</span>
                    <Badge variant="secondary">28</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Proposal</span>
                    <Badge variant="secondary">15</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Closing</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    View Full Pipeline Board
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}