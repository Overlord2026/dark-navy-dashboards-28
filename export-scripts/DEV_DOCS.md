# Integration Architecture Documentation

## Overview

This document outlines the modular integration architecture for external partner connections in the wealth management platform. The architecture is designed to be extensible, secure, and maintainable.

## Integration Types

### 1. Schwab Integration (`schwab`)
- **Purpose**: Connect to Charles Schwab custodial accounts for real-time portfolio data
- **Authentication**: OAuth 2.0
- **API Endpoint**: `https://api.schwabapi.com/oauth/authorize`
- **Documentation**: https://developer.schwab.com/
- **Status**: Placeholder implementation

### 2. Advyzon Integration (`advyzon`) 
- **Purpose**: Sync client data with Advyzon portfolio management system
- **Authentication**: API Key
- **API Endpoint**: `https://api.advyzon.com/`
- **Documentation**: Contact Advyzon for API documentation
- **Status**: Placeholder implementation

### 3. CPA Integration (`cpa`)
- **Purpose**: Share financial data with CPA for tax planning and preparation
- **Authentication**: Secure file transfer (SFTP) or API connections
- **Supported Platforms**: ProConnect, Lacerte, UltraTax, Drake
- **Status**: Placeholder implementation

### 4. Attorney Integration (`attorney`)
- **Purpose**: Collaborate on estate planning documents and strategies
- **Authentication**: Secure portal setup or API
- **Supported Platforms**: NetDocuments, iManage, SharePoint
- **Status**: Placeholder implementation

## Architecture Components

### Core Types (`src/types/integrations.ts`)
```typescript
export type IntegrationType = 'schwab' | 'advyzon' | 'cpa' | 'attorney';
export type IntegrationStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  enabled: boolean;
  lastSync?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface IntegrationConnector {
  type: IntegrationType;
  name: string;
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  sync: () => Promise<void>;
  getStatus: () => IntegrationStatus;
}
```

### Integration Service (`src/services/integrations/IntegrationService.ts`)
- Centralized management of all integrations
- Handles connection attempts and status tracking
- Provides audit logging for all integration activities
- Thread-safe state management

### Connectors (`src/services/integrations/connectors/`)
Each integration type has its own connector implementing the `IntegrationConnector` interface:
- `SchwabConnector.ts` - OAuth-based Schwab API integration
- `AdvyzonConnector.ts` - API key-based CRM integration  
- `CPAConnector.ts` - Tax software integration
- `AttorneyConnector.ts` - Document management integration

## UI Components

### IntegrationConnectButton (`src/components/integrations/IntegrationConnectButton.tsx`)
- Reusable button component for connecting to any integration type
- Shows appropriate status icons and text
- Handles disabled state with educational modal
- Provides user feedback for connection attempts

### IntegrationsPanel (`src/components/integrations/IntegrationsPanel.tsx`)
- Container component that displays available integrations
- Only shows enabled integrations based on feature flags
- Used in Wealth, Vault, and Settings tabs

### IntegrationManagement (`src/components/settings/IntegrationManagement.tsx`)
- Admin-only component for managing integration settings
- Combines with FeatureFlagManagement for complete control
- Only visible to system administrators

## Feature Flag Integration

Integration visibility is controlled through feature flags:
- `integration_schwab` - Enable/disable Schwab integration
- `integration_advyzon` - Enable/disable Advyzon integration
- `integration_cpa` - Enable/disable CPA integration
- `integration_attorney` - Enable/disable Attorney integration

## Security & Audit Logging

All integration activities are logged through the audit system:
- `integration_connect_attempt` - When user clicks connect
- `integration_connected` - Successful connection
- `integration_connect_failed` - Failed connection attempt
- `integration_disconnect` - Disconnection events

## Implementation Guidelines

### Adding New Integration Types

1. **Add Type Definition**
   ```typescript
   // Add to IntegrationType union in src/types/integrations.ts
   export type IntegrationType = 'schwab' | 'advyzon' | 'cpa' | 'attorney' | 'new_type';
   ```

2. **Create Connector**
   ```typescript
   // Create src/services/integrations/connectors/NewTypeConnector.ts
   export class NewTypeConnector implements IntegrationConnector {
     type = 'new_type' as const;
     // Implement required methods
   }
   ```

3. **Register Integration**
   ```typescript
   // Add to IntegrationService.initializeIntegrations()
   {
     id: 'new-type-integration',
     type: 'new_type',
     name: 'New Type Platform',
     description: 'Integration description',
     status: 'disconnected',
     enabled: false
   }
   ```

4. **Add Feature Flag**
   ```typescript
   // Add to AVAILABLE_FEATURES in FeatureFlagManagement.tsx
   {
     name: 'integration_new_type',
     label: 'New Type Integration',
     description: 'Connect to New Type platform',
     icon: Settings,
     category: 'Integrations'
   }
   ```

### Security Considerations

1. **Credentials Storage**: All API keys and tokens must be encrypted
2. **Audit Logging**: Every integration action must be logged
3. **Rate Limiting**: Implement appropriate rate limits for API calls
4. **Error Handling**: Graceful degradation when integrations fail
5. **User Permissions**: Verify user has permission before connecting

### Testing Integration Implementations

1. **Mock Connectors**: Create mock implementations for testing
2. **Feature Flags**: Use feature flags to control rollout
3. **Audit Verification**: Verify all actions are properly logged
4. **Error Scenarios**: Test connection failures and recoveries
5. **User Experience**: Test disabled integration educational flow

## Deployment Checklist

- [ ] Feature flags configured for target environment
- [ ] API credentials securely stored in Supabase secrets
- [ ] Audit logging verified in target environment
- [ ] Integration UI tested with various user roles
- [ ] Educational modals reviewed for accuracy
- [ ] Error handling tested for all failure scenarios
- [ ] Rate limiting configured appropriately
- [ ] Security review completed for credential handling

## Future Enhancements

1. **Real-time Sync**: Implement webhook-based real-time synchronization
2. **Bulk Operations**: Support for bulk data import/export
3. **Integration Health Monitoring**: Dashboard for integration status
4. **Custom Field Mapping**: Allow users to configure field mappings
5. **Integration Analytics**: Track usage and performance metrics
6. **Multi-tenant Isolation**: Ensure proper tenant isolation for enterprise
7. **Integration Marketplace**: Plugin marketplace for third-party integrations

## Support Resources

- **Integration Issues**: Contact support team with integration type and error details
- **API Documentation**: Links provided in each connector implementation
- **Feature Requests**: Submit through standard feature request process
- **Security Concerns**: Report through security incident process