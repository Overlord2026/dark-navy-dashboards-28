import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Star, 
  DollarSign,
  Camera,
  Share2,
  Edit,
  Crown
} from "lucide-react";
import { useCelebration } from "@/hooks/useCelebration";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: 'primary' | 'vacation' | 'rental' | 'business';
  listingType?: 'fsbo' | 'pro' | 'private';
  featured?: boolean;
  images?: string[];
  views?: number;
  listedDate: string;
  status: 'active' | 'pending' | 'sold';
  owner: boolean;
}

interface EnhancedPropertyCardProps {
  property: Property;
  onEdit?: () => void;
  onShare?: () => void;
  onView?: () => void;
  onFeature?: () => void;
}

export const EnhancedPropertyCard: React.FC<EnhancedPropertyCardProps> = ({
  property,
  onEdit,
  onShare,
  onView,
  onFeature
}) => {
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'vacation': return 'bg-purple-100 text-purple-800';
      case 'rental': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFeatureProperty = () => {
    if (onFeature) {
      onFeature();
      triggerCelebration('milestone', 'Property Featured!');
    }
  };

  return (
    <>
      <Card className={`
        group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        ${property.featured ? 'ring-2 ring-gradient-gold ring-opacity-50 animate-pulse' : ''}
        ${property.featured ? 'shadow-[0_0_20px_rgba(255,215,0,0.3)]' : ''}
      `}>
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-gold text-gold-foreground flex items-center gap-1 animate-bounce">
              <Crown className="h-3 w-3" />
              Featured
            </Badge>
          </div>
        )}

        {/* Listing Type Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge 
            variant={property.listingType === 'fsbo' ? 'default' : 'secondary'}
            className={property.listingType === 'fsbo' ? 'bg-emerald-600 text-white' : ''}
          >
            {property.listingType === 'fsbo' ? 'FSBO' : 
             property.listingType === 'pro' ? 'Pro Listed' : 'Private'}
          </Badge>
        </div>

        {/* Property Image */}
        <div className="relative h-48 bg-gradient-subtle rounded-t-lg overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-subtle flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* View Count Overlay */}
          {property.views && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {property.views} views
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {property.address}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Property Details */}
          <div className="flex items-center justify-between">
            <Badge className={getTypeColor(property.type)}>
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Listed {property.listedDate}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {property.owner ? (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onEdit}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {!property.featured && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-gold hover:bg-gradient-gold/90"
                    onClick={handleFeatureProperty}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={onView}
                className="flex-1"
              >
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {CelebrationComponent}
    </>
  );
};