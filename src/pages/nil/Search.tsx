import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, MapPin, Hash, Building2 } from 'lucide-react';
import { getNilSearchRows } from '@/fixtures/fixtures.nil';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import NilReceiptsStrip from '@/components/nil/NilReceiptsStrip';
import NILLayout from '@/components/nil/NILLayout';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchRows = getNilSearchRows();

  const filteredRows = searchRows.filter(row =>
    row.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hashtag': return <Hash className="h-4 w-4" />;
      case 'local_brand': return <Building2 className="h-4 w-4" />;
      case 'school': return <MapPin className="h-4 w-4" />;
      default: return <SearchIcon className="h-4 w-4" />;
    }
  };

  return (
    <NILLayout title="Search & Discovery" description="Find opportunities, hashtags, and local brands">
      <div className="space-y-6 pb-16">
        {/* Demo Mode Badge */}
        <div className="flex justify-between items-center">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search hashtags, brands, schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-bfo-black/50 border-bfo-gold/40 text-white placeholder:text-white/50"
            />
          </div>
          <Badge className="bg-bfo-gold/20 text-bfo-gold/70 border-bfo-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Search Results */}
        <div className="grid gap-4">
          {filteredRows.map((row) => (
            <Card 
              key={row.id} 
              className="bg-[#24313d]/60 border-bfo-gold/40 hover:bg-[#24313d] transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-bfo-gold">
                      {getCategoryIcon(row.category)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{row.term}</p>
                      <p className="text-white/60 text-sm capitalize">{row.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {row.trending && (
                      <Badge className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30">
                        Trending
                      </Badge>
                    )}
                    <GoldOutlineButton
                      onClick={() => navigate(row.actionPath)}
                      className="text-xs py-1 px-3"
                    >
                      {row.actionLabel}
                    </GoldOutlineButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRows.length === 0 && (
          <Card className="bg-[#24313d]/60 border-bfo-gold/40">
            <CardContent className="p-8 text-center">
              <SearchIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No search results found</p>
              <p className="text-white/40 text-sm mt-2">Try searching for hashtags, brands, or schools</p>
            </CardContent>
          </Card>
        )}
      </div>
      <NilReceiptsStrip />
    </NILLayout>
  );
}