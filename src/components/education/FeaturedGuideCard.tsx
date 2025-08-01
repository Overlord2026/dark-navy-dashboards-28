import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Download, Share, Star, Clock } from 'lucide-react';

interface FeaturedGuideCardProps {
  title: string;
  author: string;
  description: string;
  type: 'guide' | 'course' | 'ebook' | 'video';
  coverImage?: string;
  rating?: number;
  duration?: string;
  isStaffPick?: boolean;
  onOpen: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export function FeaturedGuideCard({
  title,
  author,
  description,
  type,
  coverImage,
  rating = 5,
  duration,
  isStaffPick,
  onOpen,
  onDownload,
  onShare
}: FeaturedGuideCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'ebook':
        return <Download className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'video':
        return 'Watch Video';
      case 'ebook':
        return 'Download eBook';
      case 'course':
        return 'Start Course';
      default:
        return 'Read Guide';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'ebook':
        return 'bg-blue-100 text-blue-700';
      case 'course':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-primary/40"
              >
                {getTypeIcon()}
              </motion.div>
            </div>
          )}
          
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isStaffPick && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                Staff Pick
              </Badge>
            )}
            <Badge className={getTypeColor()}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>

          {duration && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-black/50 text-white border-none">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </Badge>
            </div>
          )}

          {/* Hover Actions */}
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <Button
              onClick={onOpen}
              className="bg-white text-primary hover:bg-white/90"
            >
              {getTypeIcon()}
              {getTypeLabel()}
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                by {author}
              </p>
            </div>
            
            {rating && (
              <div className="flex items-center gap-1 ml-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={onOpen}
              className="flex-1"
            >
              {getTypeIcon()}
              {getTypeLabel()}
            </Button>
            
            <div className="flex gap-1">
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownload}
                  className="p-2"
                  aria-label="Download as PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="p-2"
                  aria-label="Share with CPA"
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}