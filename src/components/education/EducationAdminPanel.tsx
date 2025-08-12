import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  BookOpen, 
  ExternalLink,
  Upload,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { useEducationResources } from '@/hooks/useEducationResources';
import { EducationResourceForm } from './EducationResourceForm';
import { EducationResource } from '@/types/education';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EducationAdminPanelProps {
  onBack: () => void;
}

export function EducationAdminPanel({ onBack }: EducationAdminPanelProps) {
  const { resources, loading, updateResource, deleteResource } = useEducationResources();
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<EducationResource | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
        return FileText;
      case 'flipbook':
        return BookOpen;
      case 'external_link':
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const handleEdit = (resource: EducationResource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteResource(id);
  };

  const toggleFeatured = async (resource: EducationResource) => {
    await updateResource(resource.id, { is_featured: !resource.is_featured });
  };

  const toggleActive = async (resource: EducationResource) => {
    await updateResource(resource.id, { is_active: !resource.is_active });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  if (showForm) {
    return (
      <EducationResourceForm 
        resource={editingResource}
        onClose={handleFormClose}
      />
    );
  }

  const resourcesByType = {
    pdf: resources.filter(r => r.resource_type === 'pdf'),
    docx: resources.filter(r => r.resource_type === 'docx'),
    flipbook: resources.filter(r => r.resource_type === 'flipbook'),
    external_link: resources.filter(r => r.resource_type === 'external_link'),
  };

  const renderResourceList = (resourceList: EducationResource[]) => (
    <div className="space-y-4">
      {resourceList.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No resources of this type yet.</p>
          </CardContent>
        </Card>
      ) : (
        resourceList.map(resource => {
          const Icon = getResourceIcon(resource.resource_type);
          
          return (
            <Card key={resource.id} className={resource.is_active ? '' : 'opacity-60'}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{resource.title}</h3>
                        {resource.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        {!resource.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {resource.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                        {resource.file_size && (
                          <Badge variant="secondary" className="text-xs">
                            {(resource.file_size / (1024 * 1024)).toFixed(1)} MB
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(resource)}
                      className={resource.is_featured ? 'text-yellow-600' : ''}
                    >
                      <Star className={`h-4 w-4 ${resource.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(resource)}
                    >
                      {resource.is_active ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(resource.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <ThreeColumnLayout title="Education Center Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Manage Education Resources</h1>
              <p className="text-muted-foreground">Add, edit, and organize learning materials</p>
            </div>
          </div>
          
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.filter(r => r.is_featured).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.filter(r => r.is_active).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(resources.map(r => r.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Management */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
            <TabsTrigger value="pdf">PDF ({resourcesByType.pdf.length})</TabsTrigger>
            <TabsTrigger value="docx">Word ({resourcesByType.docx.length})</TabsTrigger>
            <TabsTrigger value="flipbook">Flipbooks ({resourcesByType.flipbook.length})</TabsTrigger>
            <TabsTrigger value="external">External ({resourcesByType.external_link.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderResourceList(resources)}
          </TabsContent>

          <TabsContent value="pdf">
            {renderResourceList(resourcesByType.pdf)}
          </TabsContent>

          <TabsContent value="docx">
            {renderResourceList(resourcesByType.docx)}
          </TabsContent>

          <TabsContent value="flipbook">
            {renderResourceList(resourcesByType.flipbook)}
          </TabsContent>

          <TabsContent value="external">
            {renderResourceList(resourcesByType.external_link)}
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}