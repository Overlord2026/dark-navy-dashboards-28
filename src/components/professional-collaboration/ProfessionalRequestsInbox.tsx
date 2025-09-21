import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProfessionalCollaboration } from '@/hooks/useProfessionalCollaboration';
import { 
  Inbox, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  MessageSquare,
  FileText,
  User,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export const ProfessionalRequestsInbox: React.FC = () => {
  const { 
    requests, 
    loading, 
    getRequestsByStatus,
    respondToRequest
  } = useProfessionalCollaboration();
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseAction, setResponseAction] = useState<'accepted' | 'declined' | 'in_progress' | 'completed'>('accepted');

  const pendingRequests = getRequestsByStatus('pending');
  const acceptedRequests = getRequestsByStatus('accepted').concat(getRequestsByStatus('in_progress'));
  const completedRequests = getRequestsByStatus('completed');

  const handleResponseSubmit = async () => {
    if (!selectedRequest) return;
    
    try {
      await respondToRequest(selectedRequest.id, responseAction, responseNotes);
      setShowResponseDialog(false);
      setSelectedRequest(null);
      setResponseNotes('');
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const openResponseDialog = (request: any, action: typeof responseAction) => {
    setSelectedRequest(request);
    setResponseAction(action);
    setShowResponseDialog(true);
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'swag_analysis_review':
        return 'SWAG™ Retirement Analysis Review';
      case 'estate_review':
        return 'Estate Plan Review';
      case 'tax_planning':
        return 'Tax Planning Review';
      case 'insurance_review':
        return 'Insurance Coverage Review';
      default:
        return type;
    }
  };

  const getFamilyIcon = (requestType: string) => {
    switch (requestType) {
      case 'swag_analysis_review':
        return '📊';
      case 'estate_review':
        return '📜';
      case 'tax_planning':
        return '💰';
      case 'insurance_review':
        return '🛡️';
      default:
        return '👨‍👩‍👧‍👦';
    }
  };

  const renderRequestCard = (request: any) => (
    <Card key={request.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getFamilyIcon(request.request_type)}</div>
            <div>
              <CardTitle className="text-lg">{getRequestTypeLabel(request.request_type)}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <User className="h-3 w-3" />
                <span>Family Request</span>
                <span>•</span>
                <span>{new Date(request.created_at).toLocaleDateString()}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={request.priority === 'high' ? 'destructive' : 'secondary'}>
              {request.priority} priority
            </Badge>
            {request.due_date && (
              <Badge variant="outline">
                Due {new Date(request.due_date).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {request.message && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Family Message:</p>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
              {request.message}
            </p>
          </div>
        )}

        {request.tool_data && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Shared Analysis Data:</p>
            <div className="bg-primary/5 rounded p-2">
              <p className="text-xs text-muted-foreground">
                {request.tool_data.tool_type === 'swag_retirement_roadmap' && 'Retirement roadmap analysis with projections'}
                {request.tool_data.tool_type === 'swag_legacy_planning' && 'Estate planning analysis with asset inventory'}
              </p>
            </div>
          </div>
        )}

        {request.professional_notes && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Your Notes:</p>
            <p className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 rounded p-2">
              {request.professional_notes}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {request.status === 'pending' && (
              <>
                <Button 
                  size="sm"
                  onClick={() => openResponseDialog(request, 'accepted')}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => openResponseDialog(request, 'declined')}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </>
            )}
            
            {request.status === 'accepted' && (
              <Button 
                size="sm"
                onClick={() => openResponseDialog(request, 'in_progress')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Start Working
              </Button>
            )}
            
            {request.status === 'in_progress' && (
              <Button 
                size="sm"
                onClick={() => openResponseDialog(request, 'completed')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {new Date(request.updated_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Professional Requests Inbox</h2>
          <p className="text-muted-foreground">
            Manage collaboration requests from families and other professionals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{pendingRequests.length} Pending</Badge>
          <Badge variant="outline">{acceptedRequests.length} Active</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Inbox className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{acceptedRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedRequests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({acceptedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  New family collaboration requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map(renderRequestCard)
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {acceptedRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                <p className="text-muted-foreground">
                  Accepted collaboration requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            acceptedRequests.map(renderRequestCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Requests</h3>
                <p className="text-muted-foreground">
                  Completed collaboration requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            completedRequests.map(renderRequestCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {responseAction === 'accepted' && 'Accept Collaboration Request'}
              {responseAction === 'declined' && 'Decline Collaboration Request'}  
              {responseAction === 'in_progress' && 'Start Working on Request'}
              {responseAction === 'completed' && 'Mark Request as Complete'}
            </DialogTitle>
            <DialogDescription>
              {responseAction === 'accepted' && 'Accept this family collaboration request and begin working together.'}
              {responseAction === 'declined' && 'Politely decline this collaboration request.'}
              {responseAction === 'in_progress' && 'Mark this request as actively being worked on.'}
              {responseAction === 'completed' && 'Complete this collaboration request and provide final notes.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {responseAction === 'declined' ? 'Reason (Optional)' : 'Professional Notes (Optional)'}
              </label>
              <Textarea
                placeholder={
                  responseAction === 'accepted' ? "I'm excited to work with your family on this project..." :
                  responseAction === 'declined' ? "I appreciate the opportunity, however..." :
                  responseAction === 'in_progress' ? "I'm now actively working on your request..." :
                  "I've completed your review. Here are my recommendations..."
                }
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleResponseSubmit} disabled={loading}>
                {responseAction === 'accepted' && 'Accept Request'}
                {responseAction === 'declined' && 'Decline Request'}
                {responseAction === 'in_progress' && 'Start Working'}  
                {responseAction === 'completed' && 'Mark Complete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};