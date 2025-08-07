import React from 'react';
import { NetWorthSummary } from '@/components/dashboard/NetWorthSummary';
import { SubscriptionTierDisplay } from '@/components/dashboard/SubscriptionTierDisplay';
import { EducationalResources } from '@/components/EducationalResources';
import { SWAGRetirementRoadmap } from '@/components/retirement/SWAGRetirementRoadmap';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Calendar, Target } from 'lucide-react';
import { ReferralCard } from '@/components/referrals/ReferralCard';
import { ForTheGreaterGood } from '@/components/dashboard/ForTheGreaterGood';
import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary';
import { motion } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardContent: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Set Financial Goals',
      description: 'Define your financial objectives and track progress',
      icon: Target,
      action: () => navigate('/financial-plans'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Browse Expert Marketplace',
      description: 'Find vetted professionals for your needs',
      icon: Users,
      action: () => navigate('/marketplace'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Schedule a Call',
      description: 'Book time with our team',
      icon: Calendar,
      action: () => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Explore Learning Center',
      description: 'Access educational resources',
      icon: BookOpen,
      action: () => navigate('/resources'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6 px-4 py-2 max-w-7xl mx-auto">
      {/* Quick Actions Grid */}
      <DashboardErrorBoundary componentName="Quick Actions">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${action.color} p-6 rounded-lg text-white cursor-pointer hover:scale-105 transition-transform`}
                onClick={action.action}
              >
                <action.icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </DashboardErrorBoundary>
      
      {/* Subscription Tier Display */}
      <DashboardErrorBoundary componentName="Subscription Tier">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SubscriptionTierDisplay />
        </motion.div>
      </DashboardErrorBoundary>
      
      {/* SWAG™ Retirement Roadmap */}
      <DashboardErrorBoundary componentName="Retirement Roadmap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SWAGRetirementRoadmap className="mb-8" />
        </motion.div>
      </DashboardErrorBoundary>
      
      <DashboardErrorBoundary componentName="Net Worth Summary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NetWorthSummary />
        </motion.div>
      </DashboardErrorBoundary>

      {/* For the Greater Good Module */}
      <DashboardErrorBoundary componentName="For the Greater Good">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ForTheGreaterGood />
        </motion.div>
      </DashboardErrorBoundary>

      <DashboardErrorBoundary componentName="Educational Resources & Referrals">
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Educational Resources for Clients */}
          <div className="md:col-span-2 bg-card/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Your Expert Resource Library
                </h3>
                <p className="text-muted-foreground">
                  Complimentary guides and resources—always available to our clients
                </p>
              </div>
            </div>
            <EducationalResources />
          </div>

          {/* Referral Program */}
          <ReferralCard userRole={userProfile?.role || 'client'} />
        </motion.div>
      </DashboardErrorBoundary>

      {/* Support & Advisor Contact */}
      <DashboardErrorBoundary componentName="Support & Advisor Contact">
        <motion.div 
          className="grid md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule with Your Advisor
            </h4>
            <p className="text-muted-foreground mb-4">
              Need personalized guidance? Your dedicated advisor is here to help with your family's unique financial goals.
            </p>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
            >
              Schedule a Meeting with Your Advisor
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Concierge Support
            </h4>
            <p className="text-muted-foreground mb-4">
              Questions about your account, services, or need technical support? Our concierge team is ready to assist.
            </p>
            <Button variant="outline" className="w-full">
              Message Support/Concierge
            </Button>
          </div>
        </motion.div>
      </DashboardErrorBoundary>
    </div>
  );
};