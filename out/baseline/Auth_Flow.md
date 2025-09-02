# Authentication Flow - Family Office Marketplace

## Authentication System Overview

### Provider: Supabase Auth
- **Client**: `/src/integrations/supabase/client.ts`
- **Session Management**: LocalStorage persistence
- **Auto Refresh**: Enabled
- **Multi-tenant**: Supported via tenant_id

### Login Flow

#### 1. Initial Session Check
```typescript
// App.tsx lines 248-259
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setIsAuthenticated(!!session);
  });
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => setIsAuthenticated(!!session)
  );
  
  return () => subscription.unsubscribe();
}, []);
```

#### 2. Authentication State
- **Authenticated Users**: Redirect to `/family/home`
- **Unauthenticated Users**: Redirect to `/nil/onboarding` or `/discover`
- **Real-time Updates**: Auth state changes propagated immediately

#### 3. Session Persistence
- **Storage**: Browser localStorage
- **Auto-refresh**: Tokens refreshed before expiration
- **Cross-tab Sync**: Auth state synchronized across browser tabs

### Route Protection

#### Protected Routes Pattern
```typescript
<Route path="/family/*" element={
  <ProtectedRoute>
    <FamilyComponent />
  </ProtectedRoute>
} />
```

#### ProtectedRoute Component
- **Location**: `/src/components/auth/ProtectedRoute.tsx`
- **Function**: Redirects unauthenticated users to login
- **Fallback**: Loading state during auth check

#### Admin Routes
```typescript
<Route path="/admin/*" element={
  <RequireAdmin>
    <AdminComponent />
  </RequireAdmin>
} />
```

#### RequireAdmin Component
- **Location**: `/src/components/auth/RequireAdmin.tsx`
- **Function**: Role-based access control
- **Roles**: admin, system_administrator, tenant_admin

### User Roles & Access Control

#### Role Hierarchy
1. **System Administrator**: Full system access
2. **Tenant Admin**: Tenant-scoped admin access
3. **Admin**: General admin permissions
4. **Advisor**: Advisor-specific features
5. **Client**: Standard user access
6. **Professional**: Professional services access

#### Role Checking
```typescript
// src/hooks/useAuth.ts
export { hasRoleAccess, ROLE_GROUPS, ROLE_HIERARCHY }
```

#### RLS (Row Level Security)
- **Database Level**: Supabase RLS policies
- **User Scoping**: Data filtered by user_id/tenant_id
- **Policy Enforcement**: Automatic at database layer

### Login Methods

#### 1. Email/Password
- Standard email authentication
- Password requirements enforced
- Password reset flow available

#### 2. Magic Links
- Email-based passwordless login
- Secure token generation
- Time-limited access

#### 3. OAuth Providers
- Google, GitHub, etc. (configurable)
- Social login integration
- Profile data synchronization

### Logout Flow

#### Client-side Logout
```typescript
await supabase.auth.signOut();
// User automatically redirected to public routes
```

#### Session Cleanup
- **Local Storage**: Auth tokens cleared
- **State Reset**: App state reset to unauthenticated
- **Redirect**: User sent to landing page

### Token Management

#### Access Tokens
- **Format**: JWT
- **Expiration**: 1 hour (configurable)
- **Scope**: User identity and permissions

#### Refresh Tokens
- **Purpose**: Automatic token renewal
- **Storage**: Secure HttpOnly cookies (server-side)
- **Rotation**: New refresh token on each use

#### Token Refresh Process
- **Automatic**: Handled by Supabase client
- **Timing**: Before token expiration
- **Fallback**: Redirect to login on refresh failure

### Security Features

#### CSRF Protection
- **State Parameters**: OAuth flow protection
- **Origin Validation**: Request origin checking
- **SameSite Cookies**: CSRF attack prevention

#### Session Security
- **Secure Cookies**: HTTPS-only transmission
- **Domain Restriction**: Cookies scoped to domain
- **Expiration**: Automatic session timeout

#### Rate Limiting
- **Login Attempts**: Limited failed attempts
- **IP-based**: Suspicious IP blocking
- **Exponential Backoff**: Increasing delays

### Multi-tenant Architecture

#### Tenant Isolation
- **Database**: RLS policies by tenant_id
- **Routes**: Tenant-scoped navigation
- **Data**: Complete tenant separation

#### Tenant Switching
- **Profile Update**: User tenant_id change
- **Session Refresh**: New permissions loaded
- **Route Redirect**: Appropriate dashboard

### Error Handling

#### Authentication Errors
- **Invalid Credentials**: User-friendly messages
- **Network Issues**: Retry mechanisms
- **Session Expired**: Automatic redirect to login

#### Authorization Errors
- **Insufficient Permissions**: Access denied pages
- **Role Changes**: Dynamic permission updates
- **Audit Logging**: Security event tracking

### Development Tools

#### Auth Debugging
- **Dev Panel**: Authentication state display
- **Console Logs**: Auth event logging
- **Mock Users**: Development user accounts

#### Testing Support
- **Test Accounts**: Pre-configured test users
- **Role Simulation**: Different permission levels
- **Automated Tests**: Auth flow validation

## Integration Points

### Frontend Integration
- **React Hooks**: `useAuth()` for auth state
- **Route Guards**: Automatic protection
- **UI Updates**: Auth-dependent rendering

### Backend Integration
- **Supabase**: Database and auth provider
- **RLS Policies**: Database-level security
- **Edge Functions**: Server-side auth validation

### External Services
- **Email Provider**: Auth email delivery
- **Analytics**: User behavior tracking
- **Monitoring**: Auth failure alerts