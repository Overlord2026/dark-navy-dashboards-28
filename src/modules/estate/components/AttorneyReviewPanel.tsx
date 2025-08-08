import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, MessageSquare, AlertCircle, FileText, User } from 'lucide-react';
import { EstateRequest } from '../hooks/useEstateRequests';

interface AttorneyReviewPanelProps {
  request: EstateRequest;
  onApprove: (comments?: string) => void;
  onRequestChanges: (comments: string) => void;
  className?: string;
}

export const AttorneyReviewPanel: React.FC<AttorneyReviewPanelProps> = ({
  request,
  onApprove,
  onRequestChanges,
  className = ''
}) => {
  const [comments, setComments] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleApprove = () => {
    onApprove(comments);
    setComments('');
  };

  const handleRequestChanges = () => {
    if (!comments.trim()) return;
    onRequestChanges(comments);
    setComments('');
    setIsRequesting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'review':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'changes_requested':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Attorney Review
          </CardTitle>
          <Badge variant={getStatusColor(request.status) as any}>
            {request.status === 'review' ? 'Pending Review' : 
             request.status === 'approved' ? 'Approved' :
             request.status === 'changes_requested' ? 'Changes Requested' :
             request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client Information */}
        <div className="space-y-3">
          <h4 className="font-medium">Client Information</h4>
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Matter Type:</span>
                <span className="ml-2 font-medium">{request.matter_type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">State:</span>
                <span className="ml-2 font-medium">{request.state_code}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <span className="ml-2 font-medium">{request.priority}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 font-medium">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-3">
          <h4 className="font-medium">Documents for Review</h4>
          <div className="space-y-2">
            {request.docs && request.docs.length > 0 ? (
              request.docs.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.name || `Document ${index + 1}`}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-3 border border-dashed rounded-lg text-center text-muted-foreground">
                Documents will appear here once generated
              </div>
            )}
          </div>
        </div>

        {/* Review Actions */}
        {request.status === 'review' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Review Comments {isRequesting && <span className="text-destructive">*</span>}
              </label>
              <Textarea
                placeholder={isRequesting ? 
                  "Please specify what changes are needed..." : 
                  "Add any comments for the client (optional)..."
                }
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-3">
              {!isRequesting ? (
                <>
                  <Button 
                    onClick={handleApprove}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve for Signing
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRequesting(true)}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Request Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleRequestChanges}
                    disabled={!comments.trim()}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Change Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsRequesting(false);
                      setComments('');
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Previous Comments */}
        {request.status !== 'review' && (
          <div className="space-y-3">
            <h4 className="font-medium">Review History</h4>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">Attorney Review</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.status === 'approved' ? 
                      'Documents approved and ready for signing' :
                      'Changes requested - awaiting revision'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};