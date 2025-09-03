# Stripe Integration Documentation

## Overview
The BFO platform integrates with Stripe to handle payment processing, subscription management, and fee collection for advisory services.

## Integration Architecture

### Components
- **Frontend**: Stripe Elements for secure payment forms
- **Backend**: Supabase Edge Functions for payment processing
- **Database**: Payment and subscription tracking
- **Webhooks**: Real-time payment status updates

### Payment Flow
```
Client → Stripe Elements → Payment Method → Edge Function → Stripe API → Webhook → Database Update
```

## Edge Functions

### 1. create-checkout
**Purpose**: Create Stripe Checkout sessions for subscription payments

**Location**: `supabase/functions/create-checkout/index.ts`

**Functionality**:
- Creates checkout sessions for advisory fee subscriptions
- Handles both one-time and recurring payments
- Manages customer creation and updates
- Configures success/cancel URLs

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('create-checkout', {
  body: {
    price_id: 'price_advisory_monthly',
    customer_email: user.email,
    success_url: window.location.origin + '/success',
    cancel_url: window.location.origin + '/pricing'
  }
});
```

### 2. customer-portal
**Purpose**: Create Stripe Customer Portal sessions for subscription management

**Location**: `supabase/functions/customer-portal/index.ts`

**Functionality**:
- Generates portal links for existing customers
- Allows subscription modifications and cancellations
- Handles billing history and invoice downloads
- Updates payment methods

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('customer-portal', {
  body: {
    return_url: window.location.origin + '/dashboard'
  }
});
```

### 3. check-subscription
**Purpose**: Verify and sync subscription status

**Location**: `supabase/functions/check-subscription/index.ts`

**Functionality**:
- Retrieves current subscription status from Stripe
- Updates local database with subscription details
- Handles subscription tier changes
- Manages access control based on subscription

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('check-subscription');
```

### 4. stripe-webhook
**Purpose**: Handle Stripe webhook events

**Location**: `supabase/functions/stripe-webhook/index.ts`

**Functionality**:
- Processes subscription lifecycle events
- Updates payment status and customer records
- Handles failed payments and retries
- Manages subscription renewals and cancellations

**Webhook Events Handled**:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Database Schema

### Tables

#### subscribers
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  payment_method TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### advisory_fees
```sql
CREATE TABLE advisory_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  advisor_id UUID NOT NULL,
  fee_type TEXT NOT NULL, -- 'management', 'performance', 'flat'
  fee_basis TEXT NOT NULL, -- 'aum', 'transaction', 'hourly'
  fee_rate NUMERIC NOT NULL,
  fee_amount NUMERIC,
  billing_frequency TEXT NOT NULL, -- 'monthly', 'quarterly', 'annually'
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Frontend Components

### SubscriptionPlans
```typescript
export const SubscriptionPlans = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$99',
      stripe_price_id: 'price_starter_monthly',
      features: ['5 Client limit', 'Basic reporting', 'Email support']
    },
    {
      name: 'Professional', 
      price: '$299',
      stripe_price_id: 'price_professional_monthly',
      features: ['25 Client limit', 'Advanced analytics', 'Phone support']
    },
    {
      name: 'Enterprise',
      price: '$599', 
      stripe_price_id: 'price_enterprise_monthly',
      features: ['Unlimited clients', 'Custom reports', 'Dedicated support']
    }
  ];

  const handleSubscribe = async (priceId) => {
    const { data } = await supabase.functions.invoke('create-checkout', {
      body: { price_id: priceId }
    });
    
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map(plan => (
        <div key={plan.name} className="bfo-card">
          <h3>{plan.name}</h3>
          <div className="text-2xl font-bold">{plan.price}/month</div>
          <ul>
            {plan.features.map(feature => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Button onClick={() => handleSubscribe(plan.stripe_price_id)}>
            Subscribe
          </Button>
        </div>
      ))}
    </div>
  );
};
```

### PaymentForm
```typescript
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    
    const { data } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount, currency: 'usd' }
    });

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      data.client_secret,
      { payment_method: { card: cardElement } }
    );

    if (error) {
      console.error('Payment failed:', error);
    } else {
      onSuccess(paymentIntent);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={loading || !stripe}>
        Pay ${amount}
      </Button>
    </form>
  );
};
```

### SubscriptionStatus
```typescript
export const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkSubscription = async () => {
      const { data } = await supabase.functions.invoke('check-subscription');
      setSubscription(data);
    };

    if (user) {
      checkSubscription();
    }
  }, [user]);

  const openCustomerPortal = async () => {
    const { data } = await supabase.functions.invoke('customer-portal');
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  if (!subscription?.subscribed) {
    return (
      <div className="bfo-card">
        <h3>No Active Subscription</h3>
        <p>Subscribe to access premium features</p>
        <Button href="/pricing">View Plans</Button>
      </div>
    );
  }

  return (
    <div className="bfo-card">
      <h3>Current Subscription</h3>
      <div className="flex justify-between items-center">
        <div>
          <p>Plan: {subscription.subscription_tier}</p>
          <p>Renewal: {new Date(subscription.subscription_end).toLocaleDateString()}</p>
        </div>
        <Button onClick={openCustomerPortal}>
          Manage Subscription
        </Button>
      </div>
    </div>
  );
};
```

## Advisory Fee Management

### Fee Structure Configuration
```typescript
export const AdvisoryFeeSetup = ({ clientId }) => {
  const [feeStructure, setFeeStructure] = useState({
    fee_type: 'management',
    fee_basis: 'aum',
    fee_rate: 1.0, // 1.0%
    billing_frequency: 'quarterly'
  });

  const createFeeSchedule = async () => {
    // Create Stripe subscription for advisory fees
    const { data } = await supabase.functions.invoke('create-advisory-subscription', {
      body: {
        client_id: clientId,
        fee_structure: feeStructure
      }
    });
  };

  return (
    <form onSubmit={createFeeSchedule}>
      <div>
        <label>Fee Type</label>
        <select value={feeStructure.fee_type} onChange={...}>
          <option value="management">Management Fee</option>
          <option value="performance">Performance Fee</option>
          <option value="flat">Flat Fee</option>
        </select>
      </div>
      
      <div>
        <label>Fee Rate (%)</label>
        <input 
          type="number" 
          step="0.01"
          value={feeStructure.fee_rate}
          onChange={...}
        />
      </div>
      
      <div>
        <label>Billing Frequency</label>
        <select value={feeStructure.billing_frequency} onChange={...}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      </div>
      
      <Button type="submit">Setup Fee Schedule</Button>
    </form>
  );
};
```

## Security and Compliance

### PCI Compliance
- Stripe Elements for secure card data handling
- No sensitive card data stored on BFO servers
- PCI DSS compliance through Stripe

### Data Protection
- Encrypted customer and payment data
- Secure webhook endpoint verification
- Regular security audits and monitoring

### Access Controls
- Role-based access to payment functionality
- Advisor-specific payment permissions
- Client consent for fee processing

## Testing and Development

### Test Mode Configuration
```typescript
// Use Stripe test keys for development
const stripeTestKey = 'pk_test_...';
const stripe = loadStripe(stripeTestKey);

// Test card numbers
const testCards = {
  visa: '4242424242424242',
  declined: '4000000000000002',
  3ds: '4000000000003220'
};
```

### Webhook Testing
- Use Stripe CLI for local webhook testing
- Test webhook endpoints with sample events
- Verify database updates from webhook processing

## Monitoring and Reporting

### Payment Analytics
- Revenue tracking and reporting
- Subscription churn analysis
- Payment failure monitoring
- Customer lifetime value metrics

### Operational Metrics
- Payment processing success rates
- Subscription renewal rates
- Customer support tickets
- Dispute and chargeback tracking

## Error Handling

### Common Scenarios
1. **Card Declined**: Handle various decline reasons
2. **Insufficient Funds**: Retry logic and notifications
3. **Expired Cards**: Automatic update requests
4. **Webhook Failures**: Retry mechanisms and alerting

### Error Recovery
```typescript
const handlePaymentError = (error) => {
  switch (error.code) {
    case 'card_declined':
      showDeclinedCardMessage();
      break;
    case 'insufficient_funds':
      showInsufficientFundsMessage();
      break;
    case 'expired_card':
      showExpiredCardMessage();
      break;
    default:
      showGenericErrorMessage();
  }
};
```