# Plaid Integration Documentation

## Overview
The BFO platform integrates with Plaid to provide secure bank account connectivity, transaction data aggregation, and net worth verification for clients and prospects.

## Integration Architecture

### Components
- **Frontend**: Plaid Link component for account connection
- **Backend**: Supabase Edge Functions for token exchange and data sync
- **Database**: Account and transaction storage with RLS policies
- **Security**: Encrypted token storage and secure API communication

### Data Flow
```
Client Browser → Plaid Link → Public Token → Edge Function → Exchange → Access Token → Supabase
                                    ↓
Account Data ← Plaid API ← Access Token ← Edge Function ← Webhook ← Plaid
```

## Edge Functions

### 1. plaid-create-link-token
**Purpose**: Generate Plaid Link tokens for account connection

**Location**: `supabase/functions/plaid-create-link-token/index.ts`

**Functionality**:
- Creates user-specific Link tokens
- Configures account types (checking, savings, investment)
- Sets webhook URL for real-time updates
- Returns token for frontend Link initialization

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('plaid-create-link-token', {
  body: { user_id: auth.user.id }
});
```

### 2. plaid-exchange-public-token
**Purpose**: Exchange public tokens for access tokens

**Location**: `supabase/functions/plaid-exchange-public-token/index.ts`

**Functionality**:
- Exchanges public token from Link for access token
- Stores encrypted access token in database
- Initiates initial account and transaction sync
- Creates account records with proper user association

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('plaid-exchange-public-token', {
  body: { 
    public_token: publicToken,
    metadata: linkMetadata 
  }
});
```

### 3. plaid-sync-accounts
**Purpose**: Synchronize account data and transactions

**Location**: `supabase/functions/plaid-sync-accounts/index.ts`

**Functionality**:
- Fetches latest account balances
- Retrieves new transactions
- Updates account metadata
- Handles account status changes
- Implements incremental sync for performance

**Usage**:
```typescript
// Triggered automatically via webhook or manually
const { data, error } = await supabase.functions.invoke('plaid-sync-accounts', {
  body: { 
    user_id: auth.user.id,
    force_sync: false 
  }
});
```

### 4. plaid-net-worth-verification
**Purpose**: Calculate and verify client net worth

**Location**: `supabase/functions/plaid-net-worth-verification/index.ts`

**Functionality**:
- Aggregates account balances across institutions
- Calculates liquid net worth
- Provides verification for advisor workflows
- Generates net worth trend analysis

## Database Schema

### Tables

#### accounts
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  connector_account_id UUID NOT NULL,
  institution_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  account_number TEXT NOT NULL,
  current_balance NUMERIC,
  available_balance NUMERIC,
  currency TEXT NOT NULL DEFAULT 'USD',
  account_status TEXT NOT NULL DEFAULT 'active',
  last_updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### plaid_items
```sql
CREATE TABLE plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  item_id TEXT NOT NULL UNIQUE,
  access_token_encrypted TEXT NOT NULL,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  consent_expiration_time TIMESTAMP WITH TIME ZONE,
  update_type TEXT,
  webhook_url TEXT,
  error_code TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  plaid_transaction_id TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  authorized_date DATE,
  name TEXT NOT NULL,
  merchant_name TEXT,
  category JSONB,
  subcategory TEXT,
  pending BOOLEAN NOT NULL DEFAULT false,
  account_owner TEXT,
  transaction_type TEXT,
  iso_currency_code TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

## Frontend Components

### PlaidLinkComponent
```typescript
import { usePlaidLink } from 'react-plaid-link';

export const PlaidLinkComponent = ({ onSuccess, onExit }) => {
  const [linkToken, setLinkToken] = useState(null);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken, metadata) => {
      // Exchange public token via edge function
      exchangePublicToken(publicToken, metadata);
    },
    onExit: (err, metadata) => {
      onExit?.(err, metadata);
    },
  });

  const createLinkToken = async () => {
    const { data } = await supabase.functions.invoke('plaid-create-link-token');
    setLinkToken(data.link_token);
  };

  return (
    <Button 
      onClick={() => open()} 
      disabled={!ready}
      className="bfo-cta"
    >
      Connect Your Bank Account
    </Button>
  );
};
```

### AccountsOverview
```typescript
export const AccountsOverview = () => {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('account_status', 'active');
      
      setAccounts(data || []);
      
      const total = data?.reduce((sum, account) => 
        sum + (account.current_balance || 0), 0) || 0;
      setNetWorth(total);
    };

    fetchAccounts();
  }, [user.id]);

  return (
    <div className="bfo-card">
      <h3>Connected Accounts</h3>
      <div className="net-worth">
        Total Balance: ${netWorth.toLocaleString()}
      </div>
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};
```

## Webhook Handling

### Plaid Webhook Endpoint
The system handles various Plaid webhooks for real-time updates:

- **TRANSACTIONS**: New transaction notifications
- **ITEM**: Item status changes and errors
- **ACCOUNTS**: Account updates and modifications
- **HOLDINGS**: Investment account changes

### Webhook Processing
```typescript
// In webhook edge function
export const handlePlaidWebhook = async (webhook) => {
  const { webhook_type, webhook_code, item_id } = webhook;

  switch (webhook_type) {
    case 'TRANSACTIONS':
      await syncTransactions(item_id);
      break;
    case 'ITEM':
      await updateItemStatus(item_id, webhook_code);
      break;
    case 'ACCOUNTS':
      await syncAccounts(item_id);
      break;
    default:
      console.log('Unhandled webhook type:', webhook_type);
  }
};
```

## Security Considerations

### Data Encryption
- Access tokens encrypted using Supabase vault
- Sensitive account data encrypted at rest
- TLS encryption for all API communications

### Access Controls
- Row Level Security (RLS) policies restrict user access
- Service role used for system operations
- Rate limiting on API endpoints

### Compliance
- PCI DSS compliance for payment card data
- SOC 2 Type II certification
- GDPR and CCPA privacy compliance
- Financial data retention policies

## Error Handling

### Common Error Scenarios
1. **Item Error**: Bank requires re-authentication
2. **Access Revoked**: User disconnected account at bank
3. **Invalid Credentials**: Login credentials expired
4. **Rate Limiting**: API request limits exceeded

### Error Recovery
```typescript
const handlePlaidError = (error) => {
  switch (error.error_code) {
    case 'ITEM_LOGIN_REQUIRED':
      // Prompt user to update login credentials
      showReconnectFlow();
      break;
    case 'ACCESS_NOT_GRANTED':
      // User denied access during Link flow
      showPermissionError();
      break;
    case 'RATE_LIMIT_EXCEEDED':
      // Implement exponential backoff
      scheduleRetry();
      break;
    default:
      logError(error);
  }
};
```

## Testing and Development

### Sandbox Environment
- Use Plaid Sandbox for development
- Test credentials for various scenarios
- Webhook testing with ngrok or similar

### Test Scenarios
1. **Successful Connection**: Normal account linking flow
2. **Error Handling**: Various error conditions
3. **Webhook Processing**: Real-time update handling
4. **Data Sync**: Account and transaction synchronization

## Monitoring and Analytics

### Key Metrics
- Connection success rates
- Data sync frequency and reliability
- Error rates by type
- User engagement with financial data

### Logging
- Comprehensive error logging
- Performance monitoring
- Security event tracking
- User activity analytics