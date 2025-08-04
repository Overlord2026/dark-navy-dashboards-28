import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Share2, Copy, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfessionalOnboardingSuccess() {
  const navigate = useNavigate();
  const [referralCode] = useState('PROF' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [showReferrals, setShowReferrals] = useState(false);

  const shareMessage = `I just joined the exclusive Family Office Marketplace - a private network for top financial professionals. Join me and create your profile instantly by importing from LinkedIn: ${window.location.origin}/linkedin-import?ref=${referralCode}`;

  const copyReferralLink = () => {
    const link = `${window.location.origin}/linkedin-import?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/linkedin-import?ref=' + referralCode)}&text=${encodeURIComponent('Just joined the exclusive Family Office Marketplace - check it out!')}`;
    window.open(linkedInUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
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

            {/* Referral section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Invite Your Professional Network
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help us build the premier marketplace by inviting qualified professionals. 
                <strong> Each successful referral earns you 3 months of premium features.</strong>
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    value={`${window.location.origin}/linkedin-import?ref=${referralCode}`}
                    readOnly
                    className="text-xs"
                  />
                  <Button onClick={copyReferralLink} variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={shareOnLinkedIn} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Share on LinkedIn
                  </Button>
                  <Button 
                    onClick={() => setShowReferrals(!showReferrals)} 
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Direct Messages
                  </Button>
                </div>
              </div>

              {showReferrals && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-white dark:bg-gray-900 rounded border"
                >
                  <h4 className="font-medium mb-2">Copy & Paste Message Templates:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <strong>For Fellow Advisors:</strong>
                      <p className="mt-1 text-muted-foreground">
                        "Just joined an exclusive marketplace for top financial professionals. 
                        Private, vetted community connecting with UHNW families. 
                        You can import your LinkedIn profile in 2 clicks: [link]"
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <strong>For Attorneys/CPAs:</strong>
                      <p className="mt-1 text-muted-foreground">
                        "Found a great platform for connecting with family office clients. 
                        Invite-only, no spam, quality referrals. 
                        Quick LinkedIn import to get started: [link]"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
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
      </motion.div>
    </div>
  );
}