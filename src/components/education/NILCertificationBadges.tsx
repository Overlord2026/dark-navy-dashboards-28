import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Shield, 
  TrendingUp, 
  DollarSign,
  FileText,
  AlertTriangle,
  Heart,
  Users,
  Star,
  Download,
  CheckCircle,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CertificationBadge {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  requirements: string[];
  progress: number;
  color: string;
}

export const NILCertificationBadges: React.FC = () => {
  const badges: CertificationBadge[] = [
    {
      id: 'nil-certified',
      name: 'NIL Smart Money Certified',
      description: 'Complete comprehensive NIL education program',
      icon: Award,
      earned: false,
      requirements: ['Complete all 10 modules', 'Pass all quizzes with 80%+', 'Download certificate'],
      progress: 30,
      color: 'gold'
    },
    {
      id: 'compliance-expert',
      name: 'Compliance Expert',
      description: 'Master NCAA and state NIL regulations',
      icon: Shield,
      earned: true,
      requirements: ['Complete Basics module', 'Pass compliance quiz', 'Review state regulations'],
      progress: 100,
      color: 'blue'
    },
    {
      id: 'brand-builder',
      name: 'Brand Builder',
      description: 'Learn to build and monetize your personal brand',
      icon: TrendingUp,
      earned: false,
      requirements: ['Complete Branding module', 'Create social media plan', 'Pass branding quiz'],
      progress: 60,
      color: 'purple'
    },
    {
      id: 'financial-pro',
      name: 'Financial Pro',
      description: 'Master NIL income management and tax planning',
      icon: DollarSign,
      earned: false,
      requirements: ['Complete Financial module', 'Pass tax scenarios quiz', 'Create budget plan'],
      progress: 45,
      color: 'green'
    },
    {
      id: 'contract-pro',
      name: 'Contract Pro',
      description: 'Navigate contracts and legal agreements',
      icon: FileText,
      earned: false,
      requirements: ['Complete Contracts module', 'Pass contract review quiz', 'Practice red flag identification'],
      progress: 0,
      color: 'orange'
    },
    {
      id: 'risk-manager',
      name: 'Risk Manager',
      description: 'Protect yourself from scams and fraud',
      icon: AlertTriangle,
      earned: false,
      requirements: ['Complete Risk module', 'Pass scam identification quiz', 'Create safety plan'],
      progress: 20,
      color: 'red'
    },
    {
      id: 'future-planner',
      name: 'Future Planner',
      description: 'Plan for life and career after sports',
      icon: Heart,
      earned: false,
      requirements: ['Complete Life After Sports module', 'Create career transition plan', 'Set post-sports goals'],
      progress: 10,
      color: 'pink'
    },
    {
      id: 'team-player',
      name: 'Team Player',
      description: 'Support family and coaching resources',
      icon: Users,
      earned: false,
      requirements: ['Complete Family module', 'Invite a parent or coach', 'Share resources'],
      progress: 80,
      color: 'cyan'
    },
    {
      id: 'community-member',
      name: 'Community Member',
      description: 'Engage with stories and mentor network',
      icon: Star,
      earned: false,
      requirements: ['Watch 5+ athlete stories', 'Connect with a mentor', 'Share your own story'],
      progress: 25,
      color: 'yellow'
    }
  ];

  const getBadgeColorClass = (color: string, earned: boolean) => {
    if (!earned) return 'bg-gray-100 border-gray-200';
    
    const colorMap: Record<string, string> = {
      gold: 'bg-yellow-100 border-yellow-300',
      blue: 'bg-blue-100 border-blue-300',
      purple: 'bg-purple-100 border-purple-300',
      green: 'bg-green-100 border-green-300',
      orange: 'bg-orange-100 border-orange-300',
      red: 'bg-red-100 border-red-300',
      pink: 'bg-pink-100 border-pink-300',
      cyan: 'bg-cyan-100 border-cyan-300',
      yellow: 'bg-yellow-100 border-yellow-300'
    };
    
    return colorMap[color] || 'bg-gray-100 border-gray-200';
  };

  const getIconColorClass = (color: string, earned: boolean) => {
    if (!earned) return 'text-gray-400';
    
    const colorMap: Record<string, string> = {
      gold: 'text-yellow-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      pink: 'text-pink-600',
      cyan: 'text-cyan-600',
      yellow: 'text-yellow-600'
    };
    
    return colorMap[color] || 'text-gray-400';
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const inProgressBadges = badges.filter(badge => !badge.earned && badge.progress > 0);
  const lockedBadges = badges.filter(badge => !badge.earned && badge.progress === 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Certification Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{earnedBadges.length}</div>
              <div className="text-sm text-green-700">Badges Earned</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{inProgressBadges.length}</div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{lockedBadges.length}</div>
              <div className="text-sm text-gray-700">Not Started</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Overall Certification Progress: {Math.round((earnedBadges.length / badges.length) * 100)}%
            </div>
            <Progress value={(earnedBadges.length / badges.length) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 ${getBadgeColorClass(badge.color, badge.earned)}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`h-6 w-6 ${getIconColorClass(badge.color, badge.earned)}`} />
                    <div>
                      <h4 className="font-semibold">{badge.name}</h4>
                      <Badge variant="secondary" className="text-xs">Earned</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* In Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            In Progress ({inProgressBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <Card key={badge.id} className="border-2 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`h-6 w-6 ${getIconColorClass(badge.color, false)}`} />
                      <div>
                        <h4 className="font-semibold">{badge.name}</h4>
                        <Badge variant="outline" className="text-xs">In Progress</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      <strong>Requirements:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {badge.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-500" />
            Not Started ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <Card key={badge.id} className="opacity-60">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-6 w-6 text-gray-400" />
                      <div>
                        <h4 className="font-semibold text-gray-600">{badge.name}</h4>
                        <Badge variant="secondary" className="text-xs">Locked</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-2" />
                      Start Module First
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};