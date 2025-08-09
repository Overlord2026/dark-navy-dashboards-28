import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  Presentation, 
  ExternalLink, 
  Download, 
  Eye, 
  Edit, 
  Share, 
  Filter,
  Search,
  Plus,
  Folder,
  Calendar,
  User,
  Tag,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Deck {
  id: string;
  title: string;
  description?: string;
  personas: string[];
  tags: string[];
  fileType: 'pptx' | 'pdf' | 'canva' | 'figma';
  owner: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived';
  thumbnailUrl?: string;
  route?: string;
  downloadUrl?: string;
}

// Mock deck data - In production, this would come from Supabase or local storage
const mockDecks: Deck[] = [
  {
    id: 'client-family-solutions-platform',
    title: 'Client & Family Solutions – All-in-One Wealth, Health & Legacy Platform',
    description: 'Comprehensive presentation deck showcasing the all-in-one platform for families to manage wealth, health, and legacy planning',
    personas: ['client', 'family', 'hnw_client', 'pre_retiree'],
    tags: ['family', 'wealth management', 'estate planning', 'retirement', 'all-in-one', 'pricing'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2025-01-09T00:00:00Z',
    updatedAt: '2025-01-09T00:00:00Z',
    status: 'active',
    route: '/decks/client-family-solutions'
  },
  {
    id: 'advisor-sales-deck',
    title: 'Financial Advisor Sales Deck',
    description: 'Complete SWAG™ GPS™ presentation for advisor prospects',
    personas: ['advisor'],
    tags: ['sales', 'swag', 'gps'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    status: 'active',
    route: '/sales/advisor-deck'
  },
  {
    id: 'client-family-deck',
    title: 'Client Family Presentation',
    description: 'Family office value proposition and legacy planning',
    personas: ['client', 'family'],
    tags: ['family', 'legacy', 'wealth'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    status: 'active',
    route: '/family/client-deck'
  },
  {
    id: 'accountant-deck',
    title: 'CPA & Accountant Marketing Deck',
    description: 'Tax optimization and compliance tools showcase',
    personas: ['accountant', 'cpa'],
    tags: ['tax', 'compliance', 'accounting'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    status: 'active',
    route: '/accountant/deck'
  },
  {
    id: 'estate-attorney-deck',
    title: 'Estate Attorney Marketing Deck',
    description: 'Estate planning tools and document management',
    personas: ['attorney', 'estate'],
    tags: ['estate', 'legal', 'documents'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    status: 'active',
    route: '/estate-attorney/marketing-deck'
  },
  {
    id: 'litigation-attorney-deck',
    title: 'Litigation Attorney Marketing Deck',
    description: 'Case management and litigation support tools',
    personas: ['attorney', 'litigation'],
    tags: ['litigation', 'legal', 'case-management'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    status: 'active',
    route: '/litigation-attorney/marketing-deck'
  },
  {
    id: 'athlete-wealth-deck',
    title: 'Athlete NIL Wealth Deck',
    description: 'Wealth management for athletes and NIL opportunities',
    personas: ['athlete', 'sports'],
    tags: ['nil', 'sports', 'wealth'],
    fileType: 'pptx',
    owner: 'Admin',
    createdAt: '2023-12-28T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    status: 'active',
    route: '/athletes/wealth-deck'
  }
];

const personaOptions = [
  'advisor', 'client', 'family', 'accountant', 'cpa', 'attorney', 'estate', 
  'litigation', 'insurance', 'realtor', 'healthcare', 'coach', 'athlete', 'sports'
];

const fileTypeIcons = {
  pptx: Presentation,
  pdf: FileText,
  canva: ExternalLink,
  figma: ExternalLink
};

const getFileTypeIcon = (fileType: string) => {
  const IconComponent = fileTypeIcons[fileType as keyof typeof fileTypeIcons] || FileText;
  return <IconComponent className="h-4 w-4" />;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function DeckHub() {
  const [decks, setDecks] = useState<Deck[]>(mockDecks);
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>(mockDecks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  // Filter decks based on search and filters
  useEffect(() => {
    let filtered = decks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(deck => 
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Persona filter
    if (selectedPersonas.length > 0) {
      filtered = filtered.filter(deck =>
        deck.personas.some(persona => selectedPersonas.includes(persona))
      );
    }

    // File type filter
    if (selectedFileTypes.length > 0) {
      filtered = filtered.filter(deck =>
        selectedFileTypes.includes(deck.fileType)
      );
    }

    setFilteredDecks(filtered);
  }, [decks, searchQuery, selectedPersonas, selectedFileTypes]);

  const togglePersonaFilter = (persona: string) => {
    setSelectedPersonas(prev =>
      prev.includes(persona)
        ? prev.filter(p => p !== persona)
        : [...prev, persona]
    );
  };

  const toggleFileTypeFilter = (fileType: string) => {
    setSelectedFileTypes(prev =>
      prev.includes(fileType)
        ? prev.filter(ft => ft !== fileType)
        : [...prev, fileType]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPersonas([]);
    setSelectedFileTypes([]);
  };

  const handlePreview = (deck: Deck) => {
    if (deck.route) {
      window.open(deck.route, '_blank');
    }
  };

  const handleEdit = (deck: Deck) => {
    // Navigate to edit page or open edit modal
    console.log('Edit deck:', deck.id);
  };

  const handleShare = (deck: Deck) => {
    // Generate share link and copy to clipboard
    const shareUrl = `${window.location.origin}${deck.route}`;
    navigator.clipboard.writeText(shareUrl);
    // Show toast notification
  };

  const handleDownload = (deck: Deck) => {
    // Trigger download
    console.log('Download deck:', deck.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deck Hub</h1>
            <p className="text-muted-foreground">
              Centralized repository for all presentation decks and marketing materials
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Deck
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{decks.length}</div>
              <div className="text-sm text-muted-foreground">Total Decks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{decks.filter(d => d.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{new Set(decks.flatMap(d => d.personas)).size}</div>
              <div className="text-sm text-muted-foreground">Personas Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{decks.filter(d => d.updatedAt > '2024-01-10').length}</div>
              <div className="text-sm text-muted-foreground">Recently Updated</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <Label className="text-sm font-medium">Personas:</Label>
          {personaOptions.slice(0, 8).map((persona) => (
            <Badge
              key={persona}
              variant={selectedPersonas.includes(persona) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => togglePersonaFilter(persona)}
            >
              {persona}
            </Badge>
          ))}
          
          <Separator orientation="vertical" className="mx-2 h-6" />
          
          <Label className="text-sm font-medium">File Types:</Label>
          {['pptx', 'pdf', 'canva', 'figma'].map((fileType) => (
            <Badge
              key={fileType}
              variant={selectedFileTypes.includes(fileType) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFileTypeFilter(fileType)}
            >
              {getFileTypeIcon(fileType)}
              <span className="ml-1">{fileType.toUpperCase()}</span>
            </Badge>
          ))}

          {(selectedPersonas.length > 0 || selectedFileTypes.length > 0 || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>

        <TabsContent value="grid">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <Card key={deck.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileTypeIcon(deck.fileType)}
                      <Badge variant="outline">{deck.fileType.toUpperCase()}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{deck.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {deck.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Personas */}
                  <div className="flex flex-wrap gap-1">
                    {deck.personas.map((persona) => (
                      <Badge key={persona} variant="secondary" className="text-xs">
                        {persona}
                      </Badge>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {deck.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {deck.owner}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated {formatDate(deck.updatedAt)}
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(deck)}
                      disabled={!deck.route}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(deck)}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDecks.length === 0 && (
            <div className="text-center py-12">
              <Presentation className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No decks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedPersonas.length > 0 || selectedFileTypes.length > 0
                  ? "Try adjusting your search or filters"
                  : "Upload your first deck to get started"
                }
              </p>
              {!(searchQuery || selectedPersonas.length > 0 || selectedFileTypes.length > 0) && (
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Deck
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Decks</CardTitle>
              <CardDescription>
                Detailed list view of all presentation decks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDecks.map((deck) => (
                  <div key={deck.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        {getFileTypeIcon(deck.fileType)}
                        <Badge variant="outline" className="text-xs">{deck.fileType.toUpperCase()}</Badge>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{deck.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {deck.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {deck.personas.slice(0, 3).map((persona) => (
                          <Badge key={persona} variant="secondary" className="text-xs">
                            {persona}
                          </Badge>
                        ))}
                        {deck.personas.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{deck.personas.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {formatDate(deck.updatedAt)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(deck)}
                        disabled={!deck.route}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(deck)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(deck)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(deck)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-5 w-5 mr-2" />
                  Sales Materials
                </CardTitle>
                <CardDescription>
                  Sales and marketing presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {decks.filter(d => d.tags.includes('sales')).length}
                </div>
                <p className="text-sm text-muted-foreground">decks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-5 w-5 mr-2" />
                  Professional Tools
                </CardTitle>
                <CardDescription>
                  Presentations for professional personas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {decks.filter(d => 
                    d.personas.some(p => ['advisor', 'accountant', 'attorney'].includes(p))
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground">decks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-5 w-5 mr-2" />
                  Client Materials
                </CardTitle>
                <CardDescription>
                  Client-facing presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {decks.filter(d => 
                    d.personas.some(p => ['client', 'family'].includes(p))
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground">decks</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature Flag Notice */}
      <Alert className="mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Development Mode:</strong> This Deck Hub is currently displaying static demo data. 
          In production, decks will be stored in Supabase and support full CRUD operations.
        </AlertDescription>
      </Alert>
    </div>
  );
}