import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Share, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Trophy, 
  Star,
  CheckCircle,
  Shield,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Copy,
  Mail
} from 'lucide-react';
// import { analytics } from '@/lib/analytics';
import { toast } from 'sonner';

const AthleteProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock athlete data - in real app, fetch by handle
  const athlete = {
    id: '1',
    handle: handle || 'sarah-thompson',
    name: 'Sarah Thompson',
    sport: 'Basketball',
    position: 'Point Guard',
    school: 'Duke University',
    classYear: 'Junior',
    region: 'North Carolina',
    avatar: '/placeholder-athlete-1.jpg',
    coverImage: '/placeholder-athlete-cover.jpg',
    bio: 'Junior at Duke University studying Business and Marketing. Captain of the Blue Devils basketball team. Passionate about youth mentorship and community outreach.',
    stats: {
      ppg: 18.5,
      apg: 7.2,
      rpg: 5.1,
      fg_percentage: 0.456
    },
    social: {
      instagram: '@sarah_thompson_5',
      twitter: '@saraht_hoops',
      tiktok: '@sarahbasketball',
      youtube: 'Sarah Thompson Basketball'
    },
    followers: 12500,
    verified: true,
    complianceCoverage: 95,
    brandKit: {
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      fonts: ['Montserrat', 'Open Sans'],
      logoUrl: '/placeholder-athlete-logo.png'
    },
    portfolio: [
      {
        id: '1',
        title: 'Nike Training Partnership',
        type: 'Endorsement',
        status: 'Active',
        startDate: '2024-01-15',
        image: '/placeholder-campaign-1.jpg',
        description: 'Promoting Nike basketball training gear and youth programs'
      },
      {
        id: '2',
        title: 'Local Youth Basketball Camp',
        type: 'Community',
        status: 'Completed',
        startDate: '2023-12-10',
        image: '/placeholder-campaign-2.jpg',
        description: 'Teaching basketball fundamentals to local middle school students'
      },
      {
        id: '3',
        title: 'Energy Drink Campaign',
        type: 'Social Media',
        status: 'Active',
        startDate: '2024-01-20',
        image: '/placeholder-campaign-3.jpg',
        description: 'Social media content featuring healthy energy drink alternatives'
      }
    ],
    achievements: [
      'ACC Player of the Week (3x)',
      'Dean\'s List (4 semesters)',
      'Community Service Award 2023',
      'Team Captain 2023-2024'
    ],
    interests: ['Basketball', 'Youth Mentorship', 'Marketing', 'Community Service', 'Fashion'],
    rateCard: {
      socialPost: 500,
      videoContent: 1200,
      appearance: 2000,
      endorsement: 5000
    }
  };

  const handleInviteClick = () => {
    toast.success(`Inviting ${athlete.name}...`);
    navigate(`/invite/athlete/${athlete.handle}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${athlete.name} - NIL Athlete Profile`,
      text: `Check out ${athlete.name}'s NIL athlete profile`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Profile shared successfully');
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard');
    }
  };

  const handleRequestShoutout = () => {
    toast.success(`Requesting shoutout from ${athlete.name}...`);
    navigate(`/request/shoutout/${athlete.handle}`);
  };

  const proofBadges = [
    { type: 'Training', status: 'complete', description: 'NIL compliance training completed' },
    { type: 'Disclosures', status: 'complete', description: 'All required disclosures filed' },
    { type: 'Approvals', status: 'complete', description: 'School and NCAA approvals current' },
    { type: 'Verification', status: 'partial', description: 'Identity and eligibility verified' }
  ];

  return (
    <>
      <Helmet>
        <title>{athlete.name} - NIL Athlete Profile</title>
        <meta 
          name="description" 
          content={`${athlete.name}, ${athlete.sport} ${athlete.position} at ${athlete.school}. ${athlete.bio.substring(0, 150)}...`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`/a/${athlete.handle}`} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={`${athlete.name} - NIL Athlete Profile`} />
        <meta property="og:description" content={athlete.bio} />
        <meta property="og:image" content={athlete.avatar} />
        <meta property="og:url" content={`/a/${athlete.handle}`} />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${athlete.name} - NIL Athlete Profile`} />
        <meta name="twitter:description" content={athlete.bio} />
        <meta name="twitter:image" content={athlete.avatar} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative">
          {/* Cover Image */}
          <div 
            className="h-64 md:h-80 bg-gradient-to-r from-primary/20 to-secondary/20 bg-cover bg-center"
            style={{ backgroundImage: `url(${athlete.coverImage})` }}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Info Overlay */}
          <div className="container mx-auto px-4 relative -mt-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={athlete.avatar} alt={athlete.name} />
                <AvatarFallback className="text-2xl">
                  {athlete.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 bg-background/95 backdrop-blur p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{athlete.name}</h1>
                      {athlete.verified && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">@{athlete.handle}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {athlete.sport} • {athlete.position}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {athlete.school} • {athlete.classYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {athlete.followers.toLocaleString()} followers
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleInviteClick}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Invite to Campaign
                    </Button>
                    <Button variant="outline" onClick={handleRequestShoutout}>
                      <Star className="w-4 h-4 mr-2" />
                      Request Shoutout
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="brand-kit">Brand Kit</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Bio & Stats */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{athlete.bio}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {athlete.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Season Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{athlete.stats.ppg}</div>
                          <div className="text-sm text-muted-foreground">PPG</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{athlete.stats.apg}</div>
                          <div className="text-sm text-muted-foreground">APG</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{athlete.stats.rpg}</div>
                          <div className="text-sm text-muted-foreground">RPG</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{(athlete.stats.fg_percentage * 100).toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">FG%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {athlete.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                        <Instagram className="w-4 h-4" />
                        {athlete.social.instagram}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                        <Twitter className="w-4 h-4" />
                        {athlete.social.twitter}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                        <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">T</div>
                        {athlete.social.tiktok}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                        <Youtube className="w-4 h-4" />
                        {athlete.social.youtube}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Rate Card</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Social Post</span>
                        <span className="font-semibold">${athlete.rateCard.socialPost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Video Content</span>
                        <span className="font-semibold">${athlete.rateCard.videoContent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Event Appearance</span>
                        <span className="font-semibold">${athlete.rateCard.appearance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Endorsement Deal</span>
                        <span className="font-semibold">${athlete.rateCard.endorsement}+</span>
                      </div>
                      <Button size="sm" className="w-full mt-4" onClick={handleInviteClick}>
                        <Mail className="w-4 h-4 mr-2" />
                        Get Quote
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {athlete.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Started {new Date(item.startDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Brand Kit Tab */}
            <TabsContent value="brand-kit" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Colors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {athlete.brandKit.colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-16 h-16 rounded-lg border shadow-sm mb-2"
                            style={{ backgroundColor: color }}
                          />
                          <code className="text-xs text-muted-foreground">{color}</code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {athlete.brandKit.fonts.map((font, index) => (
                        <div key={index}>
                          <p style={{ fontFamily: font }} className="text-lg font-semibold">
                            {font}
                          </p>
                          <p style={{ fontFamily: font }} className="text-sm text-muted-foreground">
                            The quick brown fox jumps over the lazy dog
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Logo & Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <img 
                        src={athlete.brandKit.logoUrl} 
                        alt={`${athlete.name} Logo`}
                        className="w-20 h-20 object-contain border rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold mb-1">Personal Logo</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          High-resolution logo available in PNG, SVG formats
                        </p>
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4 mr-2" />
                          Download Assets
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Proof Coverage Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {proofBadges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className={`w-5 h-5 ${
                          badge.status === 'complete' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <div className="font-semibold">{badge.type}</div>
                          <div className="text-sm text-muted-foreground">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span>Overall Compliance Score</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {athlete.complianceCoverage}% Complete
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${athlete.complianceCoverage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    This athlete meets all current NIL compliance requirements including training completion, 
                    disclosure filings, and institutional approvals. All activities are properly documented 
                    with proof slips for verification.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
};

export default AthleteProfile;