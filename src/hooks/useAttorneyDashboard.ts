import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AttorneyClient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  relationship_type: string;
  status: string;
  created_at: string;
}

export interface AttorneyMessage {
  id: string;
  client_name: string;
  client_email: string;
  message_content: string;
  sender_type: 'client' | 'attorney';
  created_at: string;
  read_at?: string;
  priority: string;
}

export interface SharedDocument {
  id: string;
  document_title: string;
  client_name: string;
  permission_level: string;
  shared_at: string;
  access_count: number;
  is_active: boolean;
}

export interface DashboardMetrics {
  active_clients: number;
  pending_invitations: number;
  unread_messages: number;
  documents_shared_today: number;
  client_uploads_today: number;
}

export const useAttorneyDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<AttorneyClient[]>([]);
  const [messages, setMessages] = useState<AttorneyMessage[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    active_clients: 0,
    pending_invitations: 0,
    unread_messages: 0,
    documents_shared_today: 0,
    client_uploads_today: 0
  });

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('attorney_client_links')
        .select(`
          id,
          relationship_type,
          status,
          created_at,
          client_id,
          profiles!attorney_client_links_client_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('attorney_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      const clientsWithProfiles = (data || []).map(link => ({
        id: link.client_id,
        first_name: (link.profiles as any)?.first_name || 'Unknown',
        last_name: (link.profiles as any)?.last_name || 'Client',
        email: (link.profiles as any)?.email || '',
        phone: (link.profiles as any)?.phone || '',
        relationship_type: link.relationship_type,
        status: link.status,
        created_at: link.created_at
      }));

      setClients(clientsWithProfiles);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('attorney_client_messages')
        .select(`
          id,
          message_content,
          sender_type,
          created_at,
          read_at,
          priority,
          client_id,
          profiles!attorney_client_messages_client_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('attorney_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const messagesWithProfiles = (data || []).map(msg => ({
        id: msg.id,
        client_name: `${(msg.profiles as any)?.first_name || 'Unknown'} ${(msg.profiles as any)?.last_name || 'Client'}`,
        client_email: (msg.profiles as any)?.email || '',
        message_content: msg.message_content,
        sender_type: msg.sender_type as 'client' | 'attorney',
        created_at: msg.created_at,
        read_at: msg.read_at,
        priority: msg.priority
      }));

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchSharedDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('attorney_client_shared_documents')
        .select(`
          id,
          permission_level,
          shared_at,
          access_count,
          is_active,
          client_id,
          document_id,
          attorney_documents_metadata!inner (
            document_title
          ),
          profiles!attorney_client_shared_documents_client_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('attorney_id', user.id)
        .eq('is_active', true)
        .order('shared_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching shared documents:', error);
        return;
      }

      const documentsWithProfiles = (data || []).map(doc => ({
        id: doc.id,
        document_title: (doc.attorney_documents_metadata as any)?.document_title || 'Document',
        client_name: `${(doc.profiles as any)?.first_name || 'Unknown'} ${(doc.profiles as any)?.last_name || 'Client'}`,
        permission_level: doc.permission_level,
        shared_at: doc.shared_at,
        access_count: doc.access_count,
        is_active: doc.is_active
      }));

      setSharedDocuments(documentsWithProfiles);
    } catch (error) {
      console.error('Error fetching shared documents:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get today's metrics
      const today = new Date().toISOString().split('T')[0];
      
      const { data: metricsData, error } = await supabase
        .from('attorney_dashboard_metrics')
        .select('*')
        .eq('attorney_id', user.id)
        .eq('metric_date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching metrics:', error);
        return;
      }

      if (metricsData) {
        setMetrics({
          active_clients: metricsData.active_clients,
          pending_invitations: metricsData.pending_invitations,
          unread_messages: metricsData.unread_messages,
          documents_shared_today: metricsData.documents_shared_today,
          client_uploads_today: metricsData.client_uploads_today
        });
      } else {
        // Calculate metrics if not stored
        await calculateAndStoreMetrics(user.id, today);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const calculateAndStoreMetrics = async (attorneyId: string, date: string) => {
    try {
      // Count active clients
      const { count: activeClients } = await supabase
        .from('attorney_client_links')
        .select('*', { count: 'exact', head: true })
        .eq('attorney_id', attorneyId)
        .eq('status', 'active');

      // Count pending invitations
      const { count: pendingInvitations } = await supabase
        .from('attorney_client_invitations')
        .select('*', { count: 'exact', head: true })
        .eq('attorney_id', attorneyId)
        .eq('status', 'pending');

      // Count unread messages
      const { count: unreadMessages } = await supabase
        .from('attorney_client_messages')
        .select('*', { count: 'exact', head: true })
        .eq('attorney_id', attorneyId)
        .is('read_at', null);

      // Count documents shared today
      const { count: documentsSharedToday } = await supabase
        .from('attorney_client_shared_documents')
        .select('*', { count: 'exact', head: true })
        .eq('attorney_id', attorneyId)
        .gte('shared_at', `${date}T00:00:00.000Z`)
        .lt('shared_at', `${date}T23:59:59.999Z`);

      const newMetrics = {
        active_clients: activeClients || 0,
        pending_invitations: pendingInvitations || 0,
        unread_messages: unreadMessages || 0,
        documents_shared_today: documentsSharedToday || 0,
        client_uploads_today: 0 // Would need additional tracking for client uploads
      };

      // Store in database
      await supabase
        .from('attorney_dashboard_metrics')
        .upsert({
          attorney_id: attorneyId,
          metric_date: date,
          ...newMetrics
        });

      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const sendMessage = async (clientId: string, content: string, priority: string = 'normal') => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('attorney_client_messages')
        .insert({
          attorney_id: user.id,
          client_id: clientId,
          sender_id: user.id,
          sender_type: 'attorney',
          message_content: content,
          priority
        });

      if (error) throw error;

      toast.success('Message sent successfully');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('attorney_client_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      await fetchMessages();
      await fetchMetrics();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClients(),
        fetchMessages(),
        fetchSharedDocuments(),
        fetchMetrics()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    loading,
    clients,
    messages,
    sharedDocuments,
    metrics,
    sendMessage,
    markMessageAsRead,
    refreshData: () => {
      fetchClients();
      fetchMessages();
      fetchSharedDocuments();
      fetchMetrics();
    }
  };
};