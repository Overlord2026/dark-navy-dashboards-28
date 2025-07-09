
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_9eb6z0x';
const EMAILJS_TEMPLATE_ID = 'template_0ttdq0e';
const EMAILJS_LEARN_MORE_TEMPLATE_ID = 'template_hg3d85z';
const EMAILJS_PUBLIC_KEY = 'rfbjUYJ8iPHEZaQvx';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

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

export const sendInterestNotification = async (data: InterestEmailData): Promise<boolean> => {
  try {
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
  } catch (error) {
    console.error('Failed to send interest email:', error);
    return false;
  }
};

export interface OTPEmailData {
  userName: string;
  userEmail: string;
  otpCode: string;
}

export const sendOTPEmail = async (data: OTPEmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: data.userEmail,
      from_name: 'Family Office Platform',
      from_email: 'namandevops44@gmail.com',
      subject: 'Your Verification Code',
      message: `Your verification code for Two-Factor Authentication is: ${data.otpCode}

This code will expire in 5 minutes for security purposes.

If you didn't request this code, please ignore this email.`,
      user_name: data.userName,
      user_email: data.userEmail,
      otp_code: data.otpCode
    };

    console.log('Sending OTP email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID, // Using the existing template
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('OTP email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
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
