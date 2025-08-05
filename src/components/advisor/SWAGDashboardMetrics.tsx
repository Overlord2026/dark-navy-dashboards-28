import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Trophy, Star, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface SWAGMetrics {
  totalLeads: number;
  goldSWAGLeads: number;
  silverSWAGLeads: number;
  bronzeSWAGLeads: number;
  averageSWAGScore: number;
  conversionByBand: {
    gold: number;
    silver: number;
    bronze: number;
  };
  verifiedSWAGLeads: number;
}

interface SWAGDashboardMetricsProps {
  metrics: SWAGMetrics;
}

export function SWAGDashboardMetrics({ metrics }: SWAGDashboardMetricsProps) {
  const getBandIcon = (band: string) => {
    switch (band) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '⭐';
    }
  };

  const getSWAGGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-yellow-600' };
    if (score >= 80) return { grade: 'A', color: 'text-yellow-600' };
    if (score >= 70) return { grade: 'B', color: 'text-gray-600' };
    if (score >= 60) return { grade: 'C', color: 'text-amber-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  const { grade, color } = getSWAGGrade(metrics.averageSWAGScore);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total SWAG Score Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-yellow-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100/30 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SWAG Lead Score™ Average</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`text-3xl font-bold ${color}`}>{metrics.averageSWAGScore}</div>
              <Badge className="bg-yellow-100 text-yellow-800">
                Grade {grade}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              🌟 Got SWAG? Strategic Wealth Alpha GPS™
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gold SWAG Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden border-yellow-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100/20 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold SWAG™ Leads</CardTitle>
            <span className="text-lg">🥇</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.goldSWAGLeads}</div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">{metrics.conversionByBand.gold}% conversion</span>
            </div>
            <p className="text-xs text-muted-foreground">Premium prospects (85+ score)</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Silver SWAG Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="relative overflow-hidden border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Silver SWAG™ Leads</CardTitle>
            <span className="text-lg">🥈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{metrics.silverSWAGLeads}</div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">{metrics.conversionByBand.silver}% conversion</span>
            </div>
            <p className="text-xs text-muted-foreground">Quality prospects (70-84 score)</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verified SWAG Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="relative overflow-hidden border-emerald-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified SWAG™ Scores</CardTitle>
            <Star className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{metrics.verifiedSWAGLeads}</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              Plaid Connected
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Verified financial data
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}