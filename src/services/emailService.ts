
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_9eb6z0x';
const EMAILJS_TEMPLATE_ID = 'template_0ttdq0e';
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

export const sendInterestNotification = async (data: InterestEmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: 'namandevops44@gmail.com',
      from_name: 'Family Office Platform',
      from_email: 'namandevops44@gmail.com',
      subject: `Interest Expressed: ${data.itemName}`,
      message: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Interest Notification</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: #f8fafc;
              color: #334155;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 24px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 32px 24px;
            }
            .alert-box {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 16px;
              margin-bottom: 24px;
              border-radius: 4px;
            }
            .alert-box h2 {
              margin: 0 0 8px 0;
              font-size: 18px;
              color: #92400e;
            }
            .alert-box p {
              margin: 0;
              color: #92400e;
            }
            .details-card {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .details-header {
              font-size: 16px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 16px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 500;
              color: #64748b;
              min-width: 120px;
            }
            .detail-value {
              font-weight: 600;
              color: #1e293b;
              text-align: right;
            }
            .highlight {
              background-color: #dbeafe;
              color: #1e40af;
              padding: 2px 8px;
              border-radius: 4px;
              font-weight: 600;
            }
            .action-section {
              background-color: #f1f5f9;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
              text-align: center;
            }
            .action-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 8px;
            }
            .footer {
              background-color: #1e293b;
              color: #94a3b8;
              padding: 20px 24px;
              text-align: center;
              font-size: 14px;
            }
            .footer-logo {
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Interest Notification</h1>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <h2>📈 Client Interest Alert</h2>
                <p>A client has expressed interest in one of your offerings and is ready to engage!</p>
              </div>

              <div class="details-card">
                <div class="details-header">👤 Client Information</div>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${data.userName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${data.userEmail}</span>
                </div>
              </div>

              <div class="details-card">
                <div class="details-header">💼 Interest Details</div>
                <div class="detail-row">
                  <span class="detail-label">Item:</span>
                  <span class="detail-value highlight">${data.itemName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Category:</span>
                  <span class="detail-value">${data.itemType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Page:</span>
                  <span class="detail-value">${data.pageContext}</span>
                </div>
              </div>

              <div class="action-section">
                <h3 style="margin-top: 0; color: #1e293b;">🚀 Next Steps</h3>
                <p style="margin-bottom: 20px; color: #64748b;">Follow up with this client to discuss their interest and provide personalized recommendations.</p>
                <a href="mailto:${data.userEmail}?subject=Re: Interest in ${data.itemName}" class="action-button">
                  📧 Reply to Client
                </a>
                <a href="tel:+18005551234" class="action-button">
                  📞 Schedule Call
                </a>
              </div>

              <div style="background-color: #ecfdf5; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; color: #065f46; font-size: 14px;">
                  <strong>💡 Pro Tip:</strong> Respond within 24 hours to maximize conversion rates and client satisfaction.
                </p>
              </div>
            </div>

            <div class="footer">
              <div class="footer-logo">Family Office Platform</div>
              <div>This is an automated notification from your client engagement system.</div>
            </div>
          </div>
        </body>
        </html>
      `,
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
