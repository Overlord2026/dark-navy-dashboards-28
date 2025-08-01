import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, PlayCircle, FileText, ShoppingCart } from 'lucide-react';

interface ContentLink {
  type: 'amazon' | 'pdf' | 'vimeo' | 'guide';
  label: string;
  url: string;
}

interface TaxEducationCardProps {
  title: string;
  summary: string;
  coverImage: string;
  tags: string[];
  roles: string[];
  links: ContentLink[];
  featured?: boolean;
}

export const TaxEducationCard: React.FC<TaxEducationCardProps> = ({
  title,
  summary,
  coverImage,
  tags,
  roles,
  links,
  featured = false
}) => {
  const getIcon = (type: ContentLink['type']) => {
    switch (type) {
      case 'amazon': return <ShoppingCart className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'vimeo': return <PlayCircle className="h-4 w-4" />;
      case 'guide': return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getButtonVariant = (type: ContentLink['type']) => {
    switch (type) {
      case 'amazon': return 'default';
      case 'vimeo': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card className={`h-full transition-shadow hover:shadow-lg ${featured ? 'border-primary' : ''}`}>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role} variant="outline" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <Button
              key={index}
              variant={getButtonVariant(link.type)}
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open(link.url, '_blank')}
            >
              {getIcon(link.type)}
              {link.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};