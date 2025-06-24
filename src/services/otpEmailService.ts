
import emailjs from '@emailjs/browser';

// EmailJS configuration (reusing existing setup)
const EMAILJS_SERVICE_ID = 'service_9eb6z0x';
const EMAILJS_OTP_TEMPLATE_ID = 'template_otp_verification'; // You'll need to create this template
const EMAILJS_PUBLIC_KEY = 'rfbjUYJ8iPHEZaQvx';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface OTPEmailData {
  userEmail: string;
  userName: string;
  otpCode: string;
}

export const sendOTPEmail = async (data: OTPEmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: data.userEmail,
      from_name: 'Boutique Family Office',
      from_email: 'namandevops44@gmail.com',
      subject: 'Your Login Verification Code',
      user_name: data.userName,
      otp_code: data.otpCode,
      message: `Your verification code is: ${data.otpCode}

This code will expire in 5 minutes. Enter this code to complete your login.

If you didn't request this code, please ignore this email or contact support if you have concerns.

© ${new Date().getFullYear()} Boutique Family Office. All rights reserved.`
    };

    console.log('Sending OTP email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_OTP_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('OTP email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    
    // Fallback to existing email service if OTP template doesn't exist
    try {
      console.log('Trying fallback email method...');
      const fallbackParams = {
        to_email: 'namandevops44@gmail.com',
        from_name: 'Family Office Platform',
        from_email: 'namandevops44@gmail.com',
        subject: `OTP Verification Request for ${data.userEmail}`,
        message: `User ${data.userName} (${data.userEmail}) is requesting login verification.

Verification Code: ${data.otpCode}

This is an automated OTP verification email.`,
        user_name: data.userName,
        user_email: data.userEmail,
        item_name: `Verification Code: ${data.otpCode}`,
        item_type: 'OTP Verification',
        page_context: 'Authentication'
      };

      const fallbackResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_0ttdq0e', // Existing template
        fallbackParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Fallback OTP email sent successfully:', fallbackResult);
      return true;
    } catch (fallbackError) {
      console.error('Fallback OTP email also failed:', fallbackError);
      return false;
    }
  }
};
