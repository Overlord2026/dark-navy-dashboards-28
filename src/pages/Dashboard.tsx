
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { SubscriptionTierDisplay } from "@/components/dashboard/SubscriptionTierDisplay";
import { EducationalResources } from "@/components/EducationalResources";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { SWAGRetirementRoadmap } from "@/components/retirement/SWAGRetirementRoadmap";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar } from "lucide-react";
import { ReferralCard } from "@/components/referrals/ReferralCard";
import { PageTransition, StaggerContainer } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  usePagePerformance('/client-dashboard');
  
  console.log('Dashboard: AdminActions component completely removed');

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  useEffect(() => {
    console.log('Dashboard component rendered:', new Date().toISOString());
    console.log('Dashboard: NO AdminActions component rendered');
    
    return () => {
      console.log('Dashboard component unmounted:', new Date().toISOString());
    };
  }, []);

  return (
    <ThreeColumnLayout>
      <PageTransition>
        <StaggerContainer className="space-y-6 px-4 py-2 max-w-7xl mx-auto">
          {isInFreeTrial && showWelcomeBanner && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <WelcomeTrialBanner onDismiss={handleDismissBanner} />
            </motion.div>
          )}
          
          {/* Subscription Tier Display */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <SubscriptionTierDisplay />
          </motion.div>
          
          {/* SWAG™ Retirement Roadmap */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <SWAGRetirementRoadmap className="mb-8" />
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <NetWorthSummary />
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
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

          {/* Support & Advisor Contact */}
          <motion.div 
            className="grid md:grid-cols-2 gap-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
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
        </StaggerContainer>
      </PageTransition>
    </ThreeColumnLayout>
  );
}
