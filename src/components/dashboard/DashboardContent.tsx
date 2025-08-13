import React from 'react';
import { AppCards } from '@/components/dashboard/AppCards';
import { AccountingOSCards } from '@/components/dashboard/AccountingOSCards';
import { TasksAndMessages } from '@/components/dashboard/TasksAndMessages';
import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary';
import { motion } from "framer-motion";

export const DashboardContent: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-6 px-4 py-2 max-w-5xl mx-auto">
        {/* Accounting OS Cards for CPAs */}
        <DashboardErrorBoundary componentName="Accounting OS Cards">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AccountingOSCards />
          </motion.div>
        </DashboardErrorBoundary>

        {/* App Cards Grid */}
        <DashboardErrorBoundary componentName="App Cards">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AppCards />
          </motion.div>
        </DashboardErrorBoundary>
      </div>

      {/* Right Rail - Tasks & Messages */}
      <DashboardErrorBoundary componentName="Tasks and Messages">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TasksAndMessages />
        </motion.div>
      </DashboardErrorBoundary>
    </div>
  );
};