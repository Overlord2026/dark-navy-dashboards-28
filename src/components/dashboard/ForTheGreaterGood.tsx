import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, GraduationCap, Building2, Plus, Share, Calendar, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  website_url?: string;
  logo_url?: string;
  is_featured: boolean;
  annual_goal: number;
  annual_raised: number;
}

interface UserDonation {
  id: string;
  charity_id: string;
  amount: number;
  donation_date: string;
  description?: string;
  charity?: Charity;
}

interface CommunityMetrics {
  year: number;
  total_donations: number;
  families_helped: number;
  scholarships_funded: number;
  community_projects: number;
  unique_donors: number;
}

interface ImpactStory {
  id: string;
  title: string;
  story: string;
  is_anonymous: boolean;
  charity?: Charity;
}

export const ForTheGreaterGood = () => {
  const { user } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [userDonations, setUserDonations] = useState<UserDonation[]>([]);
  const [primaryCharity, setPrimaryCharity] = useState<Charity | null>(null);
  const [communityMetrics, setCommunityMetrics] = useState<CommunityMetrics | null>(null);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [newCharity, setNewCharity] = useState({ name: '', description: '', website: '', reason: '' });
  const [newStory, setNewStory] = useState({ title: '', story: '', isAnonymous: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch charities
      const { data: charitiesData } = await supabase
        .from('charities')
        .select('*')
        .eq('is_verified', true)
        .order('is_featured', { ascending: false });

      // Fetch user's primary charity
      const { data: userCharityData } = await supabase
        .from('user_charities')
        .select(`
          *,
          charity:charities(*)
        `)
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      // Fetch user donations
      const { data: donationsData } = await supabase
        .from('user_donations')
        .select(`
          *,
          charity:charities(*)
        `)
        .eq('user_id', user.id)
        .order('donation_date', { ascending: false });

      // Fetch community metrics
      const { data: metricsData } = await supabase
        .from('community_giving_metrics')
        .select('*')
        .eq('year', new Date().getFullYear())
        .single();

      // Fetch featured impact stories
      const { data: storiesData } = await supabase
        .from('impact_stories')
        .select(`
          *,
          charity:charities(*)
        `)
        .eq('is_featured', true)
        .eq('status', 'approved')
        .limit(3);

      setCharities(charitiesData || []);
      setPrimaryCharity(userCharityData?.charity || null);
      setUserDonations(donationsData || []);
      setCommunityMetrics(metricsData);
      setImpactStories(storiesData || []);
    } catch (error) {
      toast.error('Failed to load giving data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCharity = async (charity: Charity) => {
    if (!user) return;

    try {
      // Remove existing primary charity
      await supabase
        .from('user_charities')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Add new primary charity
      await supabase
        .from('user_charities')
        .upsert({
          user_id: user.id,
          charity_id: charity.id,
          is_primary: true
        });

      setPrimaryCharity(charity);
      toast.success(`Selected ${charity.name} as your primary charity`);
    } catch (error) {
      toast.error('Failed to select charity');
    }
  };

  const handleSuggestCharity = async () => {
    if (!user || !newCharity.name.trim()) return;

    try {
      await supabase
        .from('charity_suggestions')
        .insert({
          user_id: user.id,
          charity_name: newCharity.name,
          description: newCharity.description,
          website_url: newCharity.website,
          reason: newCharity.reason
        });

      toast.success('Charity suggestion submitted for review');
      setNewCharity({ name: '', description: '', website: '', reason: '' });
      setShowSuggestModal(false);
    } catch (error) {
      toast.error('Failed to suggest charity');
    }
  };

  const handleShareStory = async () => {
    if (!user || !newStory.title.trim() || !newStory.story.trim()) return;

    try {
      await supabase
        .from('impact_stories')
        .insert({
          user_id: user.id,
          charity_id: primaryCharity?.id,
          title: newStory.title,
          story: newStory.story,
          is_anonymous: newStory.isAnonymous
        });

      toast.success('Thank you for sharing your impact story!');
      setNewStory({ title: '', story: '', isAnonymous: false });
      setShowStoryModal(false);
    } catch (error) {
      toast.error('Failed to share story');
    }
  };

  const calculateUserTotals = () => {
    const currentYear = new Date().getFullYear();
    const ytdDonations = userDonations.filter(d => 
      new Date(d.donation_date).getFullYear() === currentYear
    );
    const ytdTotal = ytdDonations.reduce((sum, d) => sum + d.amount, 0);
    const lifetimeTotal = userDonations.reduce((sum, d) => sum + d.amount, 0);

    return { ytdTotal, lifetimeTotal, donationCount: userDonations.length };
  };

  const { ytdTotal, lifetimeTotal, donationCount } = calculateUserTotals();
  const communityProgress = communityMetrics ? 
    (communityMetrics.total_donations / (communityMetrics.total_donations + 500000)) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardSkeleton variant="wide" />
        <div className="grid md:grid-cols-3 gap-6">
          <DashboardSkeleton variant="compact" />
          <DashboardSkeleton variant="compact" />
          <DashboardSkeleton variant="compact" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          For the Greater Good
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Together, we're building stronger communities and creating lasting impact. 
          Your generosity makes a difference in the lives of those who need it most.
        </p>
      </div>

      {/* Annual Impact Stats */}
      {communityMetrics && (
        <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Community Impact This Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  ${(communityMetrics.total_donations / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Donations</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {communityMetrics.families_helped}
                </div>
                <div className="text-sm text-muted-foreground">Families Helped</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {communityMetrics.scholarships_funded}
                </div>
                <div className="text-sm text-muted-foreground">Scholarships</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {communityMetrics.community_projects}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Your Impact Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {primaryCharity ? (
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={primaryCharity.logo_url} alt={primaryCharity.name} />
                    <AvatarFallback>
                      <Heart className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{primaryCharity.name}</h3>
                    <p className="text-sm text-muted-foreground">{primaryCharity.description}</p>
                  </div>
                  <Badge variant="secondary">Primary</Badge>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Choose Your Cause</h3>
                    <p className="text-muted-foreground">Select a charity to support and track your impact</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">${ytdTotal.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">This Year</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">${lifetimeTotal.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Lifetime</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{donationCount}</div>
                  <div className="text-sm text-muted-foreground">Donations</div>
                </div>
              </div>

              {/* Community Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">AWM Community Goal Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {communityProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={communityProgress} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  ${communityMetrics?.total_donations.toLocaleString()} / ${(communityMetrics?.total_donations + 500000).toLocaleString()} this year
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Dialog open={showSuggestModal} onOpenChange={setShowSuggestModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Suggest a Charity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suggest a New Charity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Charity name"
                    value={newCharity.name}
                    onChange={(e) => setNewCharity(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newCharity.description}
                    onChange={(e) => setNewCharity(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Input
                    placeholder="Website (optional)"
                    value={newCharity.website}
                    onChange={(e) => setNewCharity(prev => ({ ...prev, website: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Why should we add this charity?"
                    value={newCharity.reason}
                    onChange={(e) => setNewCharity(prev => ({ ...prev, reason: e.target.value }))}
                  />
                  <Button onClick={handleSuggestCharity} className="w-full">
                    Submit Suggestion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showStoryModal} onOpenChange={setShowStoryModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share My Story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Impact Story</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Story title"
                    value={newStory.title}
                    onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Tell us about the impact you've made or witnessed..."
                    value={newStory.story}
                    onChange={(e) => setNewStory(prev => ({ ...prev, story: e.target.value }))}
                    rows={4}
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newStory.isAnonymous}
                      onChange={(e) => setNewStory(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    />
                    <span className="text-sm">Share anonymously</span>
                  </label>
                  <Button onClick={handleShareStory} className="w-full">
                    Share Story
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Featured Charities & Stories */}
        <div className="space-y-6">
          {/* Featured Charities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Featured Causes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {charities.filter(c => c.is_featured).map((charity) => (
                <div key={charity.id} className="space-y-3 pb-4 border-b border-border last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={charity.logo_url} alt={charity.name} />
                      <AvatarFallback>
                        {charity.category === 'Education' && <GraduationCap className="h-5 w-5" />}
                        {charity.category === 'Housing' && <Building2 className="h-5 w-5" />}
                        {charity.category === 'Hunger Relief' && <Users className="h-5 w-5" />}
                        <Heart className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">{charity.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{charity.description}</p>
                      <Badge variant="outline" className="text-xs mt-1">{charity.category}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>${charity.annual_raised.toLocaleString()}</span>
                      <span>${charity.annual_goal.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(charity.annual_raised / charity.annual_goal) * 100} 
                      className="h-1" 
                    />
                  </div>
                  {primaryCharity?.id !== charity.id && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-xs"
                      onClick={() => handleSelectCharity(charity)}
                    >
                      Select This Cause
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impact Stories */}
          {impactStories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Impact Stories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {impactStories.map((story) => (
                  <div key={story.id} className="space-y-2 pb-4 border-b border-border last:border-b-0">
                    <h4 className="font-medium text-sm text-foreground">{story.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">{story.story}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {story.is_anonymous ? 'Anonymous' : 'Community Member'}
                      </span>
                      {story.charity && (
                        <Badge variant="secondary" className="text-xs">
                          {story.charity.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Make an Even Greater Impact?</h3>
          <p className="text-muted-foreground mb-6">
            Let's discuss how strategic giving can align with your financial goals and values.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="flex items-center gap-2"
              onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
            >
              <Calendar className="h-4 w-4" />
              Book Intro Call
            </Button>
            <Button variant="outline">
              Learn More About Strategic Giving
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};