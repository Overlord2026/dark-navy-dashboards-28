import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleSpecificOnboarding } from '@/components/professionals/RoleSpecificOnboarding';
import { useUser } from '@/context/UserContext';

export default function RoleBasedOnboardingPage() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { userProfile } = useUser();

  const handleComplete = () => {
    // Navigate to appropriate dashboard based on role
    switch (role) {
      case 'advisor':
        navigate('/advisor-dashboard');
        break;
      case 'attorney':
        navigate('/attorney-dashboard');
        break;
      case 'accountant':
        navigate('/accountant-dashboard');
        break;
      case 'consultant':
        navigate('/consultant-dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  if (!role || !['advisor', 'attorney', 'accountant', 'consultant'].includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Role</h1>
          <p className="text-muted-foreground mb-4">
            The specified professional role is not recognized.
          </p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="text-primary hover:underline"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoleSpecificOnboarding 
      role={role} 
      onComplete={handleComplete}
    />
  );
}