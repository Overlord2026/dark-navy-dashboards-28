import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface InviteData {
  id: string;
  email: string;
  status: string;
  invite_type?: string;
  first_name?: string;
  last_name?: string;
  personal_note?: string;
  inviter_email?: string;
  payment_responsibility?: string;
}

export default function InviteRedemption() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadInvite();
    }
  }, [token]);

  const loadInvite = async () => {
    try {
      setLoading(true);
      
      // Fetch invite by token
      const { data: invite, error } = await supabase
        .from('prospect_invitations')
        .select('*')
        .eq('magic_token', token)
        .single();

      if (error || !invite) {
        setError('Invalid or expired invitation link');
        return;
      }

      if (invite.status === 'activated') {
        setError('This invitation has already been used');
        return;
      }

      if (invite.status === 'expired') {
        setError('This invitation has expired');
        return;
      }

      setInvite(invite);
    } catch (err) {
      console.error('Failed to load invite:', err);
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!invite) return;

    setAccepting(true);

    try {
      // Update invite status to accepted
      const { error: updateError } = await supabase
        .from('prospect_invitations')
        .update({ 
          status: 'accepted',
          activated_at: new Date().toISOString()
        })
        .eq('id', invite.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Invitation accepted successfully!');

      // Redirect based on invite type
      if (invite.invite_type === 'family_to_advisor') {
        // Advisor accepting family invitation
        navigate('/pros/advisors/platform');
      } else {
        // Family member accepting advisor invitation
        navigate('/family/home');
      }

    } catch (error) {
      console.error('Failed to accept invitation:', error);
      toast.error('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Invalid Invitation | Family Office Platform</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!invite) {
    return null;
  }

  const isAdvisorInvite = invite.invite_type === 'family_to_advisor';

  return (
    <>
      <Helmet>
        <title>Accept Invitation | Family Office Platform</title>
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {isAdvisorInvite ? 'Family Connection Request' : 'Advisor Invitation'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                {isAdvisorInvite ? (
                  <>You've been invited to connect with <strong>{invite.first_name} {invite.last_name}</strong></>
                ) : (
                  <>You've been invited to join the family office platform</>
                )}
              </p>
              
              {invite.inviter_email && (
                <p className="text-sm text-muted-foreground mt-2">
                  From: {invite.inviter_email}
                </p>
              )}
            </div>

            {invite.personal_note && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Personal Message:</h4>
                <p className="text-sm text-muted-foreground italic">
                  "{invite.personal_note}"
                </p>
              </div>
            )}

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Connection Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invited Email:</span>
                  <span>{invite.email}</span>
                </div>
                {invite.payment_responsibility && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment:</span>
                    <span>
                      {invite.payment_responsibility === 'advisor_paid' ? 'Advisor Covers' : 
                       invite.payment_responsibility === 'family_paid' ? 'Family Covers' : 'Client Pays'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={acceptInvitation}
                disabled={accepting}
                className="w-full"
                size="lg"
              >
                {accepting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Accepting...
                  </>
                ) : (
                  <>
                    Accept Invitation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Not Now
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By accepting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}