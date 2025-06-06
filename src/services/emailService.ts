
import emailjs from '@emailjs/browser';

interface EmailNotificationData {
  userEmail: string;
  userName: string;
  assetName: string;
  timestamp: string;
}

class EmailService {
  private serviceId = 'service_9eb6z0x';
  private templateId = 'template_0ttdq0e';
  private publicKey = 'wQLcDkoexVMbd51B9';

  constructor() {
    emailjs.init(this.publicKey);
  }

  async sendInterestNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      const templateParams = {
        to_email: 'namandevops44@gmail.com',
        from_name: data.userName,
        from_email: data.userEmail,
        subject: `New Interest Expressed - ${data.assetName}`,
        message: `${data.userName} (${data.userEmail}) has expressed interest in "${data.assetName}" on ${data.timestamp}.`,
        asset_name: data.assetName,
        user_name: data.userName,
        user_email: data.userEmail,
        request_time: data.timestamp
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
