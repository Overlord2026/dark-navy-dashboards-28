import { supabase } from '@/integrations/supabase/client';

interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: string[];
  customFields: Record<string, any>;
  source?: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface GHLCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  type: 'email' | 'sms' | 'voice';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
  };
  createdAt: string;
}

interface GHLPipeline {
  id: string;
  name: string;
  stages: GHLStage[];
}

interface GHLStage {
  id: string;
  name: string;
  position: number;
}

interface GHLOpportunity {
  id: string;
  title: string;
  contactId: string;
  pipelineId: string;
  stageId: string;
  value: number;
  status: string;
  source?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export class GHLIntegration {
  async syncContacts(): Promise<GHLContact[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'sync_contacts'
        }
      });

      if (error) throw error;

      // Store contacts as leads in our system
      const contacts = data.contacts || [];
      for (const contact of contacts) {
        await this.convertContactToLead(contact);
      }

      return contacts;
    } catch (error) {
      console.error('Failed to sync GHL contacts:', error);
      throw new Error('Failed to sync contacts from GoHighLevel');
    }
  }

  async createContact(leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    source?: string;
    tags?: string[];
    customFields?: Record<string, any>;
  }): Promise<GHLContact> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'create_contact',
          contact_data: leadData
        }
      });

      if (error) throw error;
      return data.contact;
    } catch (error) {
      console.error('Failed to create GHL contact:', error);
      throw new Error('Failed to create contact in GoHighLevel');
    }
  }

  async updateContact(contactId: string, updates: Partial<GHLContact>): Promise<GHLContact> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'update_contact',
          contact_id: contactId,
          updates
        }
      });

      if (error) throw error;
      return data.contact;
    } catch (error) {
      console.error('Failed to update GHL contact:', error);
      throw new Error('Failed to update contact in GoHighLevel');
    }
  }

  async getPipelines(): Promise<GHLPipeline[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'get_pipelines'
        }
      });

      if (error) throw error;
      return data.pipelines || [];
    } catch (error) {
      console.error('Failed to fetch GHL pipelines:', error);
      throw new Error('Failed to fetch pipelines from GoHighLevel');
    }
  }

  async createOpportunity(opportunityData: {
    title: string;
    contactId: string;
    pipelineId: string;
    stageId: string;
    value: number;
    source?: string;
  }): Promise<GHLOpportunity> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'create_opportunity',
          opportunity_data: opportunityData
        }
      });

      if (error) throw error;
      return data.opportunity;
    } catch (error) {
      console.error('Failed to create GHL opportunity:', error);
      throw new Error('Failed to create opportunity in GoHighLevel');
    }
  }

  async getCampaigns(): Promise<GHLCampaign[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'get_campaigns'
        }
      });

      if (error) throw error;
      return data.campaigns || [];
    } catch (error) {
      console.error('Failed to fetch GHL campaigns:', error);
      throw new Error('Failed to fetch campaigns from GoHighLevel');
    }
  }

  async triggerCampaign(campaignId: string, contactId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'trigger_campaign',
          campaign_id: campaignId,
          contact_id: contactId
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to trigger GHL campaign:', error);
      throw new Error('Failed to trigger campaign in GoHighLevel');
    }
  }

  private async convertContactToLead(contact: GHLContact): Promise<void> {
    try {
      // Check if lead already exists
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', contact.email)
        .single();

      if (existingLead) {
        // Update existing lead
        await supabase
          .from('leads')
          .update({
            name: `${contact.firstName} ${contact.lastName}`,
            phone: contact.phone || '',
            status: this.mapGHLStatusToLeadStatus(contact.status),
            source: contact.source || 'ghl',
            ghl_contact_id: contact.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLead.id);
      } else {
        // Store as analytics event for now (until leads table is created)
        await supabase
          .from('analytics_events')
          .insert({
            event_type: 'ghl_contact_converted',
            event_category: 'lead_management',
            event_data: {
              first_name: contact.firstName,
              last_name: contact.lastName,
              email: contact.email,
              phone: contact.phone || '',
              status: this.mapGHLStatusToLeadStatus(contact.status),
              source: contact.source || 'ghl',
              tags: contact.tags.join(', '),
              score: 50
            }
          });
      }
    } catch (error) {
      console.error('Failed to convert GHL contact to lead:', error);
      // Don't throw - continue processing other contacts
    }
  }

  private mapGHLStatusToLeadStatus(ghlStatus: string): string {
    const statusMap: Record<string, string> = {
      'new': 'new',
      'contacted': 'contacted',
      'qualified': 'qualified',
      'nurturing': 'nurturing',
      'appointment_scheduled': 'scheduled',
      'closed_won': 'closed_won',
      'closed_lost': 'closed_lost',
      'unqualified': 'dead'
    };

    return statusMap[ghlStatus.toLowerCase()] || 'new';
  }

  async getConnectionStatus(): Promise<{ connected: boolean; lastSync?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-integration', {
        body: {
          action: 'test_connection'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      return { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
}

export const ghlIntegration = new GHLIntegration();