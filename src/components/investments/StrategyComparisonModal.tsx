import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, ArrowUpDown, Check, AlertCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { StrategyDetails } from "./StrategyDetailModal";

interface StrategyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategies: StrategyDetails[];
  onScheduleMeeting: (strategy: StrategyDetails) => void;
}

export const StrategyComparisonModal: React.FC<StrategyComparisonModalProps> = ({
  isOpen,
  onClose,
  strategies,
  onScheduleMeeting
}) => {
  const { userProfile } = useUser();

  // Track comparison view
  React.useEffect(() => {
    if (isOpen && strategies.length > 0 && userProfile?.id) {
      trackComparison(strategies.map(s => s.id), userProfile.id);
    }
  }, [isOpen, strategies, userProfile?.id]);

  const trackComparison = async (strategyIds: string[], userId: string) => {
    if (!userId || strategyIds.length === 0) return;
    
    try {
      // Insert comparison record
      await supabase.from('strategy_comparisons').insert({
        user_id: userId,
        strategies: strategyIds
      });
      
      // Also track as engagement event
      await supabase.from('strategy_engagement_tracking').insert(
        strategyIds.map(strategyId => ({
          user_id: userId,
          strategy_id: strategyId,
          event_type: 'comparison',
          metadata: {
            compared_with: strategyIds.filter(id => id !== strategyId)
          }
        }))
      );
    } catch (error) {
      console.error('Error tracking comparison:', error);
    }
  };

  const handleDownloadComparison = () => {
    // In a real app, this would generate and download a PDF comparison
    console.log('Downloading comparison for strategies:', strategies.map(s => s.name).join(', '));
  };

  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Medium-High': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'High': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[level] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  // Format performance for better visual comparison
  const formatPerformance = (perf: string) => {
    if (!perf) return '';
    const num = parseFloat(perf.replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return perf;
    
    return (
      <span className={num >= 0 ? "text-emerald-400" : "text-red-400"}>
        {num >= 0 ? '+' : ''}{num.toFixed(1)}%
      </span>
    );
  };

  if (strategies.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 text-white border-slate-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">
              Strategy Comparison
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-3 text-left text-slate-400 font-medium border-b border-slate-800 min-w-[120px]">
                  Feature
                </th>
                {strategies.map((strategy) => (
                  <th key={strategy.id} className="p-3 text-left text-white font-semibold border-b border-slate-800 min-w-[200px]">
                    {strategy.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Strategy Type */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Type</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {strategy.strategy_type}
                    </Badge>
                  </td>
                ))}
              </tr>
              
              {/* Risk Level */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Risk Level</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">
                    <Badge variant="outline" className={getRiskLevelColor(strategy.risk_level)}>
                      {strategy.risk_level}
                    </Badge>
                  </td>
                ))}
              </tr>
              
              {/* Performance */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Performance</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3 font-semibold">
                    {formatPerformance(strategy.performance)}
                  </td>
                ))}
              </tr>
              
              {/* Benchmark */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Benchmark</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">{strategy.benchmark}</td>
                ))}
              </tr>
              
              {/* Allocation */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Allocation</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">{strategy.allocation}</td>
                ))}
              </tr>
              
              {/* Manager */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Manager</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">{strategy.manager}</td>
                ))}
              </tr>
              
              {/* Minimum Investment */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Min. Investment</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">{strategy.minimum_investment || "N/A"}</td>
                ))}
              </tr>
              
              {/* Premium Status */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Premium</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">
                    {strategy.premium_locked ? 
                      <Check className="h-5 w-5 text-purple-400" /> : 
                      <X className="h-5 w-5 text-slate-600" />
                    }
                  </td>
                ))}
              </tr>
              
              {/* Featured Status */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-slate-400 font-medium">Featured</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">
                    {strategy.featured ? 
                      <Check className="h-5 w-5 text-yellow-400" /> : 
                      <X className="h-5 w-5 text-slate-600" />
                    }
                  </td>
                ))}
              </tr>
              
              {/* Actions */}
              <tr>
                <td className="p-3 text-slate-400 font-medium">Actions</td>
                {strategies.map((strategy) => (
                  <td key={strategy.id} className="p-3">
                    <Button 
                      onClick={() => onScheduleMeeting(strategy)}
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Schedule Call
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="bg-slate-800 border-slate-700 hover:bg-slate-700 flex-1"
            onClick={handleDownloadComparison}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Comparison
          </Button>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 bg-slate-900/50 rounded-lg border border-slate-800 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white mb-1">Comparison Disclaimer</p>
              <p>
                This comparison is provided for informational purposes only. Past performance is not indicative 
                of future results. Always consult with a financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};