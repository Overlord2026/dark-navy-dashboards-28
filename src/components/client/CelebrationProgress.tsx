import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, TrendingUp } from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

export const CelebrationProgress = () => {
  const { triggerCelebration } = useCelebration();
  
  const progressStats = {
    percentile: 80,
    message: "You're ahead of 80% of families—keep it up!",
    achievement: "Emergency Fund Complete"
  };

  const handleCelebrate = () => {
    triggerCelebration('milestone', progressStats.achievement);
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <Trophy className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                Celebrate Your Progress
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                {progressStats.message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              {progressStats.percentile}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCelebrate}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            🎉 Celebrate Achievement
          </button>
        </div>
      </CardContent>
    </Card>
  );
};