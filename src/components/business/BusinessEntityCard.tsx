import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Calendar, 
  Shield, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crown,
  Plus,
  Download,
  Share2,
  Eye,
  Settings,
  Upload,
  Bell,
  Archive,
  BarChart3,
  Network,
  Lock,
  Briefcase,
  Home,
  DollarSign,
  ChevronRight,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

export const BusinessEntityCard: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const isPremium = checkFeatureAccess('premium');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={`hover:shadow-lg transition-all duration-200 ${!isPremium ? 'border-amber-200' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-slate-600" />
            </div>
            {!isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                Premium
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">
            Business & Entity Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            All your family businesses, LLCs, trusts, and entities—organized, compliant, and protected.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Features Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">At-a-glance dashboard</p>
                <p className="text-xs text-muted-foreground">See every entity you own, status, documents, deadlines</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Network className="h-5 w-5 text-emerald-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Connect properties & investments</p>
                <p className="text-xs text-muted-foreground">Link assets to legal entities for tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Archive className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Store in Secure Vault</p>
                <p className="text-xs text-muted-foreground">EIN, state registrations, articles, minutes & more</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Bell className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Never miss a deadline</p>
                <p className="text-xs text-muted-foreground">Custom reminders for every entity and state</p>
              </div>
            </div>
          </div>

          {/* Premium Features Highlight */}
          {!isPremium && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Premium Features</span>
              </div>
              <div className="text-xs text-amber-700 space-y-1">
                <p>• Full automation, audit trail, asset titling ledger</p>
                <p>• Advanced alerts, workflow with advisors</p>
                <p>• Visualize your "family business tree"</p>
              </div>
            </div>
          )}

          {/* Sample Data Preview */}
          <div className="border rounded-lg p-3 bg-background">
            <h4 className="text-sm font-medium mb-2">Sample Entities</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Family Investment Holdings LLC</span>
                </div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Smith Family Trust</span>
                </div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Property Management Corp</span>
                </div>
                <Badge variant="outline" className="text-xs">Pending</Badge>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {isPremium ? (
              <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Entities
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </div>

          {/* Integration Notice */}
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Integrates with Vault, Properties, Compliance & Collaboration
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};