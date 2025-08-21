import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, School, AlertTriangle } from 'lucide-react';
import { AthleteQuickStart } from './AthleteQuickStart';
import { BrandOfferPublish } from './BrandOfferPublish';
import { SchoolComplianceView } from './SchoolComplianceView';
import { DisputeDelta } from './DisputeDelta';
import { NILBrandOffer, NILPost, NILDispute, NILDeltaRDS } from '@/features/nil/types';

const MOCK_BRAND_OFFER: NILBrandOffer = {
  id: 'offer_123',
  brand_name: 'Nike',
  campaign_title: 'Just Do It Campaign',
  offer_amount: 5000,
  exclusivity_type: 'non_exclusive',
  channels: ['instagram', 'tiktok'],
  duration_days: 30,
  assets: [
    { type: 'image', url: '/api/placeholder/400/400' },
    { type: 'text', content: 'Elevate your game with Nike. #JustDoIt #Nike' }
  ],
  status: 'approved'
};

const MOCK_POSTS: NILPost[] = [
  {
    id: 'post_001',
    athlete_id: 'athlete_123',
    brand_offer_id: 'offer_123',
    content: {
      text: 'Just crushed my workout with @nike gear! Feeling unstoppable 💪 #JustDoIt #Nike #ad',
      media_urls: ['/api/placeholder/400/400'],
      hashtags: ['JustDoIt', 'Nike', 'ad'],
      mentions: ['@nike']
    },
    channel: 'instagram',
    disclosure_pack: 'FTC_US_IG_2025-08',
    exclusivity_check_result: 'pass',
    published_at: '2025-01-21T10:30:00Z',
    anchor_ref: 'chain_1:abc123def456789:1737456600',
    decision_rds_id: 'decision_001'
  },
  {
    id: 'post_002',
    athlete_id: 'athlete_456',
    brand_offer_id: 'offer_456',
    content: {
      text: 'Game day ready! Thanks to my sponsor for the gear 🏀',
      media_urls: [],
      hashtags: ['gameday'],
      mentions: []
    },
    channel: 'tiktok',
    disclosure_pack: 'FTC_US_TT_2025-08',
    exclusivity_check_result: 'warning',
    published_at: '2025-01-21T14:15:00Z',
    decision_rds_id: 'decision_002'
  }
];

export function NILOnboardingHub() {
  const [athleteQuickStartComplete, setAthleteQuickStartComplete] = useState(false);
  const [publishedPosts, setPublishedPosts] = useState<NILPost[]>(MOCK_POSTS);
  const [disputes, setDisputes] = useState<NILDispute[]>([]);
  const [deltaRDSRecords, setDeltaRDSRecords] = useState<NILDeltaRDS[]>([]);

  const handleQuickStartComplete = () => {
    setAthleteQuickStartComplete(true);
  };

  const handlePublishComplete = (post: NILPost) => {
    setPublishedPosts(prev => [...prev, post]);
  };

  const handleDisputeResolved = (dispute: NILDispute, deltaRDS: NILDeltaRDS) => {
    setDisputes(prev => [...prev, dispute]);
    setDeltaRDSRecords(prev => [...prev, deltaRDS]);
  };

  return (
    <div className="space-y-6">
      {/* NIL Context Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle>NIL Onboarding (Investor-Ready)</CardTitle>
          <CardDescription className="space-y-1">
            <div><strong>Project:</strong> NIL Onboarding (Athlete/Brand/School)</div>
            <div><strong>Principles:</strong> Train → Gate → Publish → Receipt → Anchor → Verify</div>
            <div className="text-xs text-muted-foreground mt-2">
              • Consent freshness and training completion recorded as Consent-RDS<br/>
              • Publish Decision-RDS records disclosure pack ID and exclusivity check result<br/>
              • Dispute Delta-RDS shows reason + fix path
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="athlete" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="athlete" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Athlete (N-1)
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Brand (N-2)
          </TabsTrigger>
          <TabsTrigger value="school" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            School (N-3)
          </TabsTrigger>
          <TabsTrigger value="dispute" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Dispute (N-4)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="athlete" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                N-1 — Athlete Quick Start (90s)
              </CardTitle>
              <CardDescription>
                Complete training, consent passport, and brand connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!athleteQuickStartComplete ? (
                <AthleteQuickStart
                  athleteId="athlete_demo_123"
                  isMinor={false}
                  onComplete={handleQuickStartComplete}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-green-600 mb-2">✅ Quick Start Complete</div>
                  <p className="text-muted-foreground">Ready to receive brand offers and publish content!</p>
                  <Badge variant="default" className="mt-2">All Consent-RDS Recorded</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                N-2 — Brand Offer → Publish (120s)
              </CardTitle>
              <CardDescription>
                Draft, gate, approve, and publish brand content with anchoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrandOfferPublish
                athleteId="athlete_demo_123"
                brandOffer={MOCK_BRAND_OFFER}
                onPublishComplete={handlePublishComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                N-3 — School/Compliance View (Read-Only)
              </CardTitle>
              <CardDescription>
                Monitor recent posts with Decision-RDS summaries and anchor status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SchoolComplianceView
                schoolId="school_demo_456"
                posts={publishedPosts}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispute" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                N-4 — Dispute Delta (Demo)
              </CardTitle>
              <CardDescription>
                Trigger disputes and resolve with Delta-RDS recording
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publishedPosts.length > 0 ? (
                <DisputeDelta
                  post={publishedPosts[0]}
                  onDisputeResolved={handleDisputeResolved}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Publish a post first to demonstrate dispute resolution
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dispute & Delta Records */}
          {(disputes.length > 0 || deltaRDSRecords.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Dispute & Delta Records</CardTitle>
                <CardDescription>
                  All recorded disputes and Delta-RDS entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="destructive">{dispute.reason}</Badge>
                      <Badge variant={dispute.status === 'resolved' ? 'default' : 'secondary'}>
                        {dispute.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dispute.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Resolution: {dispute.resolution_path}
                    </p>
                  </div>
                ))}
                
                {deltaRDSRecords.map((deltaRDS) => (
                  <div key={deltaRDS.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Delta-RDS</Badge>
                      <span className="text-sm font-mono">{deltaRDS.id}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Reason:</strong> {deltaRDS.reason}</p>
                      <p><strong>Fix Path:</strong> {deltaRDS.fix_path}</p>
                      <p><strong>Actions:</strong> {deltaRDS.corrective_actions.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}