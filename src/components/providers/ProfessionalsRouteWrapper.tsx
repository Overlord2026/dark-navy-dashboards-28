
import React from "react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";

interface ProfessionalsRouteWrapperProps {
  children: React.ReactNode;
}

/**
 * A component that wraps its children with the ProfessionalsProvider.
 * Use this for routes that need access to professionals data.
 */
export const ProfessionalsRouteWrapper = ({ children }: ProfessionalsRouteWrapperProps) => {
  return <ProfessionalsProvider>{children}</ProfessionalsProvider>;
};
