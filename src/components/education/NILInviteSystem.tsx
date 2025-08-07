import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Users, 
  Share, 
  Trophy, 
  CheckCircle,
  Copy,
  Mail,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface InviteStats {
  totalInvites: number;
  acceptedInvites: number;
  pendingInvites: number;
  creditsEarned: number;
}

export const NILInviteSystem: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'athlete' | 'parent' | 'coach' | 'advisor'>('athlete');
  const [inviteStats] = useState<InviteStats>({
    totalInvites: 8,
    acceptedInvites: 5,
    pendingInvites: 3,
    creditsEarned: 25
  });

  const inviteLink = "https://bfo.app/athletes/nil-onboarding?ref=athlete123";

  const handleSendInvite = () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Simulate sending invite
    toast.success(`Invitation sent to ${email}!`);
    setEmail('');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const shareOptions = [
    { platform: 'Email', icon: Mail, color: 'blue' },
    { platform: 'Text', icon: MessageSquare, color: 'green' },
    { platform: 'Social', icon: Share, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      {/* Invite Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Referral Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{inviteStats.totalInvites}</div>
              <div className="text-sm text-blue-700">Total Invites</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{inviteStats.acceptedInvites}</div>
              <div className="text-sm text-green-700">Joined</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{inviteStats.pendingInvites}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{inviteStats.creditsEarned}</div>
              <div className="text-sm text-purple-700">Credits Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Individual Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite Your Team
          </CardTitle>
          <p className="text-muted-foreground">
            Help your teammates, coaches, and family access NIL education
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            {(['athlete', 'parent', 'coach', 'advisor'] as const).map((roleType) => (
              <Button
                key={roleType}
                variant={role === roleType ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRole(roleType)}
                className="capitalize"
              >
                {roleType}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendInvite}>
              Send Invite
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Each accepted invite earns you 5 credits for premium features!
          </div>
        </CardContent>
      </Card>

      {/* Share Invite Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="h-5 w-5 text-primary" />
            Share Your Invite Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-sm flex-1 truncate">{inviteLink}</code>
              <Button variant="outline" size="sm" onClick={copyInviteLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.platform}
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => toast.info(`Opening ${option.platform} share...`)}
                >
                  <IconComponent className="h-4 w-4" />
                  {option.platform}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Referral Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-semibold">5 Credits per Signup</div>
                <div className="text-sm text-muted-foreground">
                  Earn credits when someone joins using your link
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Trophy className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-semibold">Team Leader Badge</div>
                <div className="text-sm text-muted-foreground">
                  Unlock special recognition for 10+ referrals
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-semibold">Build Your Network</div>
                <div className="text-sm text-muted-foreground">
                  Connect with teammates and create a support system
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};