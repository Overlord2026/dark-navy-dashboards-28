
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { motion } from "framer-motion";
import { SecureTaxReturnAnalysis } from "@/components/estate-planning/SecureTaxReturnAnalysis";
import { AccountingSoftwareIntegration } from "@/components/tax-planning/AccountingSoftwareIntegration";
import { TaxProfessionals } from "@/components/tax-planning/TaxProfessionals";
import { AdditionalTaxServices } from "@/components/tax-planning/AdditionalTaxServices";

export default function TaxPlanning() {
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
      title="Tax Planning" 
      activeMainItem="education"
      secondaryMenuItems={[]}
    >
      <motion.div
        className="space-y-8 px-1 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <SecureTaxReturnAnalysis />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AccountingSoftwareIntegration />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TaxProfessionals />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AdditionalTaxServices />
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
