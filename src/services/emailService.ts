
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_9eb6z0x';
const EMAILJS_TEMPLATE_ID = 'template_0ttdq0e';
const EMAILJS_PUBLIC_KEY = 'wQLcDkoexVMbd51B9';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface InterestEmailData {
  userName: string;
  userEmail: string;
  itemName: string;
  itemType: string;
  pageContext: string;
}

export const sendInterestNotification = async (data: InterestEmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: 'namandevops44@gmail.com',
      from_name: 'Family Office Platform',
      from_email: 'noreply@familyoffice.com',
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

    console.log('Sending email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
