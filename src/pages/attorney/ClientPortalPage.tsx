import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Bell, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { ClientInviteDialog } from '@/components/attorney/ClientInviteDialog';
import { ClientList } from '@/components/attorney/ClientList';
import { ClientMessaging } from '@/components/attorney/ClientMessaging';
import { SharedDocumentsList } from '@/components/attorney/SharedDocumentsList';
import { ClientPortalNotifications } from '@/components/attorney/ClientPortalNotifications';
import { useClientPortalDashboard } from '@/hooks/useClientPortalDashboard';

export function ClientPortalPage() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { metrics, loading, refetch } = useClientPortalDashboard();

  const dashboardStats = [
    {
      title: "Active Clients",
      value: metrics?.active_clients || 0,
      description: "Connected clients",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Unread Messages",
      value: metrics?.unread_messages || 0,
      description: "Messages awaiting response",
      icon: MessageSquare,
      color: "text-amber-600"
    },
    {
      title: "Documents Shared Today",
      value: metrics?.documents_shared_today || 0,
      description: "Documents shared with clients",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Pending Invitations",
      value: metrics?.pending_invitations || 0,
      description: "Awaiting client acceptance",
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Portal</h1>
          <p className="text-muted-foreground">
            Manage client relationships, secure communications, and document sharing
          </p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Client
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {metrics?.unread_messages > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {metrics.unread_messages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                View and manage your client relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientList onRefresh={refetch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Secure Messaging</CardTitle>
              <CardDescription>
                Exchange secure messages with your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientMessaging />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Documents</CardTitle>
              <CardDescription>
                Manage documents shared with clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SharedDocumentsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portal Notifications</CardTitle>
              <CardDescription>
                Stay updated on client portal activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientPortalNotifications />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <ClientInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={() => {
          setShowInviteDialog(false);
          refetch();
        }}
      />
    </div>
  );
}

export default ClientPortalPage;