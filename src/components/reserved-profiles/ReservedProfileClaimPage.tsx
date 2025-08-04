import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { VIPWelcomeBanner } from './VIPWelcomeBanner';
import { useReservedProfiles } from '@/hooks/useReservedProfiles';
import { useAuth } from '@/contexts/UserContext';
import { ReservedProfile } from '@/types/reservedProfiles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CelebrationEffects from '@/components/effects/CelebrationEffects';

export const ReservedProfileClaimPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, signInWithOAuth } = useAuth();
  const { getProfileByToken, claimProfile, loading } = useReservedProfiles();
  
  const [profile, setProfile] = useState<ReservedProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [celebrationName, setCelebrationName] = useState<string>('');

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token]);

  const loadProfile = async () => {
    if (!token) return;
    
    try {
      const profileData = await getProfileByToken(token);
      if (!profileData) {
        setError('Invalid or expired invitation link');
        return;
      }
      if (profileData.claimed_at) {
        setError('This profile has already been claimed');
        return;
      }
      setProfile(profileData);
    } catch (error) {
      setError('Failed to load profile');
    }
  };

  const handleClaim = async () => {
    if (!profile || !user) return;
    
    setClaiming(true);
    try {
      await claimProfile({ token: token!, user_id: user.id });
      setCelebrationName(profile.name);
      
      // Redirect to onboarding after celebration
      setTimeout(() => {
        navigate('/onboarding');
      }, 3000);
    } catch (error) {
      // Error handled in hook
    } finally {
      setClaiming(false);
    }
  };

  const handleSignIn = () => {
    signInWithOAuth('linkedin_oidc');
  };

  const spotsLeft = 25 - Math.floor(Math.random() * 20); // Simulated urgency

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <h1 className="text-xl font-semibold mb-2 text-destructive">Invalid Invitation</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CelebrationEffects userName={celebrationName} />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {!user ? (
            <Card className="p-8 text-center mb-8">
              <h1 className="text-2xl font-bold mb-4">Sign In to Claim Your Profile</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in with LinkedIn to claim your reserved profile as {profile.name}
              </p>
              <Button 
                onClick={handleSignIn}
                className="bg-[#0077b5] hover:bg-[#0077b5]/90 text-white"
              >
                Continue with LinkedIn
              </Button>
            </Card>
          ) : (
            <VIPWelcomeBanner
              profile={profile}
              spotsLeft={spotsLeft}
              onClaim={handleClaim}
              loading={claiming}
            />
          )}

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Elite Network Access</h3>
              <p className="text-sm text-muted-foreground">
                Connect with top-tier advisors, attorneys, and wealth professionals
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated onboarding and white-glove service as a founding member
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Platform Influence</h3>
              <p className="text-sm text-muted-foreground">
                Shape the future of the marketplace with your feedback and expertise
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};