import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface DigestRequest {
  type?: 'weekly' | 'milestone';
  recipients?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type = 'weekly', recipients = ['tony@awmfl.com', 'heather@awmfl.com', 'jamie@awmfl.com'] }: DigestRequest = 
      await req.json().catch(() => ({}));

    console.log(`Generating ${type} digest for ${recipients.length} recipients`);

    // Get progress data from database
    const { data: progressData, error: progressError } = await supabase
      .from('launch_checklist_progress')
      .select('*')
      .order('segment', { ascending: true })
      .order('tier', { ascending: true });

    if (progressError) {
      throw new Error(`Failed to fetch progress data: ${progressError.message}`);
    }

    // Calculate tier completion percentages
    const tierProgress = {
      gold: { total: 0, completed: 0, percentage: 0 },
      silver: { total: 0, completed: 0, percentage: 0 },
      bronze: { total: 0, completed: 0, percentage: 0 }
    };

    const segmentProgress = {
      sports: { total: 0, completed: 0, percentage: 0 },
      longevity: { total: 0, completed: 0, percentage: 0 },
      ria: { total: 0, completed: 0, percentage: 0 }
    };

    progressData?.forEach(item => {
      // Tier progress
      if (tierProgress[item.tier]) {
        tierProgress[item.tier].total += item.total_items;
        tierProgress[item.tier].completed += item.completed_items;
      }

      // Segment progress  
      if (segmentProgress[item.segment]) {
        segmentProgress[item.segment].total += item.total_items;
        segmentProgress[item.segment].completed += item.completed_items;
      }
    });

    // Calculate percentages
    Object.keys(tierProgress).forEach(tier => {
      const data = tierProgress[tier];
      data.percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    });

    Object.keys(segmentProgress).forEach(segment => {
      const data = segmentProgress[segment];
      data.percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    });

    // Generate email content
    const checklistLink = "https://my.bfocfo.com/admin/founding20-dashboard";
    const timestamp = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailBody = `Hi Team,

Here's the current progress for the Founding 20 launch as of ${timestamp}:

🥇 **Gold Tier:** ${tierProgress.gold.percentage}% complete (${tierProgress.gold.completed}/${tierProgress.gold.total})
🥈 **Silver Tier:** ${tierProgress.silver.percentage}% complete (${tierProgress.silver.completed}/${tierProgress.silver.total})  
🥉 **Bronze Tier:** ${tierProgress.bronze.percentage}% complete (${tierProgress.bronze.completed}/${tierProgress.bronze.total})

**Segment Breakdown:**
🏆 Sports: ${segmentProgress.sports.percentage}% complete (${segmentProgress.sports.completed}/${segmentProgress.sports.total})
🧬 Longevity: ${segmentProgress.longevity.percentage}% complete (${segmentProgress.longevity.completed}/${segmentProgress.longevity.total})
💼 RIA: ${segmentProgress.ria.percentage}% complete (${segmentProgress.ria.completed}/${segmentProgress.ria.total})

**Next Actions:**
• Continue Gold tier outreach this week
• Prepare Silver tier materials 
• Schedule follow-up calls with interested prospects

View the detailed checklist: ${checklistLink}

— BFO Launch Automation`;

    // Send emails to each recipient
    for (const recipient of recipients) {
      const emailResult = await resend.emails.send({
        from: "BFO Ops <ops@my.bfocfo.com>",
        to: [recipient],
        subject: `Founding 20 Launch Status Digest - ${timestamp}`,
        text: emailBody,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #FFD700; padding-bottom: 20px;">
              <h1 style="color: #FFD700; font-family: 'Playfair Display', serif; margin: 0;">Boutique Family Office™</h1>
              <p style="color: #046B4D; margin: 5px 0 0 0;">Healthspan + Wealthspan. One Platform.</p>
            </div>
            
            <h2 style="color: #FFD700; margin-bottom: 20px;">Founding 20 Launch Progress</h2>
            <p style="color: #ffffff; margin-bottom: 30px;">Here's the current status as of ${timestamp}:</p>
            
            <div style="background: #1a1a1a; border: 1px solid #FFD700; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #FFD700; margin-top: 0;">Tier Progress</h3>
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>🥇 Gold Tier</span>
                  <span>${tierProgress.gold.percentage}%</span>
                </div>
                <div style="background: #333; height: 8px; border-radius: 4px;">
                  <div style="background: #FFD700; height: 100%; width: ${tierProgress.gold.percentage}%; border-radius: 4px;"></div>
                </div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>🥈 Silver Tier</span>
                  <span>${tierProgress.silver.percentage}%</span>
                </div>
                <div style="background: #333; height: 8px; border-radius: 4px;">
                  <div style="background: #C0C0C0; height: 100%; width: ${tierProgress.silver.percentage}%; border-radius: 4px;"></div>
                </div>
              </div>
              
              <div style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>🥉 Bronze Tier</span>
                  <span>${tierProgress.bronze.percentage}%</span>
                </div>
                <div style="background: #333; height: 8px; border-radius: 4px;">
                  <div style="background: #CD7F32; height: 100%; width: ${tierProgress.bronze.percentage}%; border-radius: 4px;"></div>
                </div>
              </div>
            </div>
            
            <div style="background: #1a1a1a; border: 1px solid #046B4D; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #046B4D; margin-top: 0;">Segment Breakdown</h3>
              <div style="margin-bottom: 10px;">🏆 Sports: ${segmentProgress.sports.percentage}% (${segmentProgress.sports.completed}/${segmentProgress.sports.total})</div>
              <div style="margin-bottom: 10px;">🧬 Longevity: ${segmentProgress.longevity.percentage}% (${segmentProgress.longevity.completed}/${segmentProgress.longevity.total})</div>
              <div>💼 RIA: ${segmentProgress.ria.percentage}% (${segmentProgress.ria.completed}/${segmentProgress.ria.total})</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${checklistLink}" style="background: #FFD700; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Detailed Checklist
              </a>
            </div>
            
            <div style="text-align: center; color: #999999; font-size: 12px; border-top: 1px solid #333; padding-top: 20px;">
              <p>Boutique Family Office™ | Launch Automation</p>
            </div>
          </div>
        `
      });

      if (emailResult.error) {
        console.error(`Failed to send email to ${recipient}:`, emailResult.error);
      } else {
        console.log(`Digest sent successfully to ${recipient}`);
      }
    }

    // Log the digest
    const { error: logError } = await supabase
      .from('launch_digest_log')
      .insert({
        digest_type: type,
        recipients,
        content: {
          tierProgress,
          segmentProgress,
          timestamp: new Date().toISOString()
        },
        status: 'sent'
      });

    if (logError) {
      console.error('Failed to log digest:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      recipients: recipients.length,
      progress: { tierProgress, segmentProgress }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in launch-digest function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);