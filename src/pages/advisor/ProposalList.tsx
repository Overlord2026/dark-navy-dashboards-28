import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Clock, CheckCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  prospect_name: string;
  prospect_email: string;
  status: 'draft' | 'finalized' | 'sent';
  created_at: string;
  current_holdings: any[];
  proposal_data: {
    total_value?: number;
    holdings_count?: number;
  };
}

const statusConfig = {
  draft: { label: 'Draft', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  finalized: { label: 'Finalized', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  sent: { label: 'Sent', icon: Send, color: 'bg-blue-100 text-blue-800' }
};

export const ProposalList: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('draft_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Investment Proposals</h1>
          <p className="text-gray-600 mt-2">
            Manage your client investment proposals
          </p>
        </div>
        <Button asChild>
          <Link to="/advisor/proposals/new">
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Link>
        </Button>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-500 text-center mb-6">
              Create your first investment proposal to get started
            </p>
            <Button asChild>
              <Link to="/advisor/proposals/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Proposal
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => {
            const statusInfo = statusConfig[proposal.status];
            const StatusIcon = statusInfo.icon;
            const totalValue = proposal.proposal_data?.total_value || 0;
            const holdingsCount = proposal.proposal_data?.holdings_count || 0;

            return (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{proposal.prospect_name}</CardTitle>
                      <CardDescription>{proposal.prospect_email}</CardDescription>
                    </div>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Portfolio Value:</span>
                      <span className="font-medium">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Holdings:</span>
                      <span className="font-medium">{holdingsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/advisor/proposals/${proposal.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/advisor/proposals/${proposal.id}/preview`}>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};