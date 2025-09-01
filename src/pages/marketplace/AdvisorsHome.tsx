import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdvisorCard } from '@/components/marketplace/AdvisorCard';
import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { recordInquiry } from '@/services/inquiries';
import { useToast } from '@/hooks/use-toast';

type Advisor = {
  id: string;
  name: string;
  title?: string | null;
  city?: string | null;
  tags?: string[] | null;
  avatar_url?: string | null;
  created_at?: string;
};

export default function AdvisorsHome() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'recent'>('name');
  
  // Modal states
  const [inquiryModal, setInquiryModal] = useState<{
    isOpen: boolean;
    advisorId?: string;
    advisorName?: string;
  }>({ isOpen: false });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  
  // Voice states
  const [voiceDrawer, setVoiceDrawer] = useState<{
    isOpen: boolean;
    advisorId?: string;
    advisorName?: string;
  }>({ isOpen: false });

  const { toast } = useToast();

  // Fetch advisors from v_public_pros
  useEffect(() => {
    loadAdvisors();
  }, []);

  const loadAdvisors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('v_public_pros')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAdvisors(data || []);
    } catch (error) {
      console.error('Failed to load advisors:', error);
      toast({
        title: "Unable to load advisors",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags from advisors
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    advisors.forEach(advisor => {
      advisor.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [advisors]);

  // Filter and sort advisors
  const filteredAdvisors = useMemo(() => {
    let filtered = advisors.filter(advisor => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        advisor.name.toLowerCase().includes(searchLower) ||
        advisor.title?.toLowerCase().includes(searchLower) ||
        advisor.city?.toLowerCase().includes(searchLower);

      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => advisor.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });

    // Sort
    switch (sortBy) {
      case 'city':
        filtered.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      default: // 'name'
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [advisors, searchQuery, selectedTags, sortBy]);

  // Handle inquiry submission
  const handleInquirySubmit = async (data: {
    full_name: string;
    email: string;
    phone?: string;
    message?: string;
    consent_tos: boolean;
  }) => {
    if (!inquiryModal.advisorId) return { receiptHash: null };

    try {
      setInquiryLoading(true);
      
      const result = await recordInquiry({
        pro_id: inquiryModal.advisorId,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        consent_tos: data.consent_tos
      });

      console.log('Inquiry saved', result.id, 'pro_id:', result.pro_id, 'receipt:', result.receiptHash);
      
      toast({
        title: "Inquiry sent",
        description: result.receiptHash 
          ? "We'll follow up with you shortly! Receipt ✓" 
          : "We'll follow up with you shortly!"
      });

      setInquiryModal({ isOpen: false });
      return { receiptHash: result.receiptHash };
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      toast({
        title: "Failed to send inquiry",
        description: "Please try again later.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setInquiryLoading(false);
    }
  };

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bfo-black">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bfo-card border border-bfo-gold/30 p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bfo-purple rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-bfo-purple rounded mb-2"></div>
                    <div className="h-3 bg-bfo-purple/50 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-bfo-purple/50 rounded-full"></div>
                  <div className="h-6 w-20 bg-bfo-purple/50 rounded-full"></div>
                </div>
                <div className="h-8 bg-bfo-purple/50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bfo-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Financial Advisors</h1>
          <p className="text-white/70">Connect with experienced financial professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, title, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bfo-purple border border-bfo-gold/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-bfo-gold"
            />
          </div>

          {/* Sort and Tag Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-white/70" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-bfo-purple border border-bfo-gold/30 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-bfo-gold"
              >
                <option value="name">A-Z</option>
                <option value="city">City</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>

            {/* Tag Filter Pills */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-bfo-gold text-black border-bfo-gold'
                        : 'text-bfo-gold border-bfo-gold/50 hover:border-bfo-gold'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/70">Showing {filteredAdvisors.length} results</span>
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="text-bfo-gold hover:text-bfo-gold/80"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filteredAdvisors.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAdvisors.map(advisor => (
              <AdvisorCard
                key={advisor.id}
                advisor={advisor}
                showVoice={true}
                onContact={() => setInquiryModal({
                  isOpen: true,
                  advisorId: advisor.id,
                  advisorName: advisor.name
                })}
                onVoice={() => setVoiceDrawer({
                  isOpen: true,
                  advisorId: advisor.id,
                  advisorName: advisor.name
                })}
              />
            ))}
          </div>
        ) : (
          <div className="bfo-card border border-bfo-gold/30 p-8 text-center">
            <p className="text-white mb-2">No advisors found</p>
            <p className="text-white/60 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Inquiry Modal */}
        <InquiryModal
          isOpen={inquiryModal.isOpen}
          onClose={() => setInquiryModal({ isOpen: false })}
          onSubmit={handleInquirySubmit}
          advisorName={inquiryModal.advisorName}
          loading={inquiryLoading}
        />

        {/* Voice Drawer */}
        <VoiceDrawer
          persona="advisor"
          open={voiceDrawer.isOpen}
          onClose={() => setVoiceDrawer({ isOpen: false })}
        />
      </div>
    </div>
  );
}