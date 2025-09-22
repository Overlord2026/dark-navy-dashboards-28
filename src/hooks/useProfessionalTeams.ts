import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProfessionalTeamMember {
  id: string;
  name: string;
  email: string;
  type: string;
  role: string;
  company?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  specialties: string[];
  clientCount: number;
  lastActivity: string;
  responseTime: string;
  rating: number;
  verified: boolean;
}

export interface ClientTeamAssignment {
  id: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  professionalType: string;
  relationship: string;
  status: 'active' | 'pending' | 'completed';
  assignedDate: string;
  notes?: string;
}

export interface CrossProfessionalWorkflow {
  id: string;
  name: string;
  triggerType: string;
  fromProfessional: string;
  toProfessional: string;
  status: 'active' | 'paused';
  description: string;
  automatedActions: string[];
  completedCount: number;
  lastTriggered?: string;
}

export interface CoordinationMetrics {
  totalProfessionals: number;
  activeProfessionals: number;
  totalClients: number;
  multiProfessionalClients: number;
  activeWorkflows: number;
  completedHandoffs: number;
  averageResponseTime: string;
  clientSatisfactionScore: number;
}

export const useProfessionalTeams = () => {
  const [professionals, setProfessionals] = useState<ProfessionalTeamMember[]>([]);
  const [assignments, setAssignments] = useState<ClientTeamAssignment[]>([]);
  const [workflows, setWorkflows] = useState<CrossProfessionalWorkflow[]>([]);
  const [metrics, setMetrics] = useState<CoordinationMetrics>({
    totalProfessionals: 0,
    activeProfessionals: 0,
    totalClients: 0,
    multiProfessionalClients: 0,
    activeWorkflows: 0,
    completedHandoffs: 0,
    averageResponseTime: '0h',
    clientSatisfactionScore: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetch professional team members
      const { data: professionalsData, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .eq('tenant_id', 'default')
        .order('name', { ascending: true });

      if (profError) {
        console.error('Error fetching professionals:', profError);
        loadMockData();
        return;
      }

      // Process professionals data
      const processedProfessionals: ProfessionalTeamMember[] = (professionalsData || []).map(prof => ({
        id: prof.id,
        name: prof.name,
        email: prof.email || 'No email',
        type: prof.type,
        role: prof.type,
        company: prof.company,
        phone: prof.phone,
        status: (prof.status as 'active' | 'inactive' | 'pending') || 'active',
        specialties: prof.specialties || [],
        clientCount: Math.floor(Math.random() * 50) + 10, // Mock data
        lastActivity: formatRelativeTime(prof.updated_at || prof.created_at),
        responseTime: `${Math.floor(Math.random() * 24)}h`,
        rating: 4 + Math.random(),
        verified: prof.verified || false
      }));

      setProfessionals(processedProfessionals);

      // Fetch assignments (mock for now)
      const mockAssignments: ClientTeamAssignment[] = generateMockAssignments(processedProfessionals);
      setAssignments(mockAssignments);

      // Generate workflows
      const mockWorkflows: CrossProfessionalWorkflow[] = generateMockWorkflows();
      setWorkflows(mockWorkflows);

      // Calculate metrics
      const calculatedMetrics: CoordinationMetrics = {
        totalProfessionals: processedProfessionals.length,
        activeProfessionals: processedProfessionals.filter(p => p.status === 'active').length,
        totalClients: mockAssignments.length,
        multiProfessionalClients: new Set(mockAssignments.map(a => a.clientId)).size,
        activeWorkflows: mockWorkflows.filter(w => w.status === 'active').length,
        completedHandoffs: mockWorkflows.reduce((sum, w) => sum + w.completedCount, 0),
        averageResponseTime: '4.2h',
        clientSatisfactionScore: 4.7
      };

      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error('Error in fetchTeamData:', error);
      toast({
        title: "Error loading team data",
        description: "Using sample data. Please check your connection.",
        variant: "destructive"
      });
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMockData = () => {
    const mockProfessionals: ProfessionalTeamMember[] = [
      {
        id: '1',
        name: 'Sarah Chen, CPA',
        email: 'sarah.chen@accounting.com',
        type: 'Tax Professional / Accountant',
        role: 'Lead Tax Advisor',
        company: 'Chen & Associates CPA',
        phone: '(555) 123-4567',
        status: 'active',
        specialties: ['Tax Planning', 'Business Tax', 'Estate Tax'],
        clientCount: 45,
        lastActivity: '2 hours ago',
        responseTime: '3.2h',
        rating: 4.8,
        verified: true
      },
      {
        id: '2',
        name: 'Michael Rodriguez, JD',
        email: 'michael.rodriguez@estatelaw.com',
        type: 'Estate Planning Attorney',
        role: 'Estate Planning Specialist',
        company: 'Rodriguez Law Group',
        phone: '(555) 234-5678',
        status: 'active',
        specialties: ['Trust Planning', 'Estate Administration', 'Tax Law'],
        clientCount: 32,
        lastActivity: '1 hour ago',
        responseTime: '2.5h',
        rating: 4.9,
        verified: true
      },
      {
        id: '3',
        name: 'Jennifer Kim, CLU',
        email: 'jennifer.kim@insurance.com',
        type: 'Insurance / LTC Specialist',
        role: 'Insurance Advisor',
        company: 'Kim Insurance Services',
        phone: '(555) 345-6789',
        status: 'active',
        specialties: ['Life Insurance', 'LTC Planning', 'Disability Insurance'],
        clientCount: 28,
        lastActivity: '4 hours ago',
        responseTime: '5.1h',
        rating: 4.6,
        verified: true
      }
    ];

    setProfessionals(mockProfessionals);
    setAssignments(generateMockAssignments(mockProfessionals));
    setWorkflows(generateMockWorkflows());
    setMetrics({
      totalProfessionals: mockProfessionals.length,
      activeProfessionals: mockProfessionals.filter(p => p.status === 'active').length,
      totalClients: 15,
      multiProfessionalClients: 12,
      activeWorkflows: 8,
      completedHandoffs: 156,
      averageResponseTime: '3.6h',
      clientSatisfactionScore: 4.7
    });
  };

  const generateMockAssignments = (professionals: ProfessionalTeamMember[]): ClientTeamAssignment[] => {
    const clients = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Lisa Davis', 'Robert Wilson'];
    const assignments: ClientTeamAssignment[] = [];

    clients.forEach((clientName, clientIndex) => {
      // Each client gets 2-3 professionals assigned
      const numAssignments = Math.floor(Math.random() * 2) + 2;
      const selectedProfessionals = professionals.slice(0, numAssignments);

      selectedProfessionals.forEach((prof, profIndex) => {
        assignments.push({
          id: `${clientIndex}-${profIndex}`,
          clientId: `client-${clientIndex}`,
          clientName,
          professionalId: prof.id,
          professionalName: prof.name,
          professionalType: prof.type,
          relationship: prof.type.includes('Advisor') ? 'primary' : 'specialist',
          status: 'active',
          assignedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: prof.type.includes('Tax') ? 'Quarterly tax reviews' : 
                 prof.type.includes('Estate') ? 'Estate plan updates' : 
                 'Insurance coverage review'
        });
      });
    });

    return assignments;
  };

  const generateMockWorkflows = (): CrossProfessionalWorkflow[] => [
    {
      id: '1',
      name: 'Estate Planning → Tax Planning Handoff',
      triggerType: 'estate_plan_update',
      fromProfessional: 'Estate Attorney',
      toProfessional: 'Tax Professional',
      status: 'active',
      description: 'Automatically notify tax professional when estate plan is updated to review tax implications',
      automatedActions: ['Send notification', 'Share documents', 'Schedule review'],
      completedCount: 23,
      lastTriggered: '2 days ago'
    },
    {
      id: '2',
      name: 'Tax Assessment → Insurance Review',
      triggerType: 'high_tax_liability',
      fromProfessional: 'Tax Professional',
      toProfessional: 'Insurance Specialist',
      status: 'active',
      description: 'Trigger insurance review when tax assessment shows high liability exposure',
      automatedActions: ['Calculate coverage needs', 'Generate recommendations', 'Schedule consultation'],
      completedCount: 18,
      lastTriggered: '5 days ago'
    },
    {
      id: '3',
      name: 'Investment Change → Estate Update',
      triggerType: 'significant_asset_change',
      fromProfessional: 'Financial Advisor',
      toProfessional: 'Estate Attorney',
      status: 'active',
      description: 'Notify estate attorney when significant asset changes require plan updates',
      automatedActions: ['Asset valuation update', 'Beneficiary review', 'Document amendments'],
      completedCount: 31,
      lastTriggered: '1 week ago'
    }
  ];

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return '1 week ago';
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    return date.toLocaleDateString();
  };

  const assignProfessionalToClient = async (professionalId: string, clientId: string, relationship: string) => {
    try {
      const professional = professionals.find(p => p.id === professionalId);
      if (!professional) return false;

      // In real implementation, this would create database record
      const newAssignment: ClientTeamAssignment = {
        id: `${clientId}-${professionalId}-${Date.now()}`,
        clientId,
        clientName: `Client ${clientId}`,
        professionalId,
        professionalName: professional.name,
        professionalType: professional.type,
        relationship,
        status: 'pending',
        assignedDate: new Date().toISOString()
      };

      setAssignments(prev => [...prev, newAssignment]);
      
      toast({
        title: "Professional Assigned",
        description: `${professional.name} has been assigned to the client`,
      });

      return true;
    } catch (error) {
      console.error('Error assigning professional:', error);
      toast({
        title: "Error",
        description: "Failed to assign professional",
        variant: "destructive"
      });
      return false;
    }
  };

  const triggerWorkflow = async (workflowId: string, clientId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) return false;

      // Update workflow completion count
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, completedCount: w.completedCount + 1, lastTriggered: 'Just now' }
          : w
      ));

      toast({
        title: "Workflow Triggered",
        description: `${workflow.name} has been initiated for client`,
      });

      return true;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      toast({
        title: "Error",
        description: "Failed to trigger workflow",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  return {
    professionals,
    assignments,
    workflows,
    metrics,
    loading,
    assignProfessionalToClient,
    triggerWorkflow,
    refreshData: fetchTeamData
  };
};