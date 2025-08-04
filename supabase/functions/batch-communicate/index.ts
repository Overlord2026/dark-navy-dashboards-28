import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgentInfo {
  id: string;
  email: string;
  name: string;
  days_until_ce_deadline: number | null;
  days_until_expiry: number | null;
  compliance_status: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, agents }: { type: string; agents: AgentInfo[] } = await req.json();
    
    console.log(`Processing batch ${type} for ${agents.length} agents`);

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const results = [];

    for (const agent of agents) {
      try {
        const emailContent = generateEmailContent(agent, type);
        
        await resend.emails.send({
          from: "Compliance Team <compliance@agency.com>",
          to: [agent.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log(`Email sent to ${agent.email}`);
        results.push({ agentId: agent.id, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send email to ${agent.email}:`, error);
        results.push({ agentId: agent.id, status: 'failed', error: error.message });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;

    return new Response(JSON.stringify({
      success: true,
      message: `Batch reminders sent to ${successCount}/${agents.length} agents`,
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in batch-communicate function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

function generateEmailContent(agent: AgentInfo, type: string) {
  const isUrgent = (agent.days_until_ce_deadline !== null && agent.days_until_ce_deadline <= 7);
  
  return {
    subject: isUrgent ? `🚨 URGENT: CE Requirements Due Soon` : `📅 CE Compliance Reminder`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Hello ${agent.name},</h2>
        <p>This is a reminder about your continuing education compliance status.</p>
        <ul>
          ${agent.days_until_ce_deadline !== null ? 
            `<li>CE Deadline: ${agent.days_until_ce_deadline > 0 ? 
              `${agent.days_until_ce_deadline} days remaining` : 'OVERDUE'}</li>` : ''}
          <li>Compliance Status: ${agent.compliance_status.toUpperCase()}</li>
        </ul>
        <p><a href="https://app.example.com/insurance-ce" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Dashboard</a></p>
      </div>
    `
  };
}

serve(handler);