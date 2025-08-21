import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertTriangle, Eye, Send, Shield, Anchor } from 'lucide-react';
import { createDecisionRDS, generateAnchorRef, verifyAnchorRef } from '@/features/nil/services/nilRDSService';
import { NILBrandOffer, NILPost } from '@/features/nil/types';
import { useToast } from '@/hooks/use-toast';

interface BrandOfferPublishProps {
  athleteId: string;
  brandOffer: NILBrandOffer;
  onPublishComplete: (post: NILPost) => void;
}

export function BrandOfferPublish({ athleteId, brandOffer, onPublishComplete }: BrandOfferPublishProps) {
  const [currentStep, setCurrentStep] = useState<'draft' | 'gate' | 'approve' | 'publish' | 'verify'>('draft');
  const [post, setPost] = useState<Partial<NILPost>>({
    athlete_id: athleteId,
    brand_offer_id: brandOffer.id,
    content: {
      text: '',
      media_urls: [],
      hashtags: [],
      mentions: []
    },
    channel: 'instagram'
  });
  const [gatingResults, setGatingResults] = useState<{
    exclusivity_check: 'pass' | 'fail' | 'warning';
    disclosure_pack: string;
    conflicts: string[];
  } | null>(null);
  const [publishedPost, setPublishedPost] = useState<NILPost | null>(null);
  const [anchorVerification, setAnchorVerification] = useState<{ verified: boolean; blockHeight?: number } | null>(null);
  const { toast } = useToast();

  const handleDraftContent = () => {
    if (!post.content?.text || !post.channel) {
      toast({
        title: "Draft Incomplete",
        description: "Please add content and select a channel.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep('gate');
    toast({
      title: "Draft Created",
      description: "Ready for exclusivity and disclosure gating.",
    });
  };

  const handleGateCheck = () => {
    // Simulate gating checks
    const hasConflicts = Math.random() < 0.2; // 20% chance of conflicts
    const exclusivityResult: 'pass' | 'fail' | 'warning' = hasConflicts ? 'warning' : 'pass';
    
    const results = {
      exclusivity_check: exclusivityResult,
      disclosure_pack: 'FTC_US_IG_2025-08',
      conflicts: hasConflicts ? ['Potential overlap with Nike campaign'] : []
    };

    setGatingResults(results);
    setCurrentStep('approve');
    
    toast({
      title: "Gating Check Complete",
      description: `Exclusivity: ${exclusivityResult.toUpperCase()}`,
      variant: hasConflicts ? "destructive" : "default"
    });
  };

  const handleApprove = () => {
    if (!gatingResults) return;

    const reasons = ['DISCLOSURE_READY'];
    if (gatingResults.exclusivity_check === 'pass') {
      reasons.push('NO_CONFLICT');
    } else if (gatingResults.exclusivity_check === 'warning') {
      reasons.push('MINOR_CONFLICT_APPROVED');
    }

    // Create Decision-RDS
    const decisionRDS = createDecisionRDS(
      `post_${Date.now()}`,
      reasons,
      gatingResults.disclosure_pack,
      gatingResults.exclusivity_check
    );

    setCurrentStep('publish');
    toast({
      title: "Post Approved",
      description: "Decision-RDS recorded. Ready to publish.",
    });
  };

  const handlePublish = async () => {
    if (!gatingResults) return;

    // Generate anchor reference (dev stub)
    const anchorRef = generateAnchorRef();
    
    const newPost: NILPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      athlete_id: athleteId,
      brand_offer_id: brandOffer.id,
      content: post.content!,
      channel: post.channel!,
      disclosure_pack: gatingResults.disclosure_pack,
      exclusivity_check_result: gatingResults.exclusivity_check,
      published_at: new Date().toISOString(),
      anchor_ref: anchorRef,
      decision_rds_id: `decision_${Date.now()}`
    };

    setPublishedPost(newPost);
    setCurrentStep('verify');
    
    toast({
      title: "Post Published",
      description: "Content published with anchor reference recorded.",
    });

    // Simulate anchor verification
    try {
      const verification = await verifyAnchorRef(anchorRef);
      setAnchorVerification(verification);
      
      toast({
        title: "Anchor Verified",
        description: `Block height: ${verification.blockHeight}`,
      });
      
      onPublishComplete(newPost);
    } catch (error) {
      toast({
        title: "Anchor Verification Failed",
        description: "Could not verify blockchain anchor.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Brand Offer → Publish (120s)
          </CardTitle>
          <CardDescription>
            {brandOffer.brand_name} • {brandOffer.campaign_title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Draft Post */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">1. Draft Post</h3>
                {currentStep !== 'draft' && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>

              {currentStep === 'draft' && (
                <div className="space-y-4">
                  <Select
                    value={post.channel}
                    onValueChange={(value) => setPost(prev => ({ ...prev, channel: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Write your post content..."
                    value={post.content?.text || ''}
                    onChange={(e) => setPost(prev => ({
                      ...prev,
                      content: { ...prev.content!, text: e.target.value }
                    }))}
                    rows={4}
                  />

                  <Input
                    placeholder="Add hashtags (comma separated)"
                    onChange={(e) => setPost(prev => ({
                      ...prev,
                      content: { 
                        ...prev.content!, 
                        hashtags: e.target.value.split(',').map(h => h.trim()).filter(Boolean) 
                      }
                    }))}
                  />

                  <Button onClick={handleDraftContent} className="w-full">
                    Complete Draft
                  </Button>
                </div>
              )}

              {currentStep !== 'draft' && post.content && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.channel}</Badge>
                  </div>
                  <p className="text-sm">{post.content.text}</p>
                  {post.content.hashtags && post.content.hashtags.length > 0 && (
                    <div className="mt-2">
                      {post.content.hashtags.map(tag => (
                        <Badge key={tag} variant="secondary" className="mr-1">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Gate Check */}
            {currentStep !== 'draft' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">2. Gate: Exclusivity & Disclosure</h3>
                  {gatingResults && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>

                {currentStep === 'gate' && (
                  <Button onClick={handleGateCheck} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Run Exclusivity & Disclosure Check
                  </Button>
                )}

                {gatingResults && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {gatingResults.exclusivity_check === 'pass' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="font-medium">
                        Exclusivity: {gatingResults.exclusivity_check.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        Disclosure Pack: {gatingResults.disclosure_pack}
                      </span>
                    </div>
                    {gatingResults.conflicts.length > 0 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Conflicts: {gatingResults.conflicts.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Approve */}
            {currentStep === 'approve' && gatingResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">3. Approve</h3>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="font-medium">Ready to approve with:</p>
                  <div className="text-sm space-y-1">
                    <p>• Disclosure pack: {gatingResults.disclosure_pack}</p>
                    <p>• Exclusivity status: {gatingResults.exclusivity_check}</p>
                    <p>• Decision-RDS will be recorded</p>
                  </div>
                </div>

                <Button onClick={handleApprove} className="w-full">
                  Approve → Record Decision-RDS
                </Button>
              </div>
            )}

            {/* Step 4: Publish */}
            {currentStep === 'publish' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">4. Publish (Wallet-Gated)</h3>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="font-medium">Publishing will:</p>
                  <div className="text-sm space-y-1">
                    <p>• Post content to {post.channel}</p>
                    <p>• Generate blockchain anchor reference</p>
                    <p>• Record anchor in audit trail</p>
                  </div>
                </div>

                <Button onClick={handlePublish} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Publish & Anchor
                </Button>
              </div>
            )}

            {/* Step 5: Verify */}
            {currentStep === 'verify' && publishedPost && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">5. Verify in Auditor Panel</h3>
                  {anchorVerification?.verified && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Send className="h-4 w-4" />
                      <span className="font-medium">Post Published Successfully</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Published at: {new Date(publishedPost.published_at!).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Anchor className="h-4 w-4" />
                      <span className="font-medium">Anchor Reference</span>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {publishedPost.anchor_ref}
                    </p>
                    {anchorVerification && (
                      <div className="mt-2 flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">
                          Verified at block #{anchorVerification.blockHeight}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}