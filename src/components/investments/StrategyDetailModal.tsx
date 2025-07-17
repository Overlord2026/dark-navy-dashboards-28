import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Download, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  BarChart, 
  DollarSign, 
  FileText,
  Calendar,
  Link,
  HeartHandshake
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export interface StrategyDetails {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  risk_level: string;
  benchmark: string;
  performance: string;
  allocation: string;
  manager: string;
  minimum_investment?: string;
  tags: string[];
  premium_locked: boolean;
  featured: boolean;
  educationalContent?: {
    id: string;
    title: string;
    content_type: string;
    url?: string;
  }[];
}

interface StrategyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: StrategyDetails | null;
  onScheduleMeeting: () => void;
  onExpressInterest: () => void;
}

export const StrategyDetailModal: React.FC<StrategyDetailModalProps> = ({
  isOpen,
  onClose,
  strategy,
  onScheduleMeeting,
  onExpressInterest
}) => {
  const { userProfile } = useUser();

  if (!strategy) {
    return null;
  }

  const isProspect = userProfile?.role !== 'client';

  // Track viewing of strategy details
  React.useEffect(() => {
    if (isOpen && strategy && userProfile?.id) {
      trackStrategyView(strategy.id, userProfile.id);
    }
  }, [isOpen, strategy, userProfile?.id]);

  const trackStrategyView = async (strategyId: string, userId: string) => {
    try {
      await supabase.from('strategy_engagement_tracking').insert({
        user_id: userId,
        strategy_id: strategyId,
        event_type: 'view_details',
        metadata: {
          source: 'detail_modal'
        }
      });
    } catch (error) {
      console.error('Error tracking strategy view:', error);
    }
  };

  const handleDownloadFactSheet = async () => {
    if (!userProfile?.id || !strategy) return;
    
    try {
      await supabase.from('strategy_engagement_tracking').insert({
        user_id: userProfile.id,
        strategy_id: strategy.id,
        event_type: 'download_factsheet',
        metadata: {}
      });
      
      // In a real app, this would download the fact sheet
      console.log(`Downloading fact sheet for ${strategy.name}`);
    } catch (error) {
      console.error('Error tracking factsheet download:', error);
    }
  };

  // Get appropriate CTA text based on user type
  const getCtaText = () => {
    if (isProspect) {
      return "Schedule a Discovery Call";
    }
    return "Schedule Portfolio Review";
  };

  const getInterestText = () => {
    if (isProspect) {
      return "See If You Qualify";
    }
    return "Express Interest";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 text-white border-slate-800">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-white">
                {strategy.name}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  {strategy.strategy_type}
                </Badge>
                <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                  {strategy.risk_level}
                </Badge>
                {strategy.featured && (
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Featured
                  </Badge>
                )}
                {strategy.premium_locked && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-semibold text-2xl">{strategy.performance}</div>
              <div className="text-slate-400 text-sm">Performance</div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Overview</h3>
            <p className="text-slate-300 leading-relaxed">{strategy.description}</p>
          </div>
          
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <BarChart className="h-4 w-4 text-primary" />
                <span className="text-sm">Benchmark</span>
              </div>
              <p className="font-medium">{strategy.benchmark}</p>
            </div>
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <span className="text-sm">Manager</span>
              </div>
              <p className="font-medium">{strategy.manager}</p>
            </div>
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm">Allocation</span>
              </div>
              <p className="font-medium">{strategy.allocation}</p>
            </div>
            {strategy.minimum_investment && (
              <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm">Minimum Investment</span>
                </div>
                <p className="font-medium">{strategy.minimum_investment}</p>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {strategy.tags && strategy.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {strategy.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Educational Resources */}
          {strategy.educationalContent && strategy.educationalContent.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resources</h3>
              <div className="grid gap-2">
                {strategy.educationalContent.map((content) => (
                  <div 
                    key={content.id}
                    className="flex items-center justify-between bg-slate-900 rounded-lg border border-slate-800 p-3"
                  >
                    <div className="flex items-center gap-2">
                      {content.content_type === 'pdf' && <FileText className="h-4 w-4 text-red-400" />}
                      {content.content_type === 'video' && <Calendar className="h-4 w-4 text-blue-400" />}
                      {content.content_type === 'link' && <Link className="h-4 w-4 text-green-400" />}
                      <span className="text-sm">{content.title}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Download Fact Sheet */}
            <Button 
              variant="outline" 
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
              onClick={handleDownloadFactSheet}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Fact Sheet
            </Button>
            
            {/* Schedule Meeting */}
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={onScheduleMeeting}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {getCtaText()}
            </Button>
          </div>
          
          {/* Express Interest */}
          <Button 
            variant="default" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            onClick={onExpressInterest}
          >
            <HeartHandshake className="h-4 w-4 mr-2" />
            {getInterestText()}
          </Button>
          
          {/* Suitability Notice */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-white mb-1">Suitability Notice</p>
                <p>
                  Past performance is no guarantee of future results. This strategy may not be suitable 
                  for all investors. Please review the factsheet for additional disclosures and risks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};