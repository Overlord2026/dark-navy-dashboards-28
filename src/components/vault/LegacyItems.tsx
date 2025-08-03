import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Mic, Image, Plus, Calendar, Eye, Download } from 'lucide-react';
import { LeaveMessageWizard } from './LeaveMessageWizard';
import { useFamilyVault } from '@/hooks/useFamilyVault';
import type { Database } from '@/integrations/supabase/types';

type LegacyItem = Database['public']['Tables']['legacy_items']['Row'];
type VaultMember = Database['public']['Tables']['vault_members']['Row'];

interface LegacyItemsProps {
  vaultId: string;
  items: LegacyItem[];
  onItemAdded: () => void;
}

export function LegacyItems({ vaultId, items, onItemAdded }: LegacyItemsProps) {
  const [showMessageWizard, setShowMessageWizard] = useState(false);
  const { members } = useFamilyVault(vaultId);

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Mic className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getItemTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'video':
        return 'bg-blue-100 text-blue-700';
      case 'audio':
        return 'bg-green-100 text-green-700';
      case 'image':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Legacy Items</h2>
          <p className="text-muted-foreground">
            Messages, videos, and memories preserved for your family.
          </p>
        </div>
        
        <Button onClick={() => setShowMessageWizard(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Leave Message
        </Button>
      </div>

      <div className="grid gap-4">
        {items.filter(item => item.status === 'active').map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getItemTypeColor(item.item_type)}`}>
                  {getItemIcon(item.item_type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.description && (
                        <p className="text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {item.item_type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    
                    {item.file_size && (
                      <div>
                        Size: {formatFileSize(item.file_size)}
                      </div>
                    )}
                    
                    {item.duration_seconds && (
                      <div>
                        Duration: {formatDuration(item.duration_seconds)}
                      </div>
                    )}
                  </div>
                  
                  {item.content_url && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {item.is_encrypted && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    🔒 This item is encrypted for secure storage
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {items.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No legacy items yet</h3>
              <p className="text-muted-foreground mb-4">
                Start preserving your family's story by leaving your first message.
              </p>
              <Button onClick={() => setShowMessageWizard(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Leave Your First Message
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {showMessageWizard && (
        <LeaveMessageWizard
          vaultId={vaultId}
          members={members}
          onClose={() => setShowMessageWizard(false)}
          onSuccess={() => {
            setShowMessageWizard(false);
            onItemAdded();
          }}
        />
      )}
    </div>
  );
}