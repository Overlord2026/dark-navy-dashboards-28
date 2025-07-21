import React from "react";
import { TeamRoster } from "./TeamRoster";

interface TeamDashboardProps {
  onAddProfessional: () => void;
  onViewMarketplace: () => void;
}

export function TeamDashboard({ onAddProfessional, onViewMarketplace }: TeamDashboardProps) {
  return (
    <TeamRoster 
      onAddProfessional={onAddProfessional}
      onViewMarketplace={onViewMarketplace}
    />
  );
}