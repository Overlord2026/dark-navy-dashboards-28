import React from 'react';
import { motion } from 'framer-motion';
import FAQSection from '@/components/faq/FAQSection';

const FAQPage: React.FC = () => {
  const handleContactSupport = () => {
    // Open support email or chat
    window.open('mailto:support@familyofficemarketplace.com?subject=Support Request from FAQ', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FAQSection 
            showSearch={true}
            onContactSupport={handleContactSupport}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;