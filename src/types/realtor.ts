// Realtor/Property Manager Types

export interface Listing {
  id: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  listPrice?: number;
  rentPrice?: number;
  hoaFees: number;
  propertyTaxes: number;
  images: string[];
  attachments: string[];
  status: 'new' | 'active' | 'offer' | 'under_contract' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  
  // Cap-rate calculations
  capRateInputs?: CapRateInputs;
  capRate?: number;
  cashOnCash?: number;
  
  // MLS data
  mlsNumber?: string;
  mlsStatus?: string;
  mlsSyncedAt?: Date;
}

export interface CapRateInputs {
  rentIncome: number;
  vacancy: number;
  operatingExpenses: number;
  insurance: number;
  taxes: number;
  hoa: number;
  capex: number;
  management: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'landlord' | 'investor' | 'buyer' | 'seller';
  pipeline: 'lead' | 'warm' | 'active' | 'repeat' | 'ambassador';
  preferredChannel: 'email' | 'sms' | 'phone' | 'portal';
  
  // Properties and interests
  propertiesOwned: string[]; // Property IDs
  propertiesInterested: string[]; // Property IDs
  
  // Entity links
  linkedEntities: string[]; // Entity IDs
  
  // Documents and reports
  documents: string[]; // Vault document IDs
  capRateHistory: CapRateScenario[];
  
  notes: string;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
}

export interface EntityLink {
  id: string;
  entityName: string;
  entityType: 'llc' | 'corporation' | 'partnership' | 'trust';
  state: string;
  taxId?: string;
  
  // Property mappings
  properties: string[]; // Property IDs
  owners: string[]; // Owner IDs
  
  // Compliance tracking
  renewalDate?: Date;
  insuranceExpiry?: Date;
  complianceReminders: ComplianceReminder[];
  
  documents: string[]; // Vault document IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceReminder {
  id: string;
  type: 'renewal' | 'insurance' | 'filing' | 'tax';
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface CapRateScenario {
  id: string;
  name: string;
  propertyAddress: string;
  propertyId?: string;
  ownerId?: string;
  
  // Scenario inputs
  purchasePrice: number;
  downPayment: number;
  loanRate: number;
  loanTerm: number;
  
  inputs: CapRateInputs;
  
  // Calculated results
  capRate: number;
  cashOnCash: number;
  monthlyNet: number;
  annualNet: number;
  
  // Alerts and watchlist
  isWatchlisted: boolean;
  alertThresholds?: {
    minCapRate?: number;
    maxCapRate?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketTrend {
  id: string;
  area: string; // ZIP code or neighborhood
  type: 'rental' | 'sales' | 'dom' | 'inventory';
  
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  
  period: 'monthly' | 'quarterly' | 'yearly';
  dataSource: string;
  
  createdAt: Date;
}

export interface CommunicationThread {
  id: string;
  participants: string[]; // Contact IDs
  channel: 'sms' | 'voice' | 'email' | 'portal';
  subject?: string;
  
  messages: CommunicationMessage[];
  attachments: string[]; // Vault document IDs
  
  // Contact/Owner linking
  contactId?: string;
  ownerId?: string;
  propertyId?: string;
  
  status: 'active' | 'closed';
  priority: 'low' | 'medium' | 'high';
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  content: string;
  timestamp: Date;
  
  // Voice call specific
  duration?: number; // seconds
  recordingUrl?: string;
  
  // Email specific
  subject?: string;
  
  // SMS specific
  deliveryStatus?: 'sent' | 'delivered' | 'failed';
  
  // Portal message specific
  readAt?: Date;
}

export interface MLSConfig {
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  officeId: string;
  brokerId: string;
  
  // Sync settings
  autoSync: boolean;
  syncInterval: number; // minutes
  lastSyncAt?: Date;
  
  // Field mappings
  fieldMappings: Record<string, string>;
}

export interface TwilioConfig {
  enabled: boolean;
  phoneNumber?: string;
  accountSid?: string;
  
  // Call recording settings
  recordCalls: boolean;
  consentRequired: boolean;
  consentStates: string[];
  
  // SMS settings
  smsEnabled: boolean;
  autoResponder: boolean;
}

export interface RealtorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  brokerage: string;
  role: 'realtor' | 'property_manager' | 'broker_owner' | 'team_lead';
  licenseNumber: string;
  states: string[];
  niche: 'residential' | 'investors' | 'property_management' | 'commercial' | 'luxury' | 'first_time';
  
  // System configurations
  mlsConfig: MLSConfig;
  twilioConfig: TwilioConfig;
  vaultEnabled: boolean;
  
  // Branding
  logoUrl?: string;
  brandColors?: {
    primary: string;
    secondary: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// MLS Integration Types
export interface MLSListing {
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  listPrice: number;
  status: string;
  daysOnMarket: number;
  photos: string[];
  description: string;
  listingAgent: {
    name: string;
    phone: string;
    email: string;
  };
  updatedAt: Date;
}

export interface RentalComp {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  rentPrice: number;
  distance: number; // miles
  leaseDate: Date;
}

// Retirement Roadmap Integration Types
export interface RetirementMapping {
  id: string;
  propertyId: string;
  ownerId: string;
  userId: string;
  
  // Income allocation
  monthlyNet: number;
  phase: 'income_now' | 'income_later' | 'growth' | 'legacy';
  
  // Scenario details
  startYear: number;
  endYear?: number;
  inflationAdjusted: boolean;
  
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Entity Management Integration Types
export interface EntityProperty {
  propertyId: string;
  entityId: string;
  ownershipPercent: number;
  acquisitionDate: Date;
  acquisitionPrice: number;
  currentValue: number;
}

// Event Tracking Types
export interface RealtorEvent {
  eventType: 'listing_created' | 'owner_portal_invited' | 'retirement_mapping_saved' | 
            'cap_rate_calculated' | 'mls_synced' | 'property_pack_shared' | 
            'call_recorded' | 'entity_linked';
  data: Record<string, any>;
  timestamp: Date;
}