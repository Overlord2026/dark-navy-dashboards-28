import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export interface Agency {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  specializations: string[];
  average_rating?: number;
  total_reviews?: number;
  average_cpl?: number;
  conversion_rate?: number;
  is_featured?: boolean;
  contact_email: string;
}

interface AgencyCardProps {
  agency: Agency;
  onBookCampaign: (agencyId: string) => void;
  onViewDetails: (agencyId: string) => void;
}

export const AgencyCard: React.FC<AgencyCardProps> = ({
  agency,
  onBookCampaign,
  onViewDetails
}) => {
  const {
    id,
    name,
    logo_url,
    description,
    specializations,
    average_rating = 0,
    total_reviews = 0,
    average_cpl = 0,
    conversion_rate = 0,
    is_featured = false
  } = agency;

  return (
    <Card className={`relative group hover:shadow-lg transition-all duration-300 ${
      is_featured ? 'ring-2 ring-gold-primary shadow-gold-primary/20' : ''
    }`}>
      {is_featured && (
        <Badge className="absolute -top-2 -right-2 bg-gold-primary text-primary-foreground">
          Featured
        </Badge>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold-light/20 to-gold-primary/20 flex items-center justify-center border border-gold-light/30">
            {logo_url ? (
              <img src={logo_url} alt={name} className="w-12 h-12 rounded object-cover" />
            ) : (
              <div className="w-12 h-12 rounded bg-gold-primary/10 flex items-center justify-center">
                <span className="text-gold-primary font-semibold text-lg">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-gold-primary transition-colors">
              {name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-primary text-gold-primary" />
                <span className="text-sm font-medium text-foreground">
                  {average_rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({total_reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {specializations.slice(0, 3).map((spec) => (
            <Badge key={spec} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
          {specializations.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{specializations.length - 3} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Avg CPL</div>
              <div className="font-semibold text-sm">
                ${average_cpl.toFixed(0)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Conversion</div>
              <div className="font-semibold text-sm">
                {(conversion_rate * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(id)}
          >
            View Details
          </Button>
          <Button 
            variant="marketplace" 
            size="sm" 
            className="flex-1"
            onClick={() => onBookCampaign(id)}
          >
            Book Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};