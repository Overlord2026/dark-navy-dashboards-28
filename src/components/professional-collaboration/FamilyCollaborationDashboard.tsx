import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useProfessionalCollaboration } from '@/hooks/useProfessionalCollaboration';
import { ProfessionalRequestModal } from './ProfessionalRequestModal';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  Calendar,
  Plus,
  Eye,
  Star
} from 'lucide-react';

export const FamilyCollaborationDashboard: React.FC = () => {
  const { 
    requests, 
    loading, 
    getRequestsByStatus, 
    updateFamilyFeedback 
  } = useProfessionalCollaboration();
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [feedbackRequestId, setFeedbackRequestId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const pendingRequests = getRequestsByStatus('pending');
  const activeRequests = getRequestsByStatus('accepted').concat(getRequestsByStatus('in_progress'));
  const completedRequests = getRequestsByStatus('completed');

  const handleFeedbackSubmit = async (requestId: string) => {
    try {
      await updateFamilyFeedback(requestId, feedbackText);
      setFeedbackRequestId(null);
      setFeedbackText('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'accepted':
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProfessionalIcon = (type: string) => {
    switch (type) {
      case 'advisor':
        return '💼';
      case 'attorney':
        return '⚖️';
      case 'accountant':
        return '📊';
      case 'insurance_agent':
        return '🛡️';
      default:
        return '👤';
    }
  };

  const formatRequestType = (type: string) => {
    switch (type) {
      case 'swag_analysis_review':
        return 'SWAG™ Analysis Review';
      case 'estate_review':
        return 'Estate Plan Review';
      case 'tax_planning':
        return 'Tax Planning Review';
      case 'insurance_review':
        return 'Insurance Review';
      default:
        return type;
    }
  };

  const renderRequestCard = (request: any) => (
    <Card key={request.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getProfessionalIcon(request.professional_type)}</div>
            <div>
              <CardTitle className="text-lg">{formatRequestType(request.request_type)}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                {getStatusIcon(request.status)}
                <span className="capitalize">{request.status.replace('_', ' ')}</span>
                <span>•</span>
                <span>{new Date(request.created_at).toLocaleDateString()}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={request.priority === 'high' ? 'destructive' : 'secondary'}>
              {request.priority} priority
            </Badge>
            <Badge variant="outline">
              {request.professional_type.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {request.message && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Your Message:</p>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
              {request.message}
            </p>
          </div>
        )}
        
        {request.professional_notes && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Professional Notes:</p>
            <p className="text-sm text-muted-foreground bg-primary/5 rounded p-2">
              {request.professional_notes}
            </p>
          </div>
        )}

        {request.due_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(request.due_date).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {request.tool_data && (
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Shared Data
              </Button>
            )}
            {request.status === 'completed' && !request.family_feedback && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFeedbackRequestId(request.id)}
              >
                <Star className="h-4 w-4 mr-2" />
                Leave Feedback
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {new Date(request.updated_at).toLocaleDateString()}
          </div>
        </div>

        {/* Feedback Form */}
        {feedbackRequestId === request.id && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/20">
            <p className="text-sm font-medium mb-2">Share your feedback:</p>
            <Textarea
              placeholder="How was the professional service? Any comments or suggestions?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleFeedbackSubmit(request.id)}
                disabled={!feedbackText.trim()}
              >
                Submit Feedback
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setFeedbackRequestId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {request.family_feedback && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
              Your Feedback:
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {request.family_feedback}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Professional Collaboration</h2>
          <p className="text-muted-foreground">
            Connect with trusted professionals for expert reviews and guidance
          </p>
        </div>
        <Button onClick={() => setShowRequestModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Professional Review
        </Button>
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
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeRequests.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
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
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active ({activeRequests.length + pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
          <TabsTrigger value="all">All Requests ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {pendingRequests.concat(activeRequests).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Requests</h3>
                <p className="text-muted-foreground mb-4">
                  Request professional reviews to get expert guidance on your financial planning
                </p>
                <Button onClick={() => setShowRequestModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Professional Review
                </Button>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.concat(activeRequests).map(renderRequestCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Requests</h3>
                <p className="text-muted-foreground">
                  Completed professional reviews will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            completedRequests.map(renderRequestCard)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {requests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start collaborating with professionals to enhance your financial planning
                </p>
                <Button onClick={() => setShowRequestModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Professional Review
                </Button>
              </CardContent>
            </Card>
          ) : (
            requests.map(renderRequestCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Request Modal */}
      <ProfessionalRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
};