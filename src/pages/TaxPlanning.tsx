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
import { useIsMobile } from "@/hooks/use-mobile";

// Import new tax planning calculators
import RothConversionAnalyzer from "@/components/tax-planning/RothConversionAnalyzer";
import { EnhancedTaxReturnAnalyzer } from "@/components/tax-planning/EnhancedTaxReturnAnalyzer";
import MultiYearTaxProjector from "@/components/tax-planning/MultiYearTaxProjector";
import WithdrawalSequencingSimulator from "@/components/tax-planning/WithdrawalSequencingSimulator";
import TaxBracketProjector from "@/components/tax-planning/TaxBracketProjector";
import { UnifiedTaxAnalyzer } from "@/components/tax-planning/UnifiedTaxAnalyzer";

// Import existing components
import { TaxReadinessAssessment } from "@/components/tax-planning/TaxReadinessAssessment";
import { CPAMarketplace } from "@/components/tax-planning/CPAMarketplace";
import { TaxDocumentUpload } from "@/components/tax-planning/TaxDocumentUpload";

export default function TaxPlanning() {
  const isMobile = useIsMobile();
  
  // Mock subscription tier - in production this would come from user context
  const subscriptionTier = 'free' as const; // 'free', 'basic', 'premium'

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
        
        {/* Educational Resources Section */}
        <motion.section 
          className="mt-12"
          variants={containerVariants}
        >
          <h2 className="text-2xl font-bold mb-6">Tax Education & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaxEducationCard
              title="Complete Guide to Roth Conversions"
              summary="Master the timing, strategies, and tax implications of Roth IRA conversions with real-world examples and case studies."
              coverImage="https://images.unsplash.com/photo-1581090464777-f3220bbe1e8b?w=500"
              tags={["Roth IRA", "Tax Strategy", "Retirement"]}
              roles={["Client", "Advisor"]}
              links={[
                { type: 'guide', label: 'View Complete Guide', url: '/guides/roth-conversions' },
                { type: 'vimeo', label: 'Watch Video Course', url: 'https://vimeo.com/roth-course' },
                { type: 'amazon', label: 'Buy Book: Roth Revolution', url: 'https://amazon.com/roth-book' }
              ]}
              featured
            />
            
            <TaxEducationCard
              title="Tax Bracket Optimization Strategies"
              summary="Learn advanced techniques for managing your tax brackets across multiple years and income sources."
              coverImage="https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=500"
              tags={["Tax Brackets", "Planning", "Strategy"]}
              roles={["Client", "Advisor", "CPA"]}
              links={[
                { type: 'pdf', label: 'Download Tax Guide', url: '/pdfs/tax-bracket-guide.pdf' },
                { type: 'vimeo', label: 'Watch Webinar', url: 'https://vimeo.com/tax-brackets' }
              ]}
            />
            
            <TaxEducationCard
              title="SECURE Act 2.0 Compliance"
              summary="Navigate the latest changes in retirement account rules, RMD ages, and distribution requirements."
              coverImage="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500"
              tags={["SECURE Act", "RMD", "Compliance"]}
              roles={["Advisor", "CPA", "Attorney"]}
              links={[
                { type: 'guide', label: 'View Compliance Guide', url: '/guides/secure-act' },
                { type: 'pdf', label: 'Download Checklist', url: '/pdfs/secure-act-checklist.pdf' },
                { type: 'amazon', label: 'Book: Retirement Rules', url: 'https://amazon.com/secure-act-book' }
              ]}
            />
          </div>
        </motion.section>

        {/* Feedback Widget */}
        <motion.div variants={itemVariants}>
          <TaxFeedbackWidget />
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}