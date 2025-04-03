
// Interface for Stripe webhook event
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  signature?: string;
}

// Interface for webhook response
export interface WebhookResponse {
  received: boolean;
  processed: boolean;
  eventType?: string;
  error?: string;
}
