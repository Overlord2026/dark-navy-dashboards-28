
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
        return "Welcome, Ultra-High Net Worth Member!";
      case 'advisor':
        return "Welcome, Advisor!";
      default:
        return "Welcome!";
    }
  };
  
  const getIntroBySegment = () => {
    switch (segment) {
      case 'aspiring':
        return "You're on the fast track to building your foundation—let's get started!";
      case 'preretirees':
        return "Secure your lifestyle and enjoy the peace of mind you've earned.";
      case 'ultrahnw':
        return "Access exclusive strategies tailored for your significant wealth and legacy goals.";
      case 'advisor':
        return "Empower your clients with our premium wealth management tools and resources.";
      default:
        return "Track your progress, discover strategies, and accelerate your path to financial independence.";
    }
  };
  
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white mb-1">
        {getGreetingBySegment()}
      </h1>
      <p className="text-gray-200 text-sm md:text-base">
        {getIntroBySegment()}
      </p>
    </div>
  );
};
