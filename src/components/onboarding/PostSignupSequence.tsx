import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageCircle, Star, Share2, CheckCircle, Users } from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import ViralShareButton from '@/components/social/ViralShareButton';

interface PostSignupSequenceProps {
  onDismiss?: () => void;
}

const PostSignupSequence: React.FC<PostSignupSequenceProps> = ({ onDismiss }) => {
  const { daysSinceRegistration, isNewUser, currentPersona } = usePersona();
  const [activeMessage, setActiveMessage] = useState<number | null>(null);

  useEffect(() => {
    if (!isNewUser) return;

    // Determine which message to show based on days since registration
    if (daysSinceRegistration === 1) {
      setActiveMessage(1);
    } else if (daysSinceRegistration === 3) {
      setActiveMessage(3);
    } else if (daysSinceRegistration === 5) {
      setActiveMessage(5);
    } else if (daysSinceRegistration === 7) {
      setActiveMessage(7);
    }
  }, [daysSinceRegistration, isNewUser]);

  const handleDismiss = () => {
    setActiveMessage(null);
    onDismiss?.();
  };

  if (!activeMessage || !isNewUser) return null;

  const getMessageContent = () => {
    switch (activeMessage) {
      case 1:
        return {
          title: "🎉 Welcome to the Family Office Marketplace™!",
          content: "Your journey to connecting with top-tier wealth professionals starts now. Share your success and invite colleagues to join our exclusive network.",
          cta: "Share Your Success",
          component: (
            <ViralShareButton 
              variant="card"
              showDismiss={false}
              customMessage="Just joined the Family Office Marketplace™ - the exclusive network for wealth management professionals! Join me at: {landingPageUrl} #FamilyOfficeMarketplace #WealthManagement"
            />
          )
        };
      
      case 3:
        return {
          title: "Complete Your Professional Profile",
          content: "Stand out in our network by completing your profile. Import from LinkedIn or add your credentials manually to attract the right clients and opportunities.",
          cta: "Complete Profile",
          component: (
            <div className="space-y-3">
              <Button className="w-full bg-[#0077b5] hover:bg-[#0077b5]/90 text-white">
                Import from LinkedIn
              </Button>
              <Button variant="outline" className="w-full">
                Complete Manually
              </Button>
            </div>
          )
        };
      
      case 5:
        return {
          title: "Unlock Your Network's Potential",
          content: `As a ${currentPersona}, you have access to exclusive features designed for professionals like you. Connect with families seeking your expertise and collaborate with other top-tier professionals.`,
          cta: "Explore Features",
          component: (
            <div className="grid grid-cols-2 gap-3">
              <Button size="sm" className="gap-1">
                <MessageCircle className="w-4 h-4" />
                Connect
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <Star className="w-4 h-4" />
                Browse
              </Button>
            </div>
          )
        };
      
      case 7:
        return {
          title: "Join Our Community & Share Feedback",
          content: "You've been with us for a week! Join our professional community for exclusive insights, or share feedback to help us improve your experience.",
          cta: "Get Involved",
          component: (
            <div className="space-y-3">
              <Button className="w-full gap-2">
                <Users className="w-4 h-4" />
                Join Community
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="w-4 h-4" />
                Give Feedback
              </Button>
            </div>
          )
        };
      
      default:
        return null;
    }
  };

  const messageContent = getMessageContent();
  if (!messageContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-gold/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-gold" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-gold flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Day {activeMessage} Update
                </Badge>
                <h3 className="font-semibold">{messageContent.title}</h3>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            {messageContent.content}
          </p>

          {messageContent.component}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostSignupSequence;