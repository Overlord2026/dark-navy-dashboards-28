import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ArrowRight, Heart, Building, TrendingUp } from "lucide-react";
import { clientSegments } from "@/components/solutions/WhoWeServe";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SegmentedOnboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userProfile, refreshUserProfile } = useUser();
  const [advisorInfo, setAdvisorInfo] = useState<{name: string, email: string} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get segment and advisor info from URL params or user metadata
  const segment = searchParams.get('segment') || userProfile?.client_segment;
  const advisorId = searchParams.get('advisor_id') || userProfile?.advisor_id;
  const personalNote = searchParams.get('personal_note');
  const invitationType = searchParams.get('invitation_type');

  useEffect(() => {
    // Load advisor information if advisor_id is present
    if (advisorId) {
      loadAdvisorInfo(advisorId);
    }

    // If user has segment but it's not in URL, update profile
    if (segment && !userProfile?.client_segment) {
      updateUserSegment(segment);
    }
  }, [advisorId, segment, userProfile?.client_segment]);

  const loadAdvisorInfo = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', id)
        .single();

      if (error) throw error;

      setAdvisorInfo({
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Your Advisor',
        email: data.email
      });
    } catch (error) {
      console.error('Error loading advisor info:', error);
    }
  };

  const updateUserSegment = async (segmentId: string) => {
    if (!userProfile?.id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          client_segment: segmentId,
          advisor_id: advisorId 
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshUserProfile();
      toast.success("Your profile has been updated!");
    } catch (error) {
      console.error('Error updating user segment:', error);
      toast.error("Failed to update your profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const getSegmentInfo = () => {
    if (!segment || segment === 'general') {
      return {
        title: 'Welcome to Our Family Office',
        description: 'Comprehensive wealth management solutions tailored for you.',
        icon: Building,
        color: 'bg-blue-500'
      };
    }

    const segmentInfo = clientSegments.find(s => s.id === segment);
    return segmentInfo ? {
      title: `Welcome, ${segmentInfo.title}`,
      description: segmentInfo.description,
      icon: segmentInfo.icon,
      color: 'bg-primary'
    } : {
      title: 'Welcome to Our Family Office',
      description: 'Comprehensive wealth management solutions tailored for you.',
      icon: Building,
      color: 'bg-blue-500'
    };
  };

  const segmentInfo = getSegmentInfo();
  const IconComponent = segmentInfo.icon;

  const handleContinueToDashboard = () => {
    // Track successful onboarding
    if (userProfile?.id) {
      supabase.from('user_events').insert({
        user_id: userProfile.id,
        event_type: 'onboarding_completed',
        event_data: { 
          segment,
          advisor_id: advisorId,
          invitation_type: invitationType 
        }
      });
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className={`w-16 h-16 rounded-full ${segmentInfo.color} mx-auto flex items-center justify-center`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold">{segmentInfo.title}</CardTitle>
            <CardDescription className="text-lg mt-2">
              {segmentInfo.description}
            </CardDescription>
          </div>

          {invitationType === 'advisor_invite' && (
            <Badge variant="outline" className="mx-auto">
              <UserCheck className="h-3 w-3 mr-1" />
              Advisor Invitation
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Advisor Information */}
          {advisorInfo && (
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Your Assigned Advisor</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{advisorInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{advisorInfo.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Personal Note */}
          {personalNote && (
            <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Personal Message</h3>
              <p className="text-sm italic">"{personalNote}"</p>
            </div>
          )}

          {/* Segment-specific benefits or next steps */}
          <div className="space-y-3">
            <h3 className="font-semibold">What's Next for You:</h3>
            <div className="grid gap-3">
              {segment === 'physician' && (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Healthcare-specific tax strategies and retirement planning</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Malpractice insurance optimization and asset protection</span>
                  </div>
                </>
              )}
              {segment === 'executive' && (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Executive compensation planning and equity management</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span>Corporate benefits optimization and deferred compensation</span>
                  </div>
                </>
              )}
              {segment === 'entrepreneur' && (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Business exit planning and succession strategies</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span>Angel investing and alternative investment opportunities</span>
                  </div>
                </>
              )}
              {(!segment || segment === 'general') && (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Personalized wealth management and investment strategies</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span>Comprehensive financial planning and estate services</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Button 
            onClick={handleContinueToDashboard}
            className="w-full"
            size="lg"
            disabled={isUpdating}
          >
            {isUpdating ? "Setting up your profile..." : "Continue to Dashboard"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}