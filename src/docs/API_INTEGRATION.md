# API Integration Guide

This document outlines how our frontend hooks integrate with API services and the planned progression from mock data to full API integration.

## Integration Approach

Our application uses a three-layer approach to data management:

1. **UI Components**: Consume data via hooks, unaware of the data source
2. **Data Hooks**: Manage state, loading, and errors while abstracting data sources
3. **API Services**: Handle actual data fetching (mock now, real later)

This separation allows us to develop the UI independently from the backend while maintaining clear integration points for future development.

## Current Status: Phase 1 (Mock Data)

All data hooks currently use local mock data while logging API integration points. This allows for:

- Complete frontend development without backend dependencies
- Clear documentation of required API endpoints
- Easy transition to real APIs in the future

## Marketplace Module Integration

### Current Implementation

```typescript
// In useMarketplaceData.tsx
useEffect(() => {
  const loadData = async () => {
    try {
      // Call API service placeholder
      const apiListings = await fetchMarketplaceListings();
      
      // If API returns data, use it; otherwise, use mock data
      if (apiListings.length > 0) {
        setListings(apiListings);
      } else {
        // Use mock data for now
        setListings(sampleListings);
      }
      
      // Similar approach for categories
      // ...
    } catch (err) {
      // Error handling
    }
  };

  loadData();
}, []);
```

### Phase 2 Integration

When backend APIs are available, we'll update the API service implementations while keeping hook signatures the same:

```typescript
// Updated marketplaceApiService.ts in Phase 2
export async function fetchMarketplaceListings(): Promise<MarketplaceListing[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/marketplace/listings`);
    if (!response.ok) throw new Error('Failed to fetch listings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching marketplace listings:', error);
    throw error;
  }
}
```

The UI components will continue to work without changes because the hook signatures remain consistent.

## Family Office Directory Integration

### Current Implementation

The `useFamilyOfficeData` hook follows the same pattern as marketplace data:

```typescript
// In useFamilyOfficeData.tsx
useEffect(() => {
  const loadData = async () => {
    try {
      // Call API service placeholder
      const apiFamilyOffices = await fetchFamilyOffices();
      
      // Use API data if available, otherwise use mock data
      if (apiFamilyOffices.length > 0) {
        setFamilyOffices(apiFamilyOffices);
      } else {
        // Use mock data for now
        // ...
      }
    } catch (err) {
      // Error handling
    }
  };

  loadData();
}, []);
```

### Phase 2 Integration

In Phase 2, the `fetchFamilyOffices` implementation will change while the hook remains the same:

```typescript
export async function fetchFamilyOffices(): Promise<FamilyOffice[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/family-offices`);
    if (!response.ok) throw new Error('Failed to fetch family offices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching family offices:', error);
    throw error;
  }
}
```

## Bills Management Integration

### Current Implementation

The Bills Management module uses the `useBills` provider which combines:
- `useBillsManagement` for bill CRUD operations
- `useInsightsManagement` for optimization insights

Currently, both use mock data:

```typescript
// In useBillsManagement.tsx
const [bills, setBills] = useState<Bill[]>(initialBills);

// CRUD operations that work with local state
const addBill = (bill: Bill) => {
  setBills((prevBills) => [...prevBills, bill]);
};

// ... other methods
```

### Phase 2 Integration

In Phase 2, we'll implement an API service for bills management:

```typescript
// Future billsApiService.ts
export async function fetchBills(): Promise<Bill[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/bills`);
    if (!response.ok) throw new Error('Failed to fetch bills');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
}

export async function addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  try {
    const response = await fetch(`${apiBaseUrl}/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill)
    });
    if (!response.ok) throw new Error('Failed to add bill');
    return await response.json();
  } catch (error) {
    console.error('Error adding bill:', error);
    throw error;
  }
}

// ... other methods
```

Then update the hook to use the API service:

```typescript
// Updated useBillsManagement.tsx in Phase 2
export function useBillsManagement(): BillsManagementHook {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBills = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBills();
        setBills(data);
      } catch (err) {
        setError('Failed to load bills');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBills();
  }, []);

  const addBill = async (bill: Omit<Bill, 'id'>) => {
    try {
      const newBill = await addBillApi(bill);
      setBills(prev => [...prev, newBill]);
      return newBill;
    } catch (err) {
      console.error('Error adding bill:', err);
      throw err;
    }
  };

  // ... other methods
  
  return {
    bills,
    addBill,
    // ... other methods
    isLoading,
    error
  };
}
```

The UI components will need minimal changes to handle loading and error states that are already prepared in the hook interface.

## Document Management Integration

### Current Implementation

The Document Management module currently uses local storage:

```typescript
// In useDocumentManagement.tsx
const [documents, setDocuments] = useState<DocumentItem[]>([]);

const handleFileUpload = useCallback((file: File, customName: string) => {
  // Create new document in local state
  const newDocument = { /* ... */ };
  setDocuments(prev => [...prev, newDocument]);
}, []);
```

### Phase 2 Integration

In Phase 2, we'll implement a document API service:

```typescript
// Future documentApiService.ts
export async function uploadDocument(
  file: File, 
  metadata: { name: string; category: string }
): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));

  try {
    const response = await fetch(`${apiBaseUrl}/documents`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return await response.json();
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

// ... other methods
```

Then update the hook to use the API service:

```typescript
// Updated useDocumentManagement.tsx in Phase 2
const handleFileUpload = useCallback(async (file: File, customName: string) => {
  try {
    setIsLoading(true);
    const newDocument = await uploadDocument(file, {
      name: customName || file.name,
      category: activeCategory || 'uncategorized'
    });
    
    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  } catch (err) {
    console.error('Error uploading document:', err);
    throw err;
  } finally {
    setIsLoading(false);
  }
}, [activeCategory]);
```

## Authentication Integration

### Current Implementation

The application currently uses the `UserContext` with mock user data:

```typescript
// In UserContext.tsx
const [userProfile, setUserProfile] = useState<UserProfile | null>(mockUserProfile);
const [isAuthenticated, setIsAuthenticated] = useState(true); // Always true in mock mode
```

### Phase 2 Integration

In Phase 2, we'll implement authentication APIs:

```typescript
// Future authApiService.ts
export async function login(email: string, password: string): Promise<UserProfile> {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

// ... other methods
```

Then update the context to use the API service:

```typescript
// Updated UserContext.tsx in Phase 2
const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    const user = await loginApi(email, password);
    setUserProfile(user);
    setIsAuthenticated(true);
    return user;
  } catch (err) {
    setIsAuthenticated(false);
    setUserProfile(null);
    throw err;
  } finally {
    setIsLoading(false);
  }
};
```

## API Error Handling Strategy

### Phase 1 (Current)

In the current phase, error handling is minimal since we're using mock data:

```typescript
try {
  // Mock data operations
} catch (err) {
  console.error("Error:", err);
  setError("An error occurred");
}
```

### Phase 2

In Phase 2, we'll implement comprehensive error handling:

```typescript
try {
  // API operations
} catch (err) {
  // Determine error type and provide specific messages
  if (err.response?.status === 401) {
    setError("Authentication required");
    // Trigger auth flow
  } else if (err.response?.status === 403) {
    setError("You don't have permission to perform this action");
  } else if (err.response?.status === 404) {
    setError("The requested resource was not found");
  } else {
    setError("An unexpected error occurred");
    // Log to monitoring service
  }
}
```

## Caching Strategy

### Phase 1 (Current)

In the current phase, we don't implement caching since we're using mock data.

### Phase 2

In Phase 2, we'll implement basic caching:

```typescript
// Simple cache implementation
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  const cacheKey = url;
  const now = Date.now();
  
  // Check cache
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data as T;
  }
  
  // Fetch fresh data
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  
  const data = await response.json();
  
  // Update cache
  cache[cacheKey] = { data, timestamp: now };
  
  return data;
}
```

### Phase 3

In Phase 3, we'll implement advanced caching with React Query:

```typescript
// Using React Query for advanced caching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// In a hook
export function useMarketplaceData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketplace', 'listings'],
    queryFn: fetchMarketplaceListings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true
  });
  
  // ... rest of hook
}
```

## Conclusion

This integration approach allows for:

1. **Independent Development**: Frontend and backend teams can work in parallel
2. **Smooth Transition**: Gradual replacement of mock data with real APIs
3. **Minimal Refactoring**: UI components remain unchanged across phases
4. **Progressive Enhancement**: Features can be added as backend capabilities expand

By following this approach, we can deliver a functional frontend application in Phase 1 while laying the groundwork for a full-featured product in later phases.
