import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Target, Plus, Search, Phone, Mail, Calendar, Filter, TrendingUp, Users, DollarSign } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CelebrationEffects } from '@/components/ui/celebration-effects';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'meeting' | 'proposal' | 'nurturing' | 'closed_won' | 'closed_lost' | 'dead';
  score: number;
  source: string;
  lastTouch: Date;
  potentialValue: number;
  notes: string;
}

const mockProspects: Prospect[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0123',
    status: 'new',
    score: 85,
    source: 'Website',
    lastTouch: new Date(),
    potentialValue: 500000,
    notes: 'Interested in retirement planning'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '555-0124',
    status: 'contacted',
    score: 92,
    source: 'Referral',
    lastTouch: addDays(new Date(), -2),
    potentialValue: 1200000,
    notes: 'High net worth, investment focused'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '555-0125',
    status: 'meeting',
    score: 95,
    source: 'LinkedIn',
    lastTouch: addDays(new Date(), -1),
    potentialValue: 2500000,
    notes: 'Estate planning needs, multiple properties'
  }
];

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCelebration, setShowCelebration] = useState(false);

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-primary';
      case 'contacted': return 'bg-secondary';
      case 'meeting': return 'bg-accent';
      case 'proposal': return 'bg-warning';
      case 'nurturing': return 'bg-muted';
      case 'closed_won': return 'bg-success';
      case 'closed_lost': return 'bg-destructive';
      case 'dead': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleStatusUpdate = (prospectId: string, newStatus: string) => {
    setProspects(prev => prev.map(p => 
      p.id === prospectId 
        ? { ...p, status: newStatus as any, lastTouch: new Date() }
        : p
    ));
    
    if (newStatus === 'closed_won') {
      setShowCelebration(true);
      toast.success('🎉 Prospect converted to client!');
    }
  };

  const totalValue = filteredProspects.reduce((sum, p) => sum + p.potentialValue, 0);
  const avgScore = filteredProspects.length > 0 
    ? filteredProspects.reduce((sum, p) => sum + p.score, 0) / filteredProspects.length 
    : 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 font-display tracking-tight">
              PROSPECT PIPELINE
            </h1>
            <p className="text-text-secondary text-lg">
              Track and nurture potential new clients
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Total Prospects</p>
                    <p className="text-2xl font-bold text-white">{filteredProspects.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-accent-aqua" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Pipeline Value</p>
                    <p className="text-2xl font-bold text-white">
                      ${(totalValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Avg Score</p>
                    <p className="text-2xl font-bold text-white">{avgScore.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Hot Prospects</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredProspects.filter(p => p.score >= 85).length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-surface border-border-primary">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                  <Input
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border-primary text-white placeholder:text-text-secondary"
                  />
                </div>
                
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prospect
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prospects List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProspects.map((prospect) => (
              <Card key={prospect.id} className="bg-card border-border-primary hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-accent-gold text-primary font-bold">
                            {prospect.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-white">{prospect.name}</h3>
                          <p className="text-text-secondary text-sm">{prospect.source}</p>
                        </div>
                      </div>
                      <Badge className={`text-white ${getScoreColor(prospect.score)}`}>
                        {prospect.score}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{prospect.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{prospect.phone}</span>
                      </div>
                    </div>

                    {/* Value and Notes */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary text-sm">Potential Value:</span>
                        <span className="text-accent-gold font-bold">
                          ${(prospect.potentialValue / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm line-clamp-2">{prospect.notes}</p>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-primary/30">
                      <Badge className={`text-white ${getStatusColor(prospect.status)}`}>
                        {prospect.status.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-2 text-text-secondary text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{format(prospect.lastTouch, 'MMM d')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-accent-aqua text-accent-aqua hover:bg-accent-aqua hover:text-primary"
                        onClick={() => toast.info('Call feature coming soon')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary"
                        onClick={() => toast.info('Email feature coming soon')}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProspects.length === 0 && (
            <Card className="bg-surface border-border-primary">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No prospects found</h3>
                <p className="text-text-secondary">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Add your first prospect to get started'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showCelebration && (
        <CelebrationEffects 
          trigger={showCelebration}
          onComplete={() => setShowCelebration(false)}
          type="confetti"
        />
      )}
    </MainLayout>
  );
}