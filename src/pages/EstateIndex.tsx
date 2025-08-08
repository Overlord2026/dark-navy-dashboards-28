import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { EstateHero } from '@/modules/estate/components/EstateHero';
import { EstateIntakeWizard } from '@/modules/estate/components/EstateIntakeWizard';
import { useEstateRequests } from '@/modules/estate/hooks/useEstateRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Users, CheckCircle2 } from 'lucide-react';

export default function EstateIndex() {
  const navigate = useNavigate();
  const [showIntake, setShowIntake] = useState(false);
  const [userRole] = useState('client'); // This would come from auth context
  const { requests, createRequest } = useEstateRequests();

  const handleStartPlan = () => {
    setShowIntake(true);
  };

  const handleCreateForClient = () => {
    // This would open a client selector dialog for advisors/attorneys
    setShowIntake(true);
  };

  const handleIntakeComplete = async (intakeData: any) => {
    try {
      const newRequest = await createRequest({
        state_code: intakeData.stateOfResidence,
        matter_type: 'package_basic',
        intake: intakeData
      });
      
      if (newRequest) {
        navigate(`/estate/review/${newRequest.id}`);
      }
    } catch (error) {
      console.error('Failed to create estate request:', error);
    }
  };

  const handleSaveAndContinue = async (intakeData: any) => {
    // Save draft and allow user to continue later
    console.log('Saving draft:', intakeData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'review':
      case 'signing':
      case 'notarizing':
      case 'witnessing':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'filing':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      intake: 'Intake',
      drafting: 'Drafting',
      review: 'Attorney Review',
      signing: 'Signing',
      notarizing: 'Notarization',
      witnessing: 'Witnesses',
      filing: 'State Filing',
      complete: 'Complete',
      on_hold: 'On Hold'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (showIntake) {
    return (
      <ThreeColumnLayout activeMainItem="estate-planning" title="Estate Planning Intake">
        <EstateIntakeWizard
          onComplete={handleIntakeComplete}
          onSaveAndContinue={handleSaveAndContinue}
        />
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="estate-planning" title="Estate Planning">
      <div className="space-y-8">
        <EstateHero
          onStartPlan={handleStartPlan}
          onCreateForClient={handleCreateForClient}
          userRole={userRole}
        />

        {/* Existing Requests */}
        {requests.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Estate Planning Requests</h2>
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.matter_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Plan
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {request.state_code} • Created {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <Badge variant={request.status === 'complete' ? 'default' : 'secondary'}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Priority: {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/estate/review/${request.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
}
