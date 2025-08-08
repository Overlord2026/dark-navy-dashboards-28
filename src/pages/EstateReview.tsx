import React from 'react';
import { useParams } from 'react-router-dom';
import { EstateProgressTracker } from '@/modules/estate/components/EstateProgressTracker';
import { AttorneyReviewPanel } from '@/modules/estate/components/AttorneyReviewPanel';
import { DocumentPackPreview } from '@/modules/estate/components/DocumentPackPreview';
import { useEstateRequests } from '@/modules/estate/hooks/useEstateRequests';

const EstateReview = () => {
  const { id } = useParams<{ id: string }>();
  const { requests, updateRequest } = useEstateRequests();
  
  const request = requests.find(r => r.id === id);

  const handleApprove = async (comments?: string) => {
    if (!request) return;
    
    await updateRequest(request.id, {
      status: 'signing',
      compliance: {
        ...request.compliance,
        attorney_approved: true,
        attorney_comments: comments,
        approved_at: new Date().toISOString()
      }
    });
  };

  const handleRequestChanges = async (comments: string) => {
    if (!request) return;
    
    await updateRequest(request.id, {
      status: 'changes_requested',
      compliance: {
        ...request.compliance,
        changes_requested: true,
        attorney_comments: comments,
        requested_at: new Date().toISOString()
      }
    });
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Estate Request Not Found</h1>
            <p className="text-muted-foreground">
              The estate planning request you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Estate Plan Review</h1>
              <p className="text-muted-foreground">
                Review and approve the estate planning documents for signing.
              </p>
            </div>

            <DocumentPackPreview 
              matterType={request.matter_type}
              stateCode={request.state_code}
            />

            <AttorneyReviewPanel
              request={request}
              onApprove={handleApprove}
              onRequestChanges={handleRequestChanges}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EstateProgressTracker
              currentStatus={request.status}
              stateCode={request.state_code}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateReview;