import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PartnerApplicationRequest {
  partnerName: string;
  email: string;
  businessType: string;
  licenseNumber?: string;
  websiteUrl?: string;
  contactPerson: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  loanProducts: string[];
  minimumLoanAmount?: number;
  maximumLoanAmount?: number;
}

interface ProcessApplicationRequest {
  applicationId: string;
  action: 'approve' | 'reject' | 'request_documents';
  notes?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

async function sendApplicationNotification(email: string, partnerName: string, status: string) {
  if (!Deno.env.get('RESEND_API_KEY')) {
    console.log('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  try {
    const emailData = {
      from: 'MyBFOCFO Platform <noreply@mybfocfo.com>',
      to: [email],
      subject: `Partner Application ${status === 'submitted' ? 'Received' : status === 'approved' ? 'Approved' : 'Update Required'}`,
      html: getEmailTemplate(partnerName, status)
    };

    const result = await resend.emails.send(emailData);
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

function getEmailTemplate(partnerName: string, status: string): string {
  switch (status) {
    case 'submitted':
      return `
        <h1>Partner Application Received</h1>
        <p>Dear ${partnerName},</p>
        <p>Thank you for your interest in becoming a lending partner with MyBFOCFO.</p>
        <p>We have received your application and will review it within 2-3 business days.</p>
        <p>Our compliance team will verify your credentials and may request additional documentation.</p>
        <p>Best regards,<br>The MyBFOCFO Partnership Team</p>
      `;
    case 'approved':
      return `
        <h1>Welcome to MyBFOCFO Partnership Program!</h1>
        <p>Dear ${partnerName},</p>
        <p>Congratulations! Your partner application has been approved.</p>
        <p>You can now access your partner portal to manage loan applications and track performance.</p>
        <p>Our team will be in touch with next steps for integration and training.</p>
        <p>Best regards,<br>The MyBFOCFO Partnership Team</p>
      `;
    case 'rejected':
      return `
        <h1>Partner Application Update</h1>
        <p>Dear ${partnerName},</p>
        <p>After careful review, we are unable to approve your partner application at this time.</p>
        <p>Please feel free to reapply in the future or contact us if you have questions.</p>
        <p>Best regards,<br>The MyBFOCFO Partnership Team</p>
      `;
    default:
      return `
        <h1>Partner Application Update</h1>
        <p>Dear ${partnerName},</p>
        <p>There is an update on your partner application. Please check your partner portal for details.</p>
        <p>Best regards,<br>The MyBFOCFO Partnership Team</p>
      `;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...requestData } = await req.json();

    switch (action) {
      case 'submit_application':
        return await handleSubmitApplication(requestData as PartnerApplicationRequest);
      case 'process_application':
        return await handleProcessApplication(requestData as ProcessApplicationRequest);
      case 'get_applications':
        return await handleGetApplications();
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in partner-onboarding function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});

async function handleSubmitApplication(data: PartnerApplicationRequest) {
  console.log('Submitting partner application:', data);

  // Insert application into database
  const { data: application, error } = await supabase
    .from('partner_applications')
    .insert({
      partner_name: data.partnerName,
      email: data.email,
      business_type: data.businessType,
      license_number: data.licenseNumber,
      website_url: data.websiteUrl,
      contact_person: data.contactPerson,
      phone: data.phone,
      address: data.address,
      loan_products: data.loanProducts,
      minimum_loan_amount: data.minimumLoanAmount,
      maximum_loan_amount: data.maximumLoanAmount,
      status: 'pending',
      compliance_status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to submit application');
  }

  // Create initial compliance check
  await supabase
    .from('compliance_checks')
    .insert({
      entity_type: 'partner_application',
      entity_id: application.id,
      check_type: 'initial_submission',
      status: 'pending',
      notes: 'Application submitted for initial review'
    });

  // Send confirmation email
  await sendApplicationNotification(data.email, data.partnerName, 'submitted');

  return new Response(
    JSON.stringify({ 
      success: true, 
      applicationId: application.id,
      message: 'Application submitted successfully'
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

async function handleProcessApplication(data: ProcessApplicationRequest) {
  console.log('Processing application:', data);

  // Call the database function to process the application
  const { data: result, error } = await supabase
    .rpc('process_partner_application', {
      p_application_id: data.applicationId,
      p_action: data.action,
      p_notes: data.notes
    });

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to process application');
  }

  // Get updated application details for email notification
  const { data: application } = await supabase
    .from('partner_applications')
    .select('email, partner_name, status')
    .eq('id', data.applicationId)
    .single();

  if (application) {
    await sendApplicationNotification(
      application.email, 
      application.partner_name, 
      application.status
    );
  }

  return new Response(
    JSON.stringify({ 
      success: true,
      message: `Application ${data.action}d successfully`
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

async function handleGetApplications() {
  const { data: applications, error } = await supabase
    .from('partner_applications')
    .select(`
      id,
      partner_name,
      email,
      status,
      compliance_status,
      business_type,
      submitted_at,
      approved_at,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch applications');
  }

  return new Response(
    JSON.stringify({ applications }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}