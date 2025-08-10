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

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type = 'weekly', force = false, recipients = [] } = 
      await req.json().catch(() => ({}));

    console.log(`Generating ${type} digest, force: ${force}`);

    // Get progress data from Supabase
    const { data: progressData, error: progressError } = await supabase
      .from('launch_checklist_progress')
      .select('*')
      .order('segment, tier, week');

    if (progressError) {
      throw new Error(`Failed to fetch progress data: ${progressError.message}`);
    }

    // Calculate overall progress by segment and tier
    const segmentProgress = calculateSegmentProgress(progressData || []);
    
    // Generate email content
    const emailContent = generateDigestEmail(segmentProgress);
    
    const finalRecipients = recipients.length > 0 ? recipients : [
      'tony@awmfl.com', 'heather@awmfl.com', 'jamie@awmfl.com'
    ];

    // Send digest email
    const emailResponse = await resend.emails.send({
      from: 'BFO Automation <automation@my.bfocfo.com>',
      to: finalRecipients,
      subject: `Founding 20 Launch Status Digest - ${new Date().toLocaleDateString()}`,
      html: emailContent.html,
      text: emailContent.text
    });

    return new Response(JSON.stringify({
      success: true,
      digest_type: type,
      recipients: finalRecipients,
      email_id: emailResponse.data?.id,
      segment_progress: segmentProgress
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in launch-digest function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

function calculateSegmentProgress(progressData: any[]): any {
  const result: any = {
    overall: { total: 0, completed: 0, percentage: 0 },
    by_segment: { sports: {}, longevity: {}, ria: {} },
    by_tier: { gold: {}, silver: {}, bronze: {} }
  };

  let totalItems = 0;
  let totalCompleted = 0;

  ['sports', 'longevity', 'ria'].forEach(segment => {
    const segmentData = progressData.filter(p => p.segment === segment);
    const segmentTotal = segmentData.reduce((sum, p) => sum + (p.total_items || 0), 0);
    const segmentCompleted = segmentData.reduce((sum, p) => sum + (p.completed_items || 0), 0);
    
    result.by_segment[segment] = {
      total: segmentTotal,
      completed: segmentCompleted,
      percentage: segmentTotal > 0 ? Math.round((segmentCompleted / segmentTotal) * 100) : 0
    };

    totalItems += segmentTotal;
    totalCompleted += segmentCompleted;
  });

  result.overall = {
    total: totalItems,
    completed: totalCompleted,
    percentage: totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0
  };

  return result;
}

function generateDigestEmail(segmentProgress: any): { html: string; text: string } {
  const { overall, by_segment } = segmentProgress;

  const html = `
<!DOCTYPE html>
<html>
<head><title>Founding 20 Launch Status</title></head>
<body style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #FFD700; border-radius: 8px;">
    <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-bottom: 2px solid #FFD700;">
      <h1 style="color: #FFD700; margin: 0;">Founding 20 Launch Status</h1>
      <p style="color: #999; margin: 5px 0 0 0;">Weekly Progress Digest</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #FFD700;">Overall Progress: ${overall.percentage}%</h2>
      <h3 style="color: #046B4D;">🏃 Sports: ${by_segment.sports?.percentage || 0}%</h3>
      <h3 style="color: #0A152E;">🧬 Longevity: ${by_segment.longevity?.percentage || 0}%</h3>
      <h3 style="color: #A6192E;">💼 RIA: ${by_segment.ria?.percentage || 0}%</h3>
      <p style="text-align: center; margin-top: 30px; color: #999;">
        <a href="https://my.bfocfo.com/admin/founding20-checklist" style="color: #FFD700;">View Dashboard</a><br>
        — Lovable Automation
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `Founding 20 Launch Status Digest\n\nOverall: ${overall.percentage}%\nSports: ${by_segment.sports?.percentage || 0}%\nLongevity: ${by_segment.longevity?.percentage || 0}%\nRIA: ${by_segment.ria?.percentage || 0}%`;

  return { html, text };
}

serve(handler);