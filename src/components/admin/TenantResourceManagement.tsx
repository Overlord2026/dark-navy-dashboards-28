import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Eye, EyeOff, Upload, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface TenantResource {
  id: string;
  title: string;
  description?: string;
  type: 'guide' | 'model' | 'course' | 'document' | 'video';
  url?: string;
  file_path?: string;
  is_premium: boolean;
  is_visible: boolean;
  display_order: number;
  created_at: string;
}

export const TenantResourceManagement: React.FC = () => {
  const { currentTenant } = useTenant();
  const [resources, setResources] = useState<TenantResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<TenantResource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'guide' as TenantResource['type'],
    url: '',
    is_premium: false,
    is_visible: true
  });

  useEffect(() => {
    if (currentTenant) {
      fetchResources();
    }
  }, [currentTenant]);

  const fetchResources = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setResources((data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.content_type as TenantResource['type'],
        url: item.url,
        file_path: item.file_path,
        is_premium: item.is_premium || false,
        is_visible: true, // Assuming all fetched resources are visible
        display_order: 0, // Default value
        created_at: item.created_at
      })));
    } catch (err) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentTenant || !formData.title) return;

    try {
      const resourceData = {
        title: formData.title,
        description: formData.description,
        content_type: formData.type,
        url: formData.url,
        is_premium: formData.is_premium,
        tenant_id: currentTenant.id
      };

      let result;
      if (editingResource) {
        result = await supabase
          .from('educational_content')
          .update(resourceData)
          .eq('id', editingResource.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('educational_content')
          .insert(resourceData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success(editingResource ? 'Resource updated successfully' : 'Resource created successfully');
      setFormData({ title: '', description: '', type: 'guide', url: '', is_premium: false, is_visible: true });
      setShowAddForm(false);
      setEditingResource(null);
      fetchResources();
    } catch (err) {
      toast.error(editingResource ? 'Failed to update resource' : 'Failed to create resource');
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  const handleEdit = (resource: TenantResource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || '',
      type: resource.type,
      url: resource.url || '',
      is_premium: resource.is_premium,
      is_visible: resource.is_visible
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'guide', url: '', is_premium: false, is_visible: true });
    setShowAddForm(false);
    setEditingResource(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'model': return 'bg-green-100 text-green-800';
      case 'course': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-orange-100 text-orange-800';
      case 'video': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resource Library
              </CardTitle>
              <CardDescription>
                Manage educational content and resources for your organization
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <h3 className="font-medium">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="resource-title">Title</Label>
                  <Input
                    id="resource-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Resource title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TenantResource['type'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="model">Model</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resource-description">Description</Label>
                <Textarea
                  id="resource-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Resource description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-url">URL or File Path</Label>
                <div className="flex gap-2">
                  <Input
                    id="resource-url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/resource or file path"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="resource-premium"
                    checked={formData.is_premium}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_premium: checked }))}
                  />
                  <Label htmlFor="resource-premium">Premium Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="resource-visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
                  />
                  <Label htmlFor="resource-visible">Visible</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit}>
                  {editingResource ? 'Update Resource' : 'Add Resource'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading resources...</div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{resource.title}</h4>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                      {resource.is_premium && (
                        <Badge variant="secondary">Premium</Badge>
                      )}
                      {!resource.is_visible && (
                        <Badge variant="outline" className="text-gray-500">
                          <EyeOff className="mr-1 h-3 w-3" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    )}
                    {resource.url && (
                      <p className="text-xs text-muted-foreground mt-1">{resource.url}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(resource.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              
              {resources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No resources found.</p>
                  <p className="text-sm">Add your first resource to get started.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};