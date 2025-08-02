import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Phone, MessageSquare, Target, CheckCircle } from 'lucide-react';
import { useLeadScoring, AutomatedFollowUp } from '@/hooks/useLeadScoring';

export function EngagementTracker() {
  const { 
    loading, 
    getPendingFollowUps, 
    markFollowUpSent 
  } = useLeadScoring();
  
  const [followUps, setFollowUps] = useState<AutomatedFollowUp[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent'>('pending');

  useEffect(() => {
    loadFollowUps();
  }, []);

  const loadFollowUps = async () => {
    try {
      const data = await getPendingFollowUps();
      setFollowUps(data);
    } catch (error) {
      console.error('Error loading follow-ups:', error);
    }
  };

  const handleMarkSent = async (followUpId: string) => {
    try {
      await markFollowUpSent(followUpId);
      loadFollowUps();
    } catch (error) {
      console.error('Error marking follow-up as sent:', error);
    }
  };

  const getFollowUpIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'call_reminder':
        return <Phone className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'pending': 'bg-yellow-500',
      'sent': 'bg-green-500',
      'failed': 'bg-red-500',
      'cancelled': 'bg-gray-500'
    };
    return variants[status] || 'bg-gray-500';
  };

  const isOverdue = (scheduledFor: string) => {
    return new Date(scheduledFor) < new Date();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const filteredFollowUps = followUps.filter(followUp => {
    if (filter === 'all') return true;
    return followUp.status === filter;
  });

  const pendingCount = followUps.filter(f => f.status === 'pending').length;
  const overdueCount = followUps.filter(f => f.status === 'pending' && isOverdue(f.scheduled_for)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6" />
            Engagement Tracker
          </h2>
          <p className="text-muted-foreground">Monitor and manage automated follow-ups</p>
        </div>
        <Button onClick={loadFollowUps} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-500">{overdueCount}</p>
              </div>
              <Target className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">
                  {followUps.filter(f => 
                    f.status === 'sent' && 
                    f.sent_at && 
                    new Date(f.sent_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">
                  {followUps.length > 0 
                    ? Math.round((followUps.filter(f => f.response_received).length / followUps.length) * 100)
                    : 0}%
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({followUps.length})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button 
          variant={filter === 'sent' ? 'default' : 'outline'}
          onClick={() => setFilter('sent')}
        >
          Sent ({followUps.filter(f => f.status === 'sent').length})
        </Button>
      </div>

      {/* Follow-ups List */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFollowUps.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Follow-ups</h3>
              <p className="text-muted-foreground">
                {filter === 'pending' 
                  ? 'No pending follow-ups scheduled' 
                  : 'No follow-ups match the current filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp) => (
                <div 
                  key={followUp.id} 
                  className={`border rounded-lg p-4 ${
                    followUp.status === 'pending' && isOverdue(followUp.scheduled_for) 
                      ? 'border-red-200 bg-red-50' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFollowUpIcon(followUp.follow_up_type)}
                      <div>
                        <h4 className="font-semibold">
                          {followUp.follow_up_type.charAt(0).toUpperCase() + 
                           followUp.follow_up_type.slice(1).replace('_', ' ')} Follow-up
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Stage: {followUp.stage.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusBadge(followUp.status)} text-white`}>
                        {followUp.status}
                      </Badge>
                      {followUp.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkSent(followUp.id)}
                          disabled={loading}
                        >
                          Mark as Sent
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Scheduled For:</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(followUp.scheduled_for)}
                        {followUp.status === 'pending' && isOverdue(followUp.scheduled_for) && (
                          <Badge variant="destructive" className="ml-2">Overdue</Badge>
                        )}
                      </p>
                    </div>
                    {followUp.sent_at && (
                      <div>
                        <p className="text-sm font-medium mb-1">Sent At:</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {formatDateTime(followUp.sent_at)}
                        </p>
                      </div>
                    )}
                  </div>

                  {followUp.content && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Message:</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        {followUp.content}
                      </div>
                    </div>
                  )}

                  {followUp.response_received && (
                    <div className="mt-3">
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Response Received
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}