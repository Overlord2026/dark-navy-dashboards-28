
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirect to dashboard with preretirees segment as default
  return <Navigate to="/dashboard?segment=preretirees" replace />;
};

export default Index;
