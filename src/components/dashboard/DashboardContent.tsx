import React from 'react';
import { AppCards } from '@/components/dashboard/AppCards';
import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary';
import { motion } from "framer-motion";

export const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6 px-4 py-2 max-w-7xl mx-auto">
      {/* App Cards Grid */}
      <DashboardErrorBoundary componentName="App Cards">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AppCards />
        </motion.div>
      </DashboardErrorBoundary>
    </div>
  );
};