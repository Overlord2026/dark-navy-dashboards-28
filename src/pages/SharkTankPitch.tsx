import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SharkTankPitchDeck } from '@/components/pitch/SharkTankPitchDeck';
import { DemoVideoSection } from '@/components/pitch/DemoVideoSection';
import { PressKitExports } from '@/components/pitch/PressKitExports';
import { HallOfChampions } from '@/components/pitch/HallOfChampions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Tv, Video, Download, Users, ExternalLink } from 'lucide-react';

const SharkTankPitch: React.FC = () => {
  const [activeTab, setActiveTab] = useState('deck');

  const sharkTankApplications = [
    {
      name: 'Shark Tank US',
      url: 'https://abc.com/casting/shark-tank',
      description: 'The original and most popular business pitch show'
    },
    {
      name: "Dragon's Den Canada",
      url: 'https://www.cbc.ca/dragonsden/apply',
      description: 'Canadian version with top business leaders'
    },
    {
      name: "Dragon's Den UK",
      url: 'https://www.bbc.co.uk/programmes/b006vq92',
      description: 'UK business investment show'
    },
    {
      name: 'The Profit',
      url: 'https://www.cnbc.com/the-profit/',
      description: 'Business makeover show with Marcus Lemonis'
    }
  ];

  const competitions = [
    { name: 'Money20/20', category: 'FinTech' },
    { name: 'Finovate', category: 'Financial Innovation' },
    { name: 'Web Summit', category: 'Technology' },
    { name: 'WealthStack', category: 'Wealth Management' },
    { name: 'LendIt', category: 'Lending & Credit' },
    { name: 'XYPN LIVE', category: 'Financial Planning' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-3">
            <Tv className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-gold to-accent bg-clip-text text-transparent">
              Shark Tank Ready
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete pitch deck, demo videos, and media assets ready for investors, TV shows, and competitions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
              <Crown className="h-4 w-4 mr-1" />
              Investor Ready
            </Badge>
            <Badge variant="secondary">TV Show Optimized</Badge>
            <Badge variant="secondary">Media Friendly</Badge>
            <Badge variant="secondary">Competition Ready</Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="deck" className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              Pitch Deck
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Demo Videos
            </TabsTrigger>
            <TabsTrigger value="press" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Press Kit
            </TabsTrigger>
            <TabsTrigger value="champions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Champions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deck" className="space-y-8">
            <SharkTankPitchDeck />
          </TabsContent>

          <TabsContent value="video" className="space-y-8">
            <DemoVideoSection />
          </TabsContent>

          <TabsContent value="press" className="space-y-8">
            <PressKitExports />
          </TabsContent>

          <TabsContent value="champions" className="space-y-8">
            <HallOfChampions />
          </TabsContent>
        </Tabs>

        {/* Application Links */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Apply to Pitch Shows</h2>
            <p className="text-muted-foreground mb-8">
              Ready to take your pitch to the big stage? Apply to these popular shows and competitions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sharkTankApplications.map((show, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {show.name}
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {show.description}
                  </p>
                  <Button asChild className="w-full">
                    <a href={show.url} target="_blank" rel="noopener noreferrer">
                      Apply Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Industry Competitions</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {competitions.map((comp, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {comp.name} - {comp.category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharkTankPitch;