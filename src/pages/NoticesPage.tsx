import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Search, Filter, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NoticesPage() {
  const { notifications, unreadCount, loading, markAllAsRead } = useSystemNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadNotifications = filteredNotifications.filter(n => !n.is_read);
  const readNotifications = filteredNotifications.filter(n => n.is_read);
  const acknowledgedNotifications = filteredNotifications.filter(n => n.acknowledged_at);

  const getStatsCards = () => [
    {
      title: 'Total Notifications',
      value: notifications.length,
      icon: <Bell className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Unread',
      value: unreadCount,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-orange-600'
    },
    {
      title: 'Acknowledged',
      value: acknowledgedNotifications.length,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'High Priority',
      value: notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-red-600'
    }
  ];

  return (
    <ThreeColumnLayout title="System Notices & Alerts">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Notifications Center</h2>
            <p className="text-muted-foreground text-sm">
              Stay updated with system alerts, compliance notices, and important announcements.
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} className="self-start">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {getStatsCards().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="regulatory">Regulatory</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="ml-1">
                {filteredNotifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadNotifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="flex items-center gap-2">
              Read
              <Badge variant="outline" className="ml-1">
                {readNotifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="acknowledged" className="flex items-center gap-2">
              Acknowledged
              <Badge variant="outline" className="ml-1">
                {acknowledgedNotifications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">Loading notifications...</div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No notifications found matching your criteria.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="space-y-4 mt-6">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No unread notifications.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="read" className="space-y-4 mt-6">
            {readNotifications.length > 0 ? (
              readNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No read notifications.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="acknowledged" className="space-y-4 mt-6">
            {acknowledgedNotifications.length > 0 ? (
              acknowledgedNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No acknowledged notifications.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}