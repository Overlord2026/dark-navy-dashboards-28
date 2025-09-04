import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PersonalizedDashboardTransition } from '@/components/welcome/PersonalizedDashboardTransition';

export function WelcomeTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName = 'there', isNewUser = false } = location.state || {};

  useEffect(() => {
    // If no state is passed, redirect to home
    if (!location.state) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const handleGoalSetup = () => {
    navigate('/goals');
  };

  const handleAccountLink = () => {
    navigate('/dashboard/accounts');
  };

  return (
    <PersonalizedDashboardTransition
      userName={userName}
      onGoalSetup={handleGoalSetup}
      onAccountLink={handleAccountLink}
    />
  );
}