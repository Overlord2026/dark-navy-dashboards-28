import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Calculator, 
  BookOpen, 
  BarChart, 
  PiggyBank, 
  ExternalLink,
  ArrowRight,
  Check,
  Building,
  UserSquare,
  Crown,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { TaxEducationCard } from "@/components/tax-planning/TaxEducationCard";
import { TaxFeedbackWidget } from "@/components/tax-planning/TaxFeedbackWidget";
import { TaxOptimizationRoadmap } from "@/components/tax-planning/TaxOptimizationRoadmap";
import { EnhancedResourceCenter } from "@/components/education/EnhancedResourceCenter";
import { useIsMobile } from "@/hooks/use-mobile";

// Import new tax planning calculators
import RothConversionAnalyzer from "@/components/tax-planning/RothConversionAnalyzer";
import { EnhancedTaxReturnAnalyzer } from "@/components/tax-planning/EnhancedTaxReturnAnalyzer";
import MultiYearTaxProjector from "@/components/tax-planning/MultiYearTaxProjector";
import WithdrawalSequencingSimulator from "@/components/tax-planning/WithdrawalSequencingSimulator";
import TaxBracketProjector from "@/components/tax-planning/TaxBracketProjector";
import { UnifiedTaxAnalyzer } from "@/components/tax-planning/UnifiedTaxAnalyzer";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { Celebration } from "@/components/ConfettiAnimation";

// Import existing components
import { TaxReadinessAssessment } from "@/components/tax-planning/TaxReadinessAssessment";
import { CPAMarketplace } from "@/components/tax-planning/CPAMarketplace";
import { TaxDocumentUpload } from "@/components/tax-planning/TaxDocumentUpload";

export default function TaxPlanning() {
  const isMobile = useIsMobile();
  
  // Mock subscription tier - in production this would come from user context
  const subscriptionTier = 'free' as const; // 'free', 'basic', 'premium'
  
  // Roadmap state - in production this would come from user progress tracking
  const [currentStage, setCurrentStage] = React.useState('assess');
  const [completedStages, setCompletedStages] = React.useState<string[]>([]);
  const [isFirstTime, setIsFirstTime] = React.useState(true);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleStageClick = (stageId: string) => {
    setCurrentStage(stageId);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // In production, this would navigate to the appropriate section or tool
    console.log('Navigating to stage:', stageId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ThreeColumnLayout 
      title="" 
      activeMainItem="education"
      activeSecondaryItem="tax-planning"
      secondaryMenuItems={[]}
    >
      <motion.div
        className={`space-y-6 ${isMobile ? 'px-2 pb-6' : 'px-1 pb-8'}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Introductory header + description */}
        <motion.div variants={itemVariants}>
          <h2 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-2xl'}`}>Tax Planning</h2>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm mt-1' : 'mt-2'}`}>
            Optimize your tax strategy and minimize your tax burden through proactive planning.
          </p>
        </motion.div>

        {/* Subscription Tier Overview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className={isMobile ? 'p-4 pb-3' : ''}>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Tax Planning Features by Subscription
              </CardTitle>
              <CardDescription>
                Unlock advanced tax planning tools with Basic and Premium subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Free</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Tax readiness assessment</li>
                    <li>• Basic tax bracket calculator</li>
                    <li>• Educational resources</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    Basic <Crown className="h-4 w-4 text-yellow-500" />
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Multi-year tax projections</li>
                    <li>• Document upload & analysis</li>
                    <li>• Withdrawal sequencing</li>
                    <li>• Roth conversion analyzer</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-300">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    Premium <Crown className="h-4 w-4 text-yellow-500" />
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• AI-powered tax analysis</li>
                    <li>• Multi-scenario planning</li>
                    <li>• CPA matching & integration</li>
                    <li>• Advanced optimization</li>
                  </ul>
                </div>
              </div>
              {subscriptionTier === 'free' && (
                <div className="mt-4 text-center">
                  <Button>Upgrade to Basic - $29/month</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tax Optimization Roadmap */}
        <motion.div variants={itemVariants}>
          <TaxOptimizationRoadmap 
            onStageClick={handleStageClick}
            completedStages={completedStages}
            currentStage={currentStage}
            isFirstTime={isFirstTime}
          />
        </motion.div>

        {/* Unified Tax Analyzer - Main Feature */}
        <motion.div variants={itemVariants}>
          <UnifiedTaxAnalyzer subscriptionTier={subscriptionTier} />
        </motion.div>

        {/* Roth Conversion Analyzer */}
        <motion.div variants={itemVariants}>
          <RothConversionAnalyzer subscriptionTier={subscriptionTier} />
        </motion.div>

        {/* Enhanced Tax Return Analyzer */}
        <motion.div variants={itemVariants}>
          <EnhancedTaxReturnAnalyzer />
        </motion.div>

        {/* Multi-Year Tax Projector */}
        <motion.div variants={itemVariants}>
          <MultiYearTaxProjector subscriptionTier={subscriptionTier} />
        </motion.div>

        {/* Withdrawal Sequencing Simulator */}
        <motion.div variants={itemVariants}>
          <WithdrawalSequencingSimulator subscriptionTier={subscriptionTier} />
        </motion.div>

        {/* Tax Bracket Projector */}
        <motion.div variants={itemVariants}>
          <TaxBracketProjector subscriptionTier={subscriptionTier} />
        </motion.div>

        {/* Tax Readiness Assessment */}
        <motion.div variants={itemVariants}>
          <TaxReadinessAssessment />
        </motion.div>

        {/* Tax Document Upload */}
        <motion.div variants={itemVariants}>
          <TaxDocumentUpload />
        </motion.div>

        {/* CPA Marketplace */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-3' : ''}>
              <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : ''}`}>
                <UserSquare className={`mr-2 text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Tax Planning Professionals
                {(subscriptionTier !== 'free' && subscriptionTier !== 'basic') ? <Crown className="h-4 w-4 text-yellow-500 ml-2" /> : null}
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Connect with certified tax professionals in our network
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
              <CPAMarketplace />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Enhanced Tax Education & Resources Section */}
        <motion.section 
          className="mt-12"
          variants={containerVariants}
        >
          <EnhancedResourceCenter 
            showCategories={['All', 'Tax', 'Retirement', 'Estate', 'Business']}
            maxItems={9}
            title="Tax Education & Resources"
            description="Discover expert guides, courses, and tools to optimize your tax strategy"
          />
        </motion.section>

        {/* Feedback Widget */}
        <motion.div variants={itemVariants} className="text-center">
          <FeedbackButton 
            page="Tax Planning" 
            className="mx-auto"
          />
        </motion.div>
      </motion.div>

      {/* Success Animation */}
      <Celebration trigger={showSuccess} />

      {/* AI Chat Widget - Persistent */}
      <AIChatWidget 
        userPersona="investor" 
        currentPage="tax-planning"
        contextData={{
          subscriptionTier,
          currentSection: 'tax-planning'
        }}
      />
    </ThreeColumnLayout>
  );
}