import React from 'react';
import { SupabaseDocument } from '@/hooks/useSupabaseDocuments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Download, 
  Share, 
  Trash2, 
  Eye, 
  FileText, 
  Image, 
  File,
  Folder,
  Lock,
  Users,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface DocumentGridProps {
  documents: SupabaseDocument[];
  onDownload: (doc: SupabaseDocument) => void;
  onShare: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onManagePermissions: (documentId: string) => void;
}

export function DocumentGrid({ 
  documents, 
  onDownload, 
  onShare, 
  onDelete, 
  onManagePermissions 
}: DocumentGridProps) {
  const getDocumentIcon = (document: SupabaseDocument) => {
    if (document.is_folder) return Folder;
    
    switch (document.type) {
      case 'image':
        return Image;
      case 'pdf':
        return FileText;
      default:
        return File;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'tax': return 'bg-red-100 text-red-800';
      case 'estate': return 'bg-purple-100 text-purple-800';
      case 'insurance': return 'bg-blue-100 text-blue-800';
      case 'investment': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No documents found</h3>
        <p className="text-muted-foreground">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => {
        const Icon = getDocumentIcon(document);
        
        return (
          <Card key={document.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{document.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getDocumentTypeColor(document.category)}`}
                      >
                        {document.category}
                      </Badge>
                      {document.is_private && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                      {document.shared && (
                        <Users className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {}}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload(document)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare(document.id)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onManagePermissions(document.id)}>
                      <Users className="h-4 w-4 mr-2" />
                      Permissions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(document.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {document.size && (
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(document.size)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span>Modified:</span>
                  <span>{formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}</span>
                </div>

                {document.uploaded_by && (
                  <div className="flex items-center justify-between">
                    <span>By:</span>
                    <span className="truncate max-w-20">{document.uploaded_by}</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1 mt-3 pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDownload(document)}
                  className="flex-1"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onShare(document.id)}
                  className="flex-1"
                >
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}