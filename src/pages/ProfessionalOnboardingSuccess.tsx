import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Share2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ColleagueInviteModal from '@/components/professionals/ColleagueInviteModal';
import CelebrationEffects from '@/components/effects/CelebrationEffects';

export default function ProfessionalOnboardingSuccess() {
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(true); // Show modal by default
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-bfo-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">Welcome to the Marketplace!</CardTitle>
            <p className="text-lg text-muted-foreground">
              Your professional profile is now live and discoverable by high-net-worth families.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Profile Live</h3>
                <p className="text-sm text-muted-foreground">Your profile is now searchable</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Badge className="mb-2 bg-blue-600">Featured</Badge>
                <h3 className="font-semibold">Featured Listing</h3>
                <p className="text-sm text-muted-foreground">30 days of premium placement</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Network Access</h3>
                <p className="text-sm text-muted-foreground">Connect with 500+ families</p>
              </div>
            </div>

            {/* Quick invite action */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Invite Your Professional Network
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help us build the premier marketplace by inviting qualified professionals. 
                <strong className="text-foreground"> Unlock exclusive benefits and recognition!</strong>
              </p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Invite Colleagues Now
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon!",
                      description: "Leaderboard and rewards system will be available soon.",
                    });
                  }}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => navigate('/professionals')} 
                variant="outline" 
                className="flex-1"
              >
                Explore Marketplace
              </Button>
              <Button 
                onClick={() => navigate('/professional-dashboard')} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Button>
            </div>

            {/* Next steps */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                🎯 <strong>Next:</strong> Complete your profile, upload credentials, and start connecting with families.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Celebration Effects */}
        <CelebrationEffects 
          userName={userProfile?.display_name || userProfile?.first_name || userProfile?.name || 'Professional'}
        />

        {/* Colleague Invite Modal */}
        {showInviteModal && userProfile && (
          <ColleagueInviteModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            userId={userProfile.id}
            userProfile={userProfile}
          />
        )}
      </motion.div>
    </div>
  );
}