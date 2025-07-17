import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Search, FileText, Video, Download, ExternalLink, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface TenantResource {
  id: string;
  title: string;
  description?: string;
  content_type: string;
  resource_url?: string;
  file_path?: string;
  thumbnail_url?: string;
  is_premium: boolean;
  is_global: boolean;
  is_visible: boolean;
  tags?: string[];
  segments?: string[];
  created_at: string;
}

const CONTENT_TYPE_ICONS = {
  article: FileText,
  video: Video,
  pdf: FileText,
  webinar: Video,
  tool: Download
};

export function TenantResourceLibrary() {
  const [resources, setResources] = useState<TenantResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<TenantResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const { currentTenant } = useTenant();

  const fetchResources = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('tenant_resources')
        .select('*')
        .or(`tenant_id.eq.${currentTenant.id},is_global.eq.true`)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
      setFilteredResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentTenant]);

  useEffect(() => {
    let filtered = resources;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by content type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.content_type === selectedType);
    }

    // Filter by segment
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(resource =>
        resource.segments?.includes(selectedSegment) || !resource.segments?.length
      );
    }

    setFilteredResources(filtered);
  }, [resources, searchQuery, selectedType, selectedSegment]);

  const handleResourceClick = (resource: TenantResource) => {
    if (resource.resource_url) {
      window.open(resource.resource_url, '_blank');
    } else if (resource.file_path) {
      // Handle file download
      toast.info('File download functionality coming soon');
    }
  };

  const contentTypes = [...new Set(resources.map(r => r.content_type))];
  const allSegments = [...new Set(resources.flatMap(r => r.segments || []))];

  const ResourceCard = ({ resource }: { resource: TenantResource }) => {
    const Icon = CONTENT_TYPE_ICONS[resource.content_type as keyof typeof CONTENT_TYPE_ICONS] || FileText;
    
    const content = (
      <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Icon className="h-6 w-6 text-primary" />
            <div className="flex gap-1">
              {resource.is_premium && (
                <Badge variant="secondary" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {resource.is_global && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Global
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-base">{resource.title}</CardTitle>
          {resource.description && (
            <CardDescription className="text-sm line-clamp-2">
              {resource.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs capitalize">
              {resource.content_type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResourceClick(resource)}
            >
              {resource.resource_url ? (
                <ExternalLink className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );

    if (resource.is_premium) {
      return (
        <PremiumFeatureGate
          featureName="premium_resources"
          featureLabel="Premium Resources"
          featureDescription="Access to exclusive educational content and tools"
        >
          {content}
        </PremiumFeatureGate>
      );
    }

    return content;
  };

  if (isLoading) {
    return <div className="p-6">Loading resources...</div>;
  }

  const premiumResources = filteredResources.filter(r => r.is_premium);
  const freeResources = filteredResources.filter(r => !r.is_premium);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {contentTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            {allSegments.map((segment) => (
              <SelectItem key={segment} value={segment}>
                {segment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Resources ({filteredResources.length})
          </TabsTrigger>
          <TabsTrigger value="free">
            Free ({freeResources.length})
          </TabsTrigger>
          <TabsTrigger value="premium">
            Premium ({premiumResources.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredResources.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No resources found matching your criteria
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="free" className="space-y-4">
          {freeResources.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No free resources available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {freeResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="premium" className="space-y-4">
          {premiumResources.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No premium resources available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}