import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  Video, 
  Users, 
  Bot, 
  ClipboardList, 
  Plus,
  Lock,
  Heart,
  Calendar,
  Eye,
  Download,
  Share
} from 'lucide-react';
import { useVaultItems } from '@/hooks/useVaultItems';
import { VaultItemUpload } from './VaultItemUpload';
import { VaultAvatarSetup } from './VaultAvatarSetup';
import { VaultAuditLog } from './VaultAuditLog';

export function LegacyVaultDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpload, setShowUpload] = useState(false);
  const [showAvatarSetup, setShowAvatarSetup] = useState(false);
  const { items, isLoading } = useVaultItems();

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'photo':
        return <Heart className="h-5 w-5" />;
      case 'audio':
        return <Video className="h-5 w-5" />;
      case 'avatar':
        return <Bot className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'video':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'photo':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300';
      case 'audio':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'avatar':
        return 'bg-gold-100 text-gold-700 dark:bg-gold-900 dark:text-gold-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const stats = {
    totalItems: items?.length || 0,
    documents: items?.filter(item => item.type === 'document').length || 0,
    videos: items?.filter(item => item.type === 'video').length || 0,
    photos: items?.filter(item => item.type === 'photo').length || 0
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-navy via-primary to-emerald p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Secure Legacy Vault™</h1>
          </div>
          <p className="text-xl opacity-90">
            Your family's story, secure forever. Preserved across generations.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.documents}</p>
                  <p className="text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.videos}</p>
                  <p className="text-muted-foreground">Video Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.photos}</p>
                  <p className="text-muted-foreground">Memories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-100 rounded-lg">
                  <Bot className="h-6 w-6 text-gold-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-muted-foreground">AI Avatar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="avatar">AI Avatar</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setShowUpload(true)}
                    className="w-full justify-start gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Upload Document
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUpload(true)}
                    className="w-full justify-start gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Record Video Message
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAvatarSetup(true)}
                    className="w-full justify-start gap-2"
                  >
                    <Bot className="h-4 w-4" />
                    Create AI Avatar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items?.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getItemTypeColor(item.type)}`}>
                          {getItemIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Legal Documents & Files</h2>
              <Button onClick={() => setShowUpload(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Document
              </Button>
            </div>
            
            <div className="grid gap-4">
              {items?.filter(item => item.type === 'document').map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getItemTypeColor(item.type)}`}>
                        {getItemIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            {item.description && (
                              <p className="text-muted-foreground mt-1">{item.description}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {item.encrypted ? (
                              <Lock className="h-3 w-3 mr-1" />
                            ) : null}
                            Secure
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span>Uploaded: {new Date(item.created_at).toLocaleDateString()}</span>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Share className="h-3 w-3" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Video & Audio Messages</h2>
              <Button onClick={() => setShowUpload(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Record Message
              </Button>
            </div>
            
            <div className="grid gap-4">
              {items?.filter(item => item.type === 'video' || item.type === 'audio').map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getItemTypeColor(item.type)}`}>
                        {getItemIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.description && (
                          <p className="text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span>Recorded: {new Date(item.created_at).toLocaleDateString()}</span>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="avatar" className="mt-6">
            <VaultAvatarSetup />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <VaultAuditLog vaultId="" logs={[]} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <VaultItemUpload
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            // Refresh items
          }}
        />
      )}

      {/* Avatar Setup Modal */}
      {showAvatarSetup && (
        <VaultAvatarSetup
          onClose={() => setShowAvatarSetup(false)}
          onSuccess={() => {
            setShowAvatarSetup(false);
          }}
        />
      )}
    </div>
  );
}