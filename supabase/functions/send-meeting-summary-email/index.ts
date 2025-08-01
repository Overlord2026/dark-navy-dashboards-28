import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SummaryEmailRequest {
  to: string;
  userName: string;
  meetingTitle: string;
  summary: string;
  actionItems: Array<{
    item: string;
    assignee?: string;
    dueDate?: string;
    priority: string;
  }>;
  keyDecisions: Array<{
    decision: string;
    rationale?: string;
    impact?: string;
  }>;
  nextSteps: Array<{
    step: string;
    timeline?: string;
    owner?: string;
  }>;
  meetingDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      userName, 
      meetingTitle, 
      summary, 
      actionItems, 
      keyDecisions, 
      nextSteps, 
      meetingDate 
    }: SummaryEmailRequest = await req.json();

    const formattedDate = new Date(meetingDate).toLocaleDateString();

    // Format action items HTML
    const actionItemsHtml = actionItems.length > 0 ? `
      <div style="margin: 20px 0;">
        <h3 style="color: #1e40af; margin-bottom: 10px;">Action Items</h3>
        <ul style="padding-left: 20px;">
          ${actionItems.map(item => `
            <li style="margin-bottom: 8px;">
              <strong>${item.item}</strong>
              ${item.assignee ? `<br><small style="color: #6b7280;">Assigned to: ${item.assignee}</small>` : ''}
              ${item.dueDate ? `<br><small style="color: #6b7280;">Due: ${item.dueDate}</small>` : ''}
              ${item.priority ? `<br><span style="background-color: ${item.priority === 'high' ? '#ef4444' : item.priority === 'medium' ? '#f59e0b' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; text-transform: uppercase;">${item.priority}</span>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // Format key decisions HTML
    const keyDecisionsHtml = keyDecisions.length > 0 ? `
      <div style="margin: 20px 0;">
        <h3 style="color: #1e40af; margin-bottom: 10px;">Key Decisions</h3>
        <ul style="padding-left: 20px;">
          ${keyDecisions.map(decision => `
            <li style="margin-bottom: 8px;">
              <strong>${decision.decision}</strong>
              ${decision.rationale ? `<br><small style="color: #6b7280;">Rationale: ${decision.rationale}</small>` : ''}
              ${decision.impact ? `<br><small style="color: #6b7280;">Impact: ${decision.impact}</small>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // Format next steps HTML
    const nextStepsHtml = nextSteps.length > 0 ? `
      <div style="margin: 20px 0;">
        <h3 style="color: #1e40af; margin-bottom: 10px;">Next Steps</h3>
        <ul style="padding-left: 20px;">
          ${nextSteps.map(step => `
            <li style="margin-bottom: 8px;">
              <strong>${step.step}</strong>
              ${step.owner ? `<br><small style="color: #6b7280;">Owner: ${step.owner}</small>` : ''}
              ${step.timeline ? `<br><small style="color: #6b7280;">Timeline: ${step.timeline}</small>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    const emailResponse = await resend.emails.send({
      from: "MyBFOCFO <noreply@mybfocfo.com>",
      to: [to],
      subject: `Meeting Summary: ${meetingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Meeting Summary</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${meetingTitle}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Hi ${userName},</p>
            
            <p>Your meeting summary is ready! Here's what was discussed and decided:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #1e40af;">Meeting Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Title:</strong> ${meetingTitle}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Summary</h3>
              <p style="color: #374151; white-space: pre-wrap;">${summary}</p>
            </div>
            
            ${actionItemsHtml}
            ${keyDecisionsHtml}
            ${nextStepsHtml}
            
            <div style="background-color: #e0f2fe; padding: 15px; border-radius: 6px; margin: 30px 0;">
              <p style="margin: 0; color: #0369a1; font-size: 14px;">
                💡 <strong>Tip:</strong> You can access the full recording and transcript anytime through your dashboard.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>This summary was automatically generated using AI from your meeting recording.</p>
            <p>MyBFOCFO - Intelligent Family Office Management</p>
          </div>
        </div>
      `,
    });

    console.log("Meeting summary email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-meeting-summary-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);