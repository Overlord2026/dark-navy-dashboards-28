import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Shield, 
  Eye, 
  Download, 
  Edit, 
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Permission {
  id: string;
  professionalName: string;
  professionalEmail: string;
  professionalType: string;
  accessLevel: 'view' | 'download' | 'edit';
  grantedAt: string;
  expiresAt?: string;
  lastAccessed?: string;
}

interface DocumentPermissionsPanelProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPermissionsPanel({ 
  documentId, 
  isOpen, 
  onClose 
}: DocumentPermissionsPanelProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Simulate loading permissions
      setTimeout(() => {
        setPermissions([
          {
            id: '1',
            professionalName: 'John Smith',
            professionalEmail: 'john.smith@cpa.com',
            professionalType: 'CPA',
            accessLevel: 'download',
            grantedAt: '2024-01-15T10:00:00Z',
            expiresAt: '2024-03-15T10:00:00Z',
            lastAccessed: '2024-01-20T14:30:00Z'
          },
          {
            id: '2',
            professionalName: 'Sarah Johnson',
            professionalEmail: 'sarah@legal-firm.com',
            professionalType: 'Attorney',
            accessLevel: 'view',
            grantedAt: '2024-01-10T09:00:00Z',
            lastAccessed: '2024-01-18T11:15:00Z'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, documentId]);

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'edit':
        return <Edit className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'view':
        return 'bg-blue-100 text-blue-800';
      case 'download':
        return 'bg-green-100 text-green-800';
      case 'edit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRevokeAccess = (permissionId: string) => {
    setPermissions(prev => prev.filter(p => p.id !== permissionId));
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Document Permissions
          </DialogTitle>
          <DialogDescription>
            Manage who has access to this document and their permission levels
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {permissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Permissions</h3>
                <p className="text-muted-foreground">
                  This document hasn't been shared with any professionals yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {permissions.map((permission) => (
                <Card key={permission.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-full bg-muted">
                          <User className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{permission.professionalName}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {permission.professionalType}
                            </Badge>
                            <Badge 
                              className={`text-xs ${getAccessLevelColor(permission.accessLevel)}`}
                            >
                              {getAccessLevelIcon(permission.accessLevel)}
                              <span className="ml-1 capitalize">{permission.accessLevel}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <Mail className="h-3 w-3" />
                            {permission.professionalEmail}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Granted: {format(new Date(permission.grantedAt), 'MMM d, yyyy')}</span>
                            </div>
                            
                            {permission.expiresAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Expires: {format(new Date(permission.expiresAt), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                            
                            {permission.lastAccessed && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>Last viewed: {format(new Date(permission.lastAccessed), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeAccess(permission.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {permissions.length} active permission(s)
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}