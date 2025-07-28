import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  Clock, 
  Shield, 
  Award,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Globe,
  Heart,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { useLending } from '@/hooks/useLending';
import { toast } from 'sonner';

interface LendingPartner {
  id: string;
  name: string;
  partner_type: string;
  rates_from: number;
  rates_to: number;
  minimum_loan: number;
  maximum_loan: number;
  approval_time: string;
  credit_score_min: number;
  specialties: string[];
  rating: number;
  reviews_count: number;
  compliance_rating: string;
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  features: string[];
  loan_products: string[];
  description: string;
  best_match_score?: number;
  match_reasons?: string[];
}

const PARTNER_TYPES = ['Bank', 'Credit Union', 'Online Lender', 'Specialty Lender'];
const LOAN_PRODUCTS = ['Personal Loan', 'Home Mortgage', 'Auto Loan', 'Business Loan', 'Home Equity'];
const SORT_OPTIONS = [
  { value: 'best_match', label: 'Best Match' },
  { value: 'lowest_rate', label: 'Lowest Rate' },
  { value: 'highest_rating', label: 'Highest Rating' },
  { value: 'fastest_approval', label: 'Fastest Approval' },
  { value: 'highest_loan_amount', label: 'Highest Loan Amount' }
];

export const PartnerComparisonPage: React.FC = () => {
  const { partners } = useLending();
  const [filteredPartners, setFilteredPartners] = useState<LendingPartner[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    partnerTypes: [] as string[],
    loanProducts: [] as string[],
    minLoanAmount: [1000],
    maxLoanAmount: [1000000],
    minRating: [3],
    maxRate: [15],
    creditScoreMin: [600]
  });
  const [sortBy, setSortBy] = useState('best_match');
  const [showFilters, setShowFilters] = useState(false);
  const [favoritePartners, setFavoritePartners] = useState<string[]>([]);

  useEffect(() => {
    // Mock partners with match scores for demonstration
    const mockPartners: LendingPartner[] = [
      {
        id: '1',
        name: 'Premier National Bank',
        partner_type: 'Bank',
        rates_from: 4.2,
        rates_to: 8.9,
        minimum_loan: 5000,
        maximum_loan: 500000,
        approval_time: '24-48 hours',
        credit_score_min: 680,
        specialties: ['Home Mortgages', 'Personal Loans'],
        rating: 4.7,
        reviews_count: 2847,
        compliance_rating: 'A+',
        contact_info: {
          phone: '(555) 123-4567',
          email: 'loans@premiernational.com',
          website: 'www.premiernational.com'
        },
        features: ['No origination fees', 'Pre-approval in minutes', 'Rate lock guarantee'],
        loan_products: ['Home Mortgage', 'Personal Loan', 'Auto Loan'],
        description: 'Premier National Bank has been serving customers for over 50 years with competitive rates and exceptional service.',
        best_match_score: 95,
        match_reasons: ['Excellent rates for your credit score', 'Fast approval process', 'Specialized in your loan type']
      },
      {
        id: '2',
        name: 'TechCredit Online',
        partner_type: 'Online Lender',
        rates_from: 3.8,
        rates_to: 12.5,
        minimum_loan: 1000,
        maximum_loan: 100000,
        approval_time: '2-4 hours',
        credit_score_min: 640,
        specialties: ['Personal Loans', 'Debt Consolidation'],
        rating: 4.5,
        reviews_count: 1523,
        compliance_rating: 'A',
        contact_info: {
          phone: '(555) 987-6543',
          email: 'support@techcredit.com',
          website: 'www.techcredit.com'
        },
        features: ['100% online process', 'Instant pre-qualification', 'Flexible terms'],
        loan_products: ['Personal Loan', 'Business Loan'],
        description: 'TechCredit offers modern lending solutions with cutting-edge technology and competitive rates.',
        best_match_score: 88,
        match_reasons: ['Ultra-fast approval', 'Lower credit score requirements', 'Fully digital experience']
      },
      {
        id: '3',
        name: 'Community First Credit Union',
        partner_type: 'Credit Union',
        rates_from: 4.0,
        rates_to: 9.2,
        minimum_loan: 2500,
        maximum_loan: 250000,
        approval_time: '1-3 days',
        credit_score_min: 650,
        specialties: ['Auto Loans', 'Home Equity'],
        rating: 4.8,
        reviews_count: 896,
        compliance_rating: 'A+',
        contact_info: {
          phone: '(555) 456-7890',
          email: 'lending@communityfirst.org',
          website: 'www.communityfirst.org'
        },
        features: ['Member-owned', 'Lower fees', 'Personal service'],
        loan_products: ['Auto Loan', 'Home Equity', 'Personal Loan'],
        description: 'Member-owned credit union focused on providing value and personalized service to our community.',
        best_match_score: 82,
        match_reasons: ['Excellent customer service', 'Lower fees than banks', 'Community-focused approach']
      }
    ];

    setFilteredPartners(mockPartners);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy]);

  const applyFilters = () => {
    let filtered = [...filteredPartners];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        partner.specialties.some(s => s.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Partner type filter
    if (filters.partnerTypes.length > 0) {
      filtered = filtered.filter(partner =>
        filters.partnerTypes.includes(partner.partner_type)
      );
    }

    // Loan product filter
    if (filters.loanProducts.length > 0) {
      filtered = filtered.filter(partner =>
        filters.loanProducts.some(product =>
          partner.loan_products.includes(product)
        )
      );
    }

    // Loan amount filter
    filtered = filtered.filter(partner =>
      partner.maximum_loan >= filters.minLoanAmount[0] &&
      partner.minimum_loan <= filters.maxLoanAmount[0]
    );

    // Rating filter
    filtered = filtered.filter(partner =>
      partner.rating >= filters.minRating[0]
    );

    // Rate filter
    filtered = filtered.filter(partner =>
      partner.rates_from <= filters.maxRate[0]
    );

    // Credit score filter
    filtered = filtered.filter(partner =>
      partner.credit_score_min <= filters.creditScoreMin[0]
    );

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'best_match':
          return (b.best_match_score || 0) - (a.best_match_score || 0);
        case 'lowest_rate':
          return a.rates_from - b.rates_from;
        case 'highest_rating':
          return b.rating - a.rating;
        case 'fastest_approval':
          return a.approval_time.localeCompare(b.approval_time);
        case 'highest_loan_amount':
          return b.maximum_loan - a.maximum_loan;
        default:
          return 0;
      }
    });

    setFilteredPartners(filtered);
  };

  const toggleFavorite = (partnerId: string) => {
    setFavoritePartners(prev =>
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePartnerTypeChange = (type: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      partnerTypes: checked
        ? [...prev.partnerTypes, type]
        : prev.partnerTypes.filter(t => t !== type)
    }));
  };

  const handleLoanProductChange = (product: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      loanProducts: checked
        ? [...prev.loanProducts, product]
        : prev.loanProducts.filter(p => p !== product)
    }));
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getComplianceColor = (rating: string) => {
    switch (rating) {
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-blue-100 text-blue-800';
      case 'B+':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compare Lending Partners</h1>
        <p className="text-muted-foreground">
          Find the best lending partner for your needs with our advanced comparison tools
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners by name or specialty..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Partner Types */}
              <div>
                <h3 className="font-medium mb-3">Partner Type</h3>
                <div className="space-y-2">
                  {PARTNER_TYPES.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.partnerTypes.includes(type)}
                        onCheckedChange={(checked) => handlePartnerTypeChange(type, checked as boolean)}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan Products */}
              <div>
                <h3 className="font-medium mb-3">Loan Products</h3>
                <div className="space-y-2">
                  {LOAN_PRODUCTS.map(product => (
                    <div key={product} className="flex items-center space-x-2">
                      <Checkbox
                        id={product}
                        checked={filters.loanProducts.includes(product)}
                        onCheckedChange={(checked) => handleLoanProductChange(product, checked as boolean)}
                      />
                      <label htmlFor={product} className="text-sm">{product}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating and Rate Filters */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimum Rating: {filters.minRating[0]}★
                  </label>
                  <Slider
                    value={filters.minRating}
                    onValueChange={(value) => handleFilterChange('minRating', value)}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Rate: {filters.maxRate[0]}%
                  </label>
                  <Slider
                    value={filters.maxRate}
                    onValueChange={(value) => handleFilterChange('maxRate', value)}
                    max={20}
                    min={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredPartners.length} lending partners
          {filters.search && ` for "${filters.search}"`}
        </p>
      </div>

      {/* Partners List */}
      <div className="space-y-6">
        {filteredPartners.map((partner, index) => (
          <Card key={partner.id} className="relative overflow-hidden">
            {partner.best_match_score && partner.best_match_score > 85 && (
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Award className="h-3 w-3" />
                  Best Match
                </div>
              </div>
            )}
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Partner Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{partner.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(partner.id)}
                          className="p-1 h-6 w-6"
                        >
                          <Heart className={`h-4 w-4 ${
                            favoritePartners.includes(partner.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-muted-foreground'
                          }`} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="secondary">{partner.partner_type}</Badge>
                        <div className="flex items-center gap-1">
                          {getRatingStars(partner.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            {partner.rating} ({partner.reviews_count} reviews)
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {partner.description}
                      </p>
                    </div>
                  </div>

                  {partner.match_reasons && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-green-700">Why this is a great match:</h4>
                      <ul className="text-sm space-y-1">
                        {partner.match_reasons.map((reason, i) => (
                          <li key={i} className="flex items-center gap-2 text-green-600">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {partner.features.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Rates and Terms */}
                <div>
                  <h4 className="font-medium mb-3">Rates & Terms</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold text-lg">
                        {partner.rates_from}% - {partner.rates_to}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Range</p>
                      <p className="font-medium">
                        ${partner.minimum_loan.toLocaleString()} - ${partner.maximum_loan.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Approval Time</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {partner.approval_time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Min Credit Score</p>
                      <p className="font-medium">{partner.credit_score_min}+</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Compliance Rating</p>
                      <Badge className={getComplianceColor(partner.compliance_rating)}>
                        {partner.compliance_rating}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <div className="space-y-3">
                    <Button className="w-full">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="w-full">
                      Get Quote
                    </Button>
                    
                    <div className="pt-3 space-y-2 text-sm">
                      {partner.contact_info.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{partner.contact_info.phone}</span>
                        </div>
                      )}
                      {partner.contact_info.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{partner.contact_info.email}</span>
                        </div>
                      )}
                      {partner.contact_info.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={`https://${partner.contact_info.website}`} 
                             className="text-xs text-primary hover:underline"
                             target="_blank" rel="noopener noreferrer">
                            {partner.contact_info.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No partners found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find matching partners.
            </p>
            <Button onClick={() => {
              setFilters({
                search: '',
                partnerTypes: [],
                loanProducts: [],
                minLoanAmount: [1000],
                maxLoanAmount: [1000000],
                minRating: [3],
                maxRate: [15],
                creditScoreMin: [600]
              });
            }}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};