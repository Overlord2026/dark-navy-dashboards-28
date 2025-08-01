import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          status: string;
          created_at: string;
          last_contact_at?: string;
        };
      };
      lead_assignments: {
        Row: {
          id: string;
          lead_id: string;
          advisor_id: string;
          assigned_at: string;
          is_active: boolean;
        };
      };
      advisor_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
        };
      };
    };
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting lead follow-up check...');

    // Get all active lead assignments with leads that haven't been contacted in 3+ days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: overdueLeads, error } = await supabase
      .from('lead_assignments')
      .select(`
        id,
        advisor_id,
        lead:leads (
          id,
          first_name,
          last_name,
          email,
          phone,
          status,
          created_at,
          last_contact_at
        ),
        advisor:advisor_profiles (
          id,
          user_id,
          name,
          email
        )
      `)
      .eq('is_active', true)
      .in('lead.status', ['new', 'contacted', 'qualified'])
      .or(
        `last_contact_at.is.null,last_contact_at.lt.${threeDaysAgo.toISOString()}`,
        { foreignTable: 'leads' }
      );

    if (error) {
      console.error('Error fetching overdue leads:', error);
      throw error;
    }

    console.log(`Found ${overdueLeads?.length || 0} overdue leads`);

    // Process each overdue lead
    const notifications = [];
    for (const assignment of overdueLeads || []) {
      const lead = assignment.lead;
      const advisor = assignment.advisor;

      if (!lead || !advisor) continue;

      // Determine how overdue this lead is
      const lastContactDate = lead.last_contact_at ? new Date(lead.last_contact_at) : new Date(lead.created_at);
      const daysSinceContact = Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));

      // Create follow-up reminder notification
      const { error: notificationError } = await supabase
        .from('advisor_alerts')
        .insert({
          advisor_id: assignment.advisor_id,
          alert_type: 'follow_up_reminder',
          priority: daysSinceContact > 7 ? 'high' : 'medium',
          title: `Follow-up overdue: ${lead.first_name} ${lead.last_name}`,
          message: `Lead has not been contacted for ${daysSinceContact} days. Consider reaching out soon.`,
          metadata: {
            lead_id: lead.id,
            lead_name: `${lead.first_name} ${lead.last_name}`,
            lead_email: lead.email,
            lead_phone: lead.phone,
            days_overdue: daysSinceContact,
            last_contact: lead.last_contact_at || lead.created_at
          },
          action_url: `/leads?highlight=${lead.id}`,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expires in 7 days
        });

      if (notificationError) {
        console.error(`Error creating notification for lead ${lead.id}:`, notificationError);
        continue;
      }

      notifications.push({
        lead_id: lead.id,
        advisor_id: assignment.advisor_id,
        days_overdue: daysSinceContact
      });

      console.log(`Created follow-up reminder for ${lead.first_name} ${lead.last_name} (${daysSinceContact} days overdue)`);
    }

    // Optional: Send email notifications for high-priority overdue leads (7+ days)
    const criticalNotifications = notifications.filter(n => n.days_overdue >= 7);
    
    if (criticalNotifications.length > 0) {
      console.log(`Found ${criticalNotifications.length} critical follow-up reminders`);
      
      // Here you could integrate with email service to send advisor notifications
      // For now, we'll just log them
      for (const notification of criticalNotifications) {
        console.log(`CRITICAL: Lead ${notification.lead_id} overdue by ${notification.days_overdue} days`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: overdueLeads?.length || 0,
        notifications_created: notifications.length,
        critical_notifications: criticalNotifications.length,
        message: `Processed ${overdueLeads?.length || 0} leads, created ${notifications.length} follow-up reminders`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in lead follow-up checker:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});