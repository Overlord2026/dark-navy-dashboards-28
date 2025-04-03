
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { processStripeWebhook } from '@/services/api/stripeWebhookHandler';

export const StripeWebhookDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState('whsec_example_signature_1234567890');
  const [payload, setPayload] = useState(
    JSON.stringify({
      id: 'evt_test_webhook',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            courseId: '1',
            userId: 'user-123'
          },
          customer_email: 'student@example.com'
        }
      },
      created: Math.floor(Date.now() / 1000)
    }, null, 2)
  );
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleProcessWebhook = async () => {
    if (!payload.trim()) {
      toast.error('Please enter a webhook payload');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await processStripeWebhook(payload, signature);
      
      if (response.success) {
        setResult(response.data);
        toast.success(response.message || 'Webhook processed successfully');
      } else {
        setError(response.error || 'Failed to process webhook');
        toast.error(response.error || 'Failed to process webhook');
      }
    } catch (err) {
      console.error('Error processing webhook:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const setExamplePayload = (eventType: string) => {
    let examplePayload: any = {
      id: `evt_test_${eventType.replace('.', '_')}_${Date.now()}`,
      type: eventType,
      data: {
        object: {
          id: `${eventType.split('.')[0]}_test_123`,
          metadata: {
            courseId: '1',
            userId: 'user-123'
          }
        }
      },
      created: Math.floor(Date.now() / 1000)
    };

    // Add event-specific data
    if (eventType === 'checkout.session.completed') {
      examplePayload.data.object.customer_email = 'student@example.com';
      examplePayload.data.object.payment_status = 'paid';
    } else if (eventType === 'payment_intent.succeeded') {
      examplePayload.data.object.amount = 4999;
      examplePayload.data.object.currency = 'usd';
      examplePayload.data.object.status = 'succeeded';
    }

    setPayload(JSON.stringify(examplePayload, null, 2));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stripe Webhook API Demo</CardTitle>
          <CardDescription>
            Test the POST /api/stripe/webhook endpoint with simulated Stripe events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signature">Stripe Signature</Label>
            <Input 
              id="signature" 
              value={signature} 
              onChange={(e) => setSignature(e.target.value)} 
              placeholder="Enter Stripe signature"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              In a real webhook, this would be the value from the 'Stripe-Signature' header
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="payload">Webhook Payload (JSON)</Label>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExamplePayload('checkout.session.completed')}
                >
                  Checkout Completed
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExamplePayload('payment_intent.succeeded')}
                >
                  Payment Succeeded
                </Button>
              </div>
            </div>
            <Textarea 
              id="payload" 
              value={payload} 
              onChange={(e) => setPayload(e.target.value)} 
              className="min-h-[200px] font-mono text-sm"
              placeholder="Enter webhook payload as JSON"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleProcessWebhook} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing Webhook
              </>
            ) : (
              'Process Webhook'
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Webhook Processing Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
