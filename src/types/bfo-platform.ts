// BFO Platform Types
export interface PersonaConfig {
  id: string;
  name: string;
  route: string;
  subPersonas?: SubPersona[];
  tools: Tool[];
  features: Feature[];
}

export interface SubPersona {
  id: string;
  name: string;
  route: string;
  description: string;
  tools: Tool[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  route: string;
  category: 'financial' | 'legal' | 'healthcare' | 'insurance' | 'education' | 'automation';
  enabled: boolean;
  premium?: boolean;
}

export interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  premium?: boolean;
}

export interface Receipt {
  id: string;
  action: string;
  result: 'approved' | 'denied' | 'reviewed';
  timestamp: string;
  persona: string;
  tool?: string;
  compliance: boolean;
}

export interface IPFiling {
  id: string;
  title: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade_secret';
  status: 'draft' | 'filed' | 'pending' | 'approved' | 'rejected';
  filingDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  cost: number;
  timeline: IPTimeline[];
  documents: Document[];
}

export interface IPTimeline {
  id: string;
  date: string;
  action: string;
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
}

export interface SecurityAlert {
  id: string;
  type: 'access' | 'data' | 'compliance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface VoiceSession {
  id: string;
  userId: string;
  persona: string;
  startTime: string;
  endTime?: string;
  transcript: string[];
  actions: VoiceAction[];
}

export interface VoiceAction {
  id: string;
  type: 'tool_execution' | 'data_query' | 'file_access' | 'navigation';
  target: string;
  result: 'success' | 'error' | 'pending';
  timestamp: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  enabled: boolean;
  persona: string;
  schedule?: string;
}

export interface AutomationTrigger {
  type: 'time' | 'event' | 'data_change' | 'user_action';
  condition: string;
  parameters: Record<string, any>;
}

export interface AutomationAction {
  type: 'email' | 'task_creation' | 'data_update' | 'notification' | 'api_call';
  target: string;
  parameters: Record<string, any>;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  recurring: boolean;
  personas: string[];
  features: string[];
  enabled: boolean;
}

export interface AdminMigration {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
  duration?: number;
  logs: string[];
}