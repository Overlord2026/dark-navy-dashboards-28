import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, Shield, CheckCircle, AlertTriangle, Eye, Search, Filter } from 'lucide-react';
import { NILPost, NILDecisionRDS } from '@/features/nil/types';

interface SchoolComplianceViewProps {
  schoolId: string;
  posts: NILPost[];
}

export function SchoolComplianceView({ schoolId, posts }: SchoolComplianceViewProps) {
  const [filteredPosts, setFilteredPosts] = useState<NILPost[]>(posts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'anchored' | 'pending'>('all');
  const [selectedPost, setSelectedPost] = useState<NILPost | null>(null);

  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.content.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        posts.find(p => p.brand_offer_id === post.brand_offer_id)
      );
    }

    // Apply status filter
    if (statusFilter === 'anchored') {
      filtered = filtered.filter(post => post.anchor_ref);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter(post => !post.anchor_ref);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, statusFilter]);

  const getStatusColor = (post: NILPost) => {
    if (post.anchor_ref) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = (post: NILPost) => {
    if (post.anchor_ref) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getStatusText = (post: NILPost) => {
    if (post.anchor_ref) return 'Anchored';
    return 'Pending';
  };

  const mockDecisionRDS = (post: NILPost): NILDecisionRDS => ({
    id: post.decision_rds_id || `rds_${post.id}`,
    type: 'Decision-RDS',
    post_id: post.id,
    reasons: ['DISCLOSURE_READY', 'NO_CONFLICT'],
    disclosure_pack: post.disclosure_pack,
    exclusivity_check: post.exclusivity_check_result,
    policy_version: 'NIL-2025.08',
    timestamp: post.published_at || new Date().toISOString(),
    inputs_hash: 'abc123def456'
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            School Compliance Dashboard
          </CardTitle>
          <CardDescription>
            Read-only view of recent NIL posts and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="anchored">Anchored</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No posts found matching your criteria.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{post.channel}</Badge>
                            <Badge variant="secondary">{post.disclosure_pack}</Badge>
                            <div className={`flex items-center gap-1 ${getStatusColor(post)}`}>
                              {getStatusIcon(post)}
                              <span className="text-sm font-medium">{getStatusText(post)}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Athlete ID: {post.athlete_id}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.content.text}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Published: {post.published_at ? new Date(post.published_at).toLocaleString() : 'Draft'}
                            </p>
                          </div>

                          {/* Decision-RDS Summary */}
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-4 w-4" />
                              <span className="text-sm font-medium">Decision-RDS Summary</span>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Exclusivity:</span>
                                <Badge 
                                  variant={post.exclusivity_check_result === 'pass' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {post.exclusivity_check_result.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Disclosure:</span>
                                <span className="text-green-700">✓ Ready</span>
                              </div>
                              {post.anchor_ref && (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Anchor:</span>
                                  <span className="text-green-700">✓ Verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPost(post)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Details Modal */}
      {selectedPost && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Post Details</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedPost(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Post Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">ID:</span> {selectedPost.id}</p>
                  <p><span className="text-muted-foreground">Athlete:</span> {selectedPost.athlete_id}</p>
                  <p><span className="text-muted-foreground">Channel:</span> {selectedPost.channel}</p>
                  <p><span className="text-muted-foreground">Published:</span> {selectedPost.published_at ? new Date(selectedPost.published_at).toLocaleString() : 'Draft'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Compliance Status</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Disclosure Pack:</span> {selectedPost.disclosure_pack}</p>
                  <p><span className="text-muted-foreground">Exclusivity:</span> {selectedPost.exclusivity_check_result}</p>
                  <p><span className="text-muted-foreground">Anchor Status:</span> {selectedPost.anchor_ref ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Content</h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{selectedPost.content.text}</p>
                {selectedPost.content.hashtags && selectedPost.content.hashtags.length > 0 && (
                  <div className="mt-2 space-x-1">
                    {selectedPost.content.hashtags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedPost.anchor_ref && (
              <div>
                <h4 className="font-medium mb-2">Blockchain Anchor</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-mono break-all">{selectedPost.anchor_ref}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Decision-RDS</h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(mockDecisionRDS(selectedPost), null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}