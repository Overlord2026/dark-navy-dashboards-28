import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadMagnetRequest {
  leadMagnetSlug: string;
  formData: {
    name: string;
    email: string;
    phone?: string;
    firmSize: string;
    agreeToTerms: boolean;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { leadMagnetSlug, formData }: LeadMagnetRequest = await req.json();
    
    console.log('Processing lead magnet submission:', { leadMagnetSlug, email: formData.email });

    // Get lead magnet details
    const { data: leadMagnet, error: leadMagnetError } = await supabase
      .from('lead_magnets')
      .select('*')
      .eq('slug', leadMagnetSlug)
      .eq('is_active', true)
      .single();

    if (leadMagnetError || !leadMagnet) {
      console.error('Lead magnet not found:', leadMagnetError);
      return new Response(
        JSON.stringify({ error: 'Lead magnet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', formData.email)
      .single();

    let userId = existingUser?.id;

    // Create user account if doesn't exist
    if (!existingUser) {
      console.log('Creating new user account for:', formData.email);
      
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: formData.name,
          phone: formData.phone,
          firm_size: formData.firmSize,
          lead_source: 'lead_magnet',
          lead_magnet_slug: leadMagnetSlug
        }
      });

      if (authError) {
        console.error('Error creating user:', authError);
        return new Response(
          JSON.stringify({ error: 'Failed to create account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = authData.user?.id;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          role: 'cpa',
          onboarding_completed: false
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    // Create lead magnet submission
    const { data: submission, error: submissionError } = await supabase
      .from('lead_magnet_submissions')
      .insert({
        lead_magnet_id: leadMagnet.id,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        firm_size: formData.firmSize,
        form_data: formData,
        user_id: userId,
        status: existingUser ? 'processed' : 'account_created'
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to process submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send welcome email with blueprint and account details
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      
      const dashboardUrl = `${supabaseUrl.replace('/supabase', '')}/cpa/dashboard`;
      
      const emailContent = `
Hi ${formData.name},

Thank you for downloading "The High-Value CPA Growth Blueprint"! 

🎯 Your blueprint is attached to this email, and I've also created a complimentary BFO CPA account for you so you can start exploring our tools right away.

Inside the blueprint, you'll discover:
• Proven tax planning strategies that increase client value
• Automation techniques that save 10+ hours per week  
• Client retention systems used by top-performing CPAs
• Scalable processes for growing your practice

Plus, your new CPA account gives you immediate access to:
• Client organizer templates
• Secure document sharing portal
• Basic CRM tools
• Tax planning calculators

Ready to explore? Click here to access your CPA tools: ${dashboardUrl}

Best regards,
The BFO Team

P.S. Keep an eye out for my next email - I'll be sharing a real case study of how one CPA increased their revenue by 45% using these exact strategies.
      `.trim();

      try {
        await resend.emails.send({
          from: 'BFO CPA Team <onboarding@resend.dev>',
          to: [formData.email],
          subject: 'Your CPA Growth Blueprint is Ready!',
          text: emailContent,
        });
        
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Start email sequence automation
    try {
      await supabase.functions.invoke('email-automation', {
        body: {
          action: 'enroll_in_sequence',
          email: formData.email,
          sequenceName: 'CPA Growth Blueprint Nurture Sequence',
          submissionId: submission.id
        }
      });
    } catch (automationError) {
      console.error('Error starting email automation:', automationError);
      // Don't fail the request if automation fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        submissionId: submission.id,
        accountCreated: !existingUser,
        message: 'Lead magnet processed successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in process-lead-magnet function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);