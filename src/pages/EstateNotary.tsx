import React from 'react';
import { useParams } from 'react-router-dom';
import { EstateProgressTracker } from '@/modules/estate/components/EstateProgressTracker';
import { NotaryScheduler } from '@/modules/estate/components/NotaryScheduler';
import { WitnessInvite } from '@/modules/estate/components/WitnessInvite';
import { StateComplianceCallout } from '@/modules/estate/components/StateComplianceCallout';
import { useEstateRequests } from '@/modules/estate/hooks/useEstateRequests';

const EstateNotary = () => {
  const { id } = useParams<{ id: string }>();
  const { requests } = useEstateRequests();
  
  const request = requests.find(r => r.id === id);

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
              <h1 className="text-3xl font-bold mb-2">Notary & Witness Coordination</h1>
              <p className="text-muted-foreground">
                Schedule your notary session and coordinate with witnesses for document execution.
              </p>
            </div>

            <StateComplianceCallout stateCode={request.state_code} />

            <NotaryScheduler 
              requestId={request.id}
              stateCode={request.state_code}
            />

            <WitnessInvite 
              requestId={request.id}
              stateCode={request.state_code}
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

export default EstateNotary;