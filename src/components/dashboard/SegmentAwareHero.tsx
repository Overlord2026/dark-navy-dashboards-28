
import React from "react";
import { useLocation } from "react-router-dom";

export const SegmentAwareHero: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const segment = queryParams.get('segment');
  
  const getGreetingBySegment = () => {
    switch (segment) {
      case 'aspiring':
        return "Welcome, Aspiring Wealthy!";
      case 'preretirees':
        return "Welcome, Pre-Retiree & Retiree!";
      case 'ultrahnw':
        return "Welcome, Ultra-High Net Worth!";
      case 'advisor':
        return "Welcome, Advisor!";
      default:
        return "Welcome!";
    }
  };
  
  return (
    <h1 className="text-2xl font-bold text-center text-white mb-4">
      {getGreetingBySegment()}
    </h1>
  );
};
