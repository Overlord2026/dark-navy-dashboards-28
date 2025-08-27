import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { listSites, createSite, publishSite } from '@/services/siteBuilder';
import { Plus, ExternalLink, Globe, Edit, Eye } from 'lucide-react';

interface Site {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
}

export default function SitesAdmin() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSite, setNewSite] = useState({ title: '', slug: '' });

  const fetchSites = async () => {
    setLoading(true);
    try {
      // Get current user's IAR ID (mock for now)
      const iarId = 'current_user_iar_id';
      const sitesData = await listSites(iarId);
      setSites(sitesData);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async () => {
    if (!newSite.title || !newSite.slug) return;

    try {
      const iarId = 'current_user_iar_id';
      await createSite(iarId, newSite.title, newSite.slug);
      setNewSite({ title: '', slug: '' });
      setShowCreateForm(false);
      await fetchSites();
    } catch (error) {
      console.error('Failed to create site:', error);
    }
  };

  const handlePublishSite = async (siteId: string) => {
    try {
      await publishSite(siteId);
      await fetchSites();
    } catch (error) {
      console.error('Failed to publish site:', error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            IAR Micro-Sites Factory
          </h1>
          <p className="text-muted-foreground">
            Brand-safe advisor sites with compliance auto-injection
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Site
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Micro-Site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site Title</label>
              <Input
                value={newSite.title}
                onChange={(e) => setNewSite(prev => ({ ...prev, title: e.target.value }))}
                placeholder="John Smith Financial Advisor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/a/</span>
                <Input
                  value={newSite.slug}
                  onChange={(e) => setNewSite(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="john-smith"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateSite} disabled={!newSite.title || !newSite.slug}>
                Create Site
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sites Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.title}</TableCell>
                  <TableCell>
                    <code className="text-sm">/a/{site.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      site.status === 'published' ? 'default' :
                      site.status === 'draft' ? 'secondary' : 'outline'
                    }>
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {site.published_at ? new Date(site.published_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/admin/sites/${site.id}`}>
                          <Edit className="h-4 w-4" />
                        </a>
                      </Button>
                      {site.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePublishSite(site.id)}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      {site.status === 'published' && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/a/${site.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        All sites include auto-injected compliance disclosures • Publish-RDS and Rules-Export-RDS logged • Access-RDS for public views
      </div>
    </div>
  );
}