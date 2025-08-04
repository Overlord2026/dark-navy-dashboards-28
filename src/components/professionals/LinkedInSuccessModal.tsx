import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Shield, Sparkles, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViralShareButton from '@/components/social/ViralShareButton';

interface LinkedInSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const LinkedInSuccessModal: React.FC<LinkedInSuccessModalProps> = ({ 
  isOpen, 
  onClose,
  userName = "Professional"
}) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onClose();
    navigate('/professional-dashboard');
  };

  const handleEditProfile = () => {
    onClose();
    navigate('/profile');
  };

  const benefits = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "A personalized dashboard"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Premium resources tailored to your expertise"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Direct connections with top families and professionals"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Advanced privacy controls"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold mb-2"
          >
            🎉 Welcome to the Family Office Marketplace™!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Your LinkedIn profile has been imported.
          </motion.p>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-3">You now have access to:</p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="text-primary">{benefit.icon}</div>
                  <span className="text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGoToDashboard}
              className="flex-1"
            >
              Go to My Dashboard
            </Button>
            <Button 
              onClick={handleEditProfile}
              variant="outline"
              className="flex-1"
            >
              Edit My Profile
            </Button>
          </div>

          {/* Viral Share Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-4 border-t"
          >
            <ViralShareButton 
              variant="inline"
              userName={userName}
              customMessage={`Just joined the Family Office Marketplace™! Import your LinkedIn profile and connect with top professionals: ${window.location.origin}/join-pros #FamilyOfficeMarketplace #WealthManagement #ProfessionalNetworking`}
            />
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedInSuccessModal;