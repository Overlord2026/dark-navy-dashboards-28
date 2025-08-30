import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Calendar, Plus, Star } from 'lucide-react';
import { getNilGoals } from '@/fixtures/fixtures.nil';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import NilReceiptsStrip from '@/components/nil/NilReceiptsStrip';
import NILLayout from '@/components/nil/NILLayout';

export default function GoalsPage() {
  const navigate = useNavigate();
  const goals = getNilGoals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'on_track': return 'text-bfo-gold';
      case 'at_risk': return 'text-orange-400';
      default: return 'text-white/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="h-4 w-4" />;
      case 'on_track': return <Star className="h-4 w-4" />;
      case 'at_risk': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <NILLayout title="Goals & Objectives" description="Track your NIL goals and progress">
      <div className="space-y-6 pb-16">
        {/* Header with Demo Badge */}
        <div className="flex justify-between items-center">
          <GoldButton onClick={() => navigate('/nil/offers')} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create New Goal</span>
          </GoldButton>
          <Badge className="bg-bfo-gold/20 text-bfo-gold/70 border-bfo-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Goals Grid */}
        <div className="grid gap-4">
          {goals.map((goal) => (
            <Card 
              key={goal.id} 
              className="bg-[#24313d]/60 border-bfo-gold/40 hover:bg-[#24313d] transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-semibold flex items-center space-x-2">
                    <Target className="h-5 w-5 text-bfo-gold" />
                    <span>{goal.title}</span>
                  </CardTitle>
                  <div className={`flex items-center space-x-1 ${getStatusColor(goal.status)}`}>
                    {getStatusIcon(goal.status)}
                    <span className="text-sm capitalize">{goal.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-white/70">{goal.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Progress</span>
                      <span className="text-bfo-gold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-bfo-black/50 rounded-full h-2">
                      <div 
                        className="bg-bfo-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-white/60">
                        <Calendar className="h-4 w-4" />
                        <span>{goal.deadline}</span>
                      </div>
                      {goal.category && (
                        <Badge variant="outline" className="border-bfo-gold/40 text-bfo-gold">
                          {goal.category}
                        </Badge>
                      )}
                    </div>
                    <GoldOutlineButton
                      onClick={() => navigate(goal.actionPath)}
                      className="text-xs py-1 px-3"
                    >
                      {goal.actionLabel}
                    </GoldOutlineButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <Card className="bg-[#24313d]/60 border-bfo-gold/40">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No goals set yet</p>
              <p className="text-white/40 text-sm mt-2">Create your first NIL goal to get started</p>
              <GoldButton onClick={() => navigate('/nil/offers')} className="mt-4">
                Create Goal
              </GoldButton>
            </CardContent>
          </Card>
        )}
      </div>
      <NilReceiptsStrip />
    </NILLayout>
  );
}