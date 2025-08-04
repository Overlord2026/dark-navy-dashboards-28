import React from 'react';
import { motion } from 'framer-motion';

const TrustedPartners: React.FC = () => {
  const partners = [
    { name: 'Dimensional', logo: 'DFA' },
    { name: 'BlackRock', logo: 'BR' },
    { name: 'Charles Schwab', logo: 'CS' },
    { name: 'DFA', logo: 'DFA' },
    { name: 'Vanguard', logo: 'VG' },
    { name: 'Fidelity', logo: 'FID' },
  ];

  return (
    <div className="py-12 border-y border-border/30">
      <div className="text-center mb-8">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trusted by Top Investment Partners
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-center w-20 h-12 bg-muted/50 rounded-lg border border-border/20"
          >
            <span className="text-xs font-bold text-muted-foreground">
              {partner.logo}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrustedPartners;