import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AttorneyInviteRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  message?: string;
  invitedBy: string;
  practiceAreas?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, firstName, lastName, message, invitedBy, practiceAreas }: AttorneyInviteRequest = await req.json()

    if (!email || !invitedBy) {
      return new Response(
        JSON.stringify({ error: 'Email and invitedBy are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate invitation token
    const inviteToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabaseClient
      .from('attorney_invitations')
      .insert([{
        email,
        first_name: firstName,
        last_name: lastName,
        message,
        invited_by: invitedBy,
        practice_areas: practiceAreas,
        invitation_token: inviteToken,
        expires_at: expiresAt.toISOString(),
        status: 'sent'
      }])
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create invitation link
    const inviteUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/attorney-onboarding?token=${inviteToken}`

    // Send email invitation
    const emailSubject = 'Invitation to Join Our Attorney Network'
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">You're Invited to Join Our Attorney Network</h2>
        
        <p>Hello ${firstName || 'Attorney'},</p>
        
        <p>You've been invited to join our exclusive attorney network. We believe your expertise would be a valuable addition to our platform.</p>
        
        ${message ? `<div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Personal message:</strong></p>
          <p style="font-style: italic;">"${message}"</p>
        </div>` : ''}
        
        ${practiceAreas && practiceAreas.length > 0 ? `
          <p><strong>Practice Areas of Interest:</strong></p>
          <ul>
            ${practiceAreas.map(area => `<li>${area}</li>`).join('')}
          </ul>
        ` : ''}
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteUrl}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Attorney Onboarding
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">
          This invitation expires in 7 days. If you have any questions, please don't hesitate to contact us.
        </p>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="font-size: 12px; color: #9ca3af;">
          If you're unable to click the button above, copy and paste this link into your browser:<br>
          <a href="${inviteUrl}" style="color: #3b82f6;">${inviteUrl}</a>
        </p>
      </div>
    `

    // Note: In a real implementation, you would integrate with an email service like Resend, SendGrid, etc.
    console.log('Attorney invitation email would be sent to:', email)
    console.log('Email subject:', emailSubject)
    console.log('Email body:', emailBody)

    // Log the invitation for admin tracking
    await supabaseClient
      .from('attorney_onboarding_log')
      .insert([{
        onboarding_id: null,
        previous_status: null,
        new_status: 'invited',
        notes: `Invitation sent to ${email} by ${invitedBy}`,
        created_by: invitedBy,
        automated: false
      }])

    return new Response(
      JSON.stringify({
        success: true,
        invitationId: invitation.id,
        inviteToken,
        inviteUrl,
        message: 'Invitation sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in attorney-invite function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})