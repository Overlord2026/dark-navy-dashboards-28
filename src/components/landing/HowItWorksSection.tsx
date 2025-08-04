import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon, Eye, Zap, ArrowRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <LinkedinIcon className="w-8 h-8" />,
      title: "Sign in with LinkedIn",
      description: "Connect your LinkedIn account to automatically import your professional profile, experience, and credentials.",
      color: "text-blue-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Preview Your Profile",
      description: "Review and edit your imported information. Add specialties, set availability, and customize your professional showcase.",
      color: "text-emerald-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Go Live & Connect",
      description: "Publish your profile and start receiving inquiries from high-net-worth families seeking your expertise.",
      color: "text-amber-600"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our streamlined onboarding process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground/40" />
                </div>
              )}
              
              <Card className="h-full text-center border-muted/40 hover:border-primary/30 transition-colors duration-300">
                <CardContent className="p-8">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-6 ${step.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  <div className="relative mb-4">
                    <span className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-foreground pl-6">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;