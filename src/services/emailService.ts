
import emailjs from '@emailjs/browser';
import { FLAGS } from '@/config/flags';
import { withDemoFallback } from './demoService';

// EmailJS configuration - using environment variables for security
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_9eb6z0x';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_0ttdq0e';
const EMAILJS_LEARN_MORE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_LEARN_MORE_TEMPLATE_ID || 'template_hg3d85z';
const EMAILJS_OTP_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID || 'template_xts37ho';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rfbjUYJ8iPHEZaQvx';
const EMAILJS_OTP_SERVICE_ID = import.meta.env.VITE_EMAILJS_OTP_SERVICE_ID || 'service_cew8n8b';
const EMAILJS_OTP_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_OTP_PUBLIC_KEY || 'chtAi9WR2OnpWeUXo';

// Onboarding email template IDs
const EMAILJS_CLIENT_ONBOARDING_TEMPLATE = import.meta.env.VITE_EMAILJS_CLIENT_ONBOARDING_TEMPLATE || 'template_client_onboard';
const EMAILJS_PROFESSIONAL_ONBOARDING_TEMPLATE = import.meta.env.VITE_EMAILJS_PROFESSIONAL_ONBOARDING_TEMPLATE || 'template_professional_onboard';
const EMAILJS_ADMIN_ONBOARDING_TEMPLATE = import.meta.env.VITE_EMAILJS_ADMIN_ONBOARDING_TEMPLATE || 'template_admin_onboard';

export interface InterestEmailData {
  userName: string;
  userEmail: string;
  itemName: string;
  itemType: string;
  pageContext: string;
}

export interface LearnMoreEmailData {
  userName: string;
  userEmail: string;
  itemName: string;
  itemType: string;
  pageContext: string;
  actionType: 'learn_more' | 'request_assistance' | 'consultant_request';
}

export interface OTPEmailData {
  userEmail: string;
  otpCode: string;
  userName?: string;
}

export interface OnboardingEmailData {
  userEmail: string;
  userName: string;
  userRole: string;
  loginLink?: string;
}

export const sendInterestNotification = async (data: InterestEmailData): Promise<boolean> => {
  return withDemoFallback(async () => {
    const templateParams = {
      to_email: 'namandevops44@gmail.com',
      from_name: 'Family Office Platform',
      from_email: 'namandevops44@gmail.com',
      subject: `Interest Expressed: ${data.itemName}`,
      message: `${data.userName} (${data.userEmail}) has expressed interest in "${data.itemName}" in the ${data.itemType} section on the ${data.pageContext} page.

User Details:
- Name: ${data.userName}
- Email: ${data.userEmail}
- Item of Interest: ${data.itemName}
- Category: ${data.itemType}
- Page: ${data.pageContext}

Please follow up with this client regarding their interest.`,
      user_name: data.userName,
      user_email: data.userEmail,
      item_name: data.itemName,
      item_type: data.itemType,
      page_context: data.pageContext
    };

    console.log('Sending interest email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Interest email sent successfully:', result);
    return true;
  }, '/emails/interest', true);
};

export const sendLearnMoreNotification = async (data: LearnMoreEmailData): Promise<boolean> => {
  try {
    let subjectPrefix = 'Learn More Request';
    let messagePrefix = 'wants to learn more about';
    
    switch (data.actionType) {
      case 'request_assistance':
        subjectPrefix = 'Assistance Request';
        messagePrefix = 'is requesting assistance with';
        break;
      case 'consultant_request':
        subjectPrefix = 'Consultant Request';
        messagePrefix = 'is requesting a consultant for';
        break;
      default:
        subjectPrefix = 'Learn More Request';
        messagePrefix = 'wants to learn more about';
    }

    const templateParams = {
      to_email: 'namandevops44@gmail.com',
      from_name: 'Family Office Platform',
      from_email: 'namandevops44@gmail.com',
      subject: `${subjectPrefix}: ${data.itemName}`,
      message: `${data.userName} (${data.userEmail}) ${messagePrefix} "${data.itemName}" in the ${data.itemType} section on the ${data.pageContext} page.

User Details:
- Name: ${data.userName}
- Email: ${data.userEmail}
- Item: ${data.itemName}
- Category: ${data.itemType}
- Page: ${data.pageContext}
- Request Type: ${data.actionType.replace('_', ' ').toUpperCase()}

Please provide the appropriate support to this client.`,
      user_name: data.userName,
      user_email: data.userEmail,
      item_name: data.itemName,
      item_type: data.itemType,
      page_context: data.pageContext,
      action_type: data.actionType,
      request_type: subjectPrefix
    };

    console.log('Sending request email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_LEARN_MORE_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Request email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send request email:', error);
    return false;
  }
};

export const sendOTPEmail = async (data: OTPEmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: data.userEmail,
      to_name: data.userName || 'User',
      otp_code: data.otpCode,
      from_name: 'Family Office Security',
      subject: 'Your Two-Factor Authentication Code',
      message: `Your verification code is: ${data.otpCode}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email.`
    };

    console.log('Sending OTP email to:', data.userEmail);

    const result = await emailjs.send(
      EMAILJS_OTP_SERVICE_ID,
      EMAILJS_OTP_TEMPLATE_ID,
      templateParams,
      EMAILJS_OTP_PUBLIC_KEY
    );

    console.log('OTP email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
};

export const sendOnboardingEmail = async (data: OnboardingEmailData): Promise<boolean> => {
  try {
    const { userEmail, userName, userRole, loginLink = 'https://my.bfocfo.com' } = data;
    let templateId = '';
    let emailSubject = '';

    // Determine template based on role
    if (userRole === 'client') {
      templateId = EMAILJS_CLIENT_ONBOARDING_TEMPLATE;
      emailSubject = 'Welcome to Your Family Office Platform';
    } else if (['advisor', 'accountant', 'attorney', 'consultant'].includes(userRole)) {
      templateId = EMAILJS_PROFESSIONAL_ONBOARDING_TEMPLATE;
      emailSubject = 'Welcome to the Family Office Professional Platform';
    } else if (['admin', 'system_administrator', 'tenant_admin'].includes(userRole)) {
      templateId = EMAILJS_ADMIN_ONBOARDING_TEMPLATE;
      emailSubject = 'Administrator Access - Family Office Platform';
    }

    if (!templateId) {
      console.warn('No onboarding template found for role:', userRole);
      return false;
    }

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      user_role: userRole,
      login_link: loginLink,
      from_name: 'Family Office Platform',
      subject: emailSubject,
      platform_name: 'MyBFOCFO'
    };

    console.log('Sending onboarding email:', { email: userEmail, role: userRole, template: templateId });

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Onboarding email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send onboarding email:', error);
    return false;
  }
};
