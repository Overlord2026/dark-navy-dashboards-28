import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  X, 
  Copy, 
  LinkedinIcon, 
  Twitter, 
  Facebook, 
  Mail, 
  Users, 
  Trophy,
  Share2,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ColleagueInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userProfile: any;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  recentReferrals: Array<{
    name: string;
    role: string;
    joined_date: string;
  }>;
}

const ColleagueInviteModal: React.FC<ColleagueInviteModalProps> = ({
  isOpen,
  onClose,
  userId,
  userProfile
}) => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { toast } = useToast();

  const generateReferralLink = async () => {
    setLoading(true);
    try {
      // First check if user already has a referral code
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', userId)
        .eq('referral_type', 'colleague_invite')
        .maybeSingle();

      if (existingReferral) {
        setReferralCode(existingReferral.referral_code);
      } else {
        // Generate new referral code
        const { data: codeResult } = await supabase.rpc('generate_referral_code');
        const newCode = codeResult;

        // Create new referral record
        const { error } = await supabase
          .from('referrals')
          .insert({
            referrer_id: userId,
            referral_code: newCode,
            referral_type: 'colleague_invite',
            status: 'pending',
            tenant_id: userProfile.tenant_id
          });

        if (error) throw error;
        setReferralCode(newCode);
      }

      // Fetch referral stats
      await fetchReferralStats();
    } catch (error) {
      console.error('Error generating referral link:', error);
      toast({
        title: "Error",
        description: "Failed to generate referral link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    try {
      const { data: stats } = await supabase
        .from('referral_leaderboard')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (stats) {
        setReferralStats({
          totalReferrals: stats.total_referrals || 0,
          successfulReferrals: stats.successful_referrals || 0,
          recentReferrals: [] // Could be expanded with actual recent referral data
        });
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      generateReferralLink();
    }
  }, [isOpen, userId]);

  const referralUrl = referralCode ? 
    `${window.location.origin}/join-pros?ref=${referralCode}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedToClipboard(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard.",
      });
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareToLinkedIn = () => {
    const message = encodeURIComponent(
      `I just joined the Elite Family Office Marketplace - the premier platform connecting top financial professionals with high-net-worth families. ${referralUrl}`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&summary=${message}`, '_blank');
  };

  const shareToTwitter = () => {
    const message = encodeURIComponent(
      `Just joined the Elite Family Office Marketplace! 🏆 Join me and connect with UHNW families seeking top financial professionals. ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join the Elite Family Office Marketplace');
    const body = encodeURIComponent(
      `Hi there,\n\nI wanted to share an exclusive opportunity with you. I just joined the Elite Family Office Marketplace - a premier platform that connects top financial professionals with high-net-worth families.\n\nThe platform offers:\n• Direct access to UHNW clients\n• Premium tech and compliance tools\n• Verified professional network\n• LinkedIn integration for easy setup\n\nJoin using my referral link: ${referralUrl}\n\nBest regards,\n${userProfile.display_name || userProfile.first_name || 'A colleague'}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4"
        >
          <Card className="border-none shadow-none">
            <CardHeader className="relative bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-xl p-4 sm:p-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 h-8 w-8 p-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3 sm:mb-4"
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </motion.div>
                
                <CardTitle className="text-xl sm:text-2xl font-bold">
                  Invite Your Colleagues
                </CardTitle>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Help us build the best marketplace by inviting trusted professionals
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Referral Stats */}
              {referralStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-2 sm:gap-4"
                >
                  <Card className="text-center p-2 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-primary">{referralStats.totalReferrals}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Invites</div>
                  </Card>
                  <Card className="text-center p-2 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-emerald-600">{referralStats.successfulReferrals}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Joined</div>
                  </Card>
                  <Card className="text-center p-2 sm:p-4">
                    <Trophy className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 text-amber-500" />
                    <div className="text-xs sm:text-sm text-muted-foreground">Rank Coming Soon</div>
                  </Card>
                </motion.div>
              )}

              <Separator />

              {/* Referral Link */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Your Referral Link
                </h3>
                
                <div className="flex gap-2">
                  <Input
                    value={referralUrl}
                    readOnly
                    className="font-mono text-xs sm:text-sm"
                    aria-label="Referral link"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="shrink-0 px-2 sm:px-3"
                    aria-label="Copy referral link"
                  >
                    {copiedToClipboard ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Social Share Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">Share on Social Media</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={shareToLinkedIn}
                    className="bg-blue-600 hover:bg-blue-700 text-white justify-start text-sm sm:text-base py-2 sm:py-3"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Share on LinkedIn
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                  </Button>
                  
                  <Button
                    onClick={shareToTwitter}
                    className="bg-slate-900 hover:bg-slate-800 text-white justify-start text-sm sm:text-base py-2 sm:py-3"
                    aria-label="Share on X (formerly Twitter)"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Share on X</span>
                    <span className="sm:hidden">X</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                  </Button>
                  
                  <Button
                    onClick={shareToFacebook}
                    className="bg-blue-600 hover:bg-blue-700 text-white justify-start text-sm sm:text-base py-2 sm:py-3"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Share on Facebook</span>
                    <span className="sm:hidden">Facebook</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                  </Button>
                  
                  <Button
                    onClick={shareViaEmail}
                    variant="outline"
                    className="justify-start text-sm sm:text-base py-2 sm:py-3 sm:col-span-2"
                    aria-label="Share via email"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Share via Email
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Benefits Reminder */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-semibold">Why Invite Colleagues?</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mt-0.5 shrink-0" />
                    Build a stronger professional network within the platform
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mt-0.5 shrink-0" />
                    Help create the most comprehensive family office marketplace
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mt-0.5 shrink-0" />
                    Increase referral opportunities with trusted colleagues
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mt-0.5 shrink-0" />
                    Gain recognition in our upcoming leaderboard system
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                >
                  Close
                </Button>
                <Button 
                  onClick={copyToClipboard} 
                  className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                >
                  Copy Link & Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColleagueInviteModal;