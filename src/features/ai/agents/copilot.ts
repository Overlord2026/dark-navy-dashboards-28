import { safeCallTool, executeWorkflow, type AgentContext, type ToolResult } from './runtime';
import { recordReceipt } from '@/features/receipts/record';

export type CopilotPersona = 'Family' | 'Advisor' | 'CPA' | 'Attorney' | 'Insurance' | 'NIL' | 'K401' | 'Health';

export type CopilotMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  persona?: CopilotPersona;
  toolCalls?: Array<{
    tool: string;
    input: any;
    result?: ToolResult;
  }>;
};

export type CopilotSession = {
  id: string;
  persona: CopilotPersona;
  userId: string;
  messages: CopilotMessage[];
  context: AgentContext;
  createdAt: string;
  updatedAt: string;
};

// In-memory session store (replace with database in production)
const SESSIONS = new Map<string, CopilotSession>();

export class PersonaCopilot {
  constructor(
    private persona: CopilotPersona,
    private sessionId: string,
    private userId: string
  ) {}

  async createSession(): Promise<CopilotSession> {
    const session: CopilotSession = {
      id: this.sessionId,
      persona: this.persona,
      userId: this.userId,
      messages: [],
      context: {
        userId: this.userId,
        persona: this.persona,
        sessionId: this.sessionId,
        capabilities: this.getPersonaCapabilities()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    SESSIONS.set(this.sessionId, session);
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.copilot.session.start',
      reasons: [this.persona, this.userId],
      created_at: new Date().toISOString()
    } as any);

    return session;
  }

  async addMessage(content: string, role: 'user' | 'assistant' = 'user'): Promise<void> {
    const session = SESSIONS.get(this.sessionId);
    if (!session) throw new Error('Session not found');

    const message: CopilotMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
      persona: this.persona
    };

    session.messages.push(message);
    session.updatedAt = new Date().toISOString();

    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.copilot.message',
      reasons: [this.persona, role],
      created_at: new Date().toISOString()
    } as any);
  }

  async useTool(toolKey: string, input: any): Promise<ToolResult> {
    const session = SESSIONS.get(this.sessionId);
    if (!session) throw new Error('Session not found');

    const result = await safeCallTool(toolKey, input, session.context);
    
    // Log the tool usage in the session
    const lastMessage = session.messages[session.messages.length - 1];
    if (lastMessage) {
      lastMessage.toolCalls = lastMessage.toolCalls || [];
      lastMessage.toolCalls.push({
        tool: toolKey,
        input,
        result
      });
    }

    return result;
  }

  async executeWorkflow(steps: Array<{ tool: string; input: any }>): Promise<ToolResult[]> {
    const session = SESSIONS.get(this.sessionId);
    if (!session) throw new Error('Session not found');

    return executeWorkflow(steps, session.context);
  }

  private getPersonaCapabilities(): string[] {
    const baseCapabilities = ['rag.search', 'policy.check', 'receipt.log'];
    
    switch (this.persona) {
      case 'Family':
        return [...baseCapabilities, 'k401.rules', 'roadmap.view', 'vault.read'];
      
      case 'Advisor':
        return [...baseCapabilities, 'k401.rules', 'k401.trade', 'roadmap.mc', 'rollover.generate', 'book.manage'];
      
      case 'CPA':
        return [...baseCapabilities, 'tax.analyze', 'reports.generate'];
      
      case 'Attorney':
        return [...baseCapabilities, 'estate.rules', 'documents.generate', 'notary.schedule'];
      
      case 'Insurance':
        return [...baseCapabilities, 'suitability.check', 'rollover.income'];
      
      case 'K401':
        return [...baseCapabilities, 'k401.rules', 'k401.trade', 'provider.rules'];
      
      default:
        return baseCapabilities;
    }
  }

  getSession(): CopilotSession | undefined {
    return SESSIONS.get(this.sessionId);
  }
}

// Factory function for creating persona-specific copilots
export function createCopilot(
  persona: CopilotPersona,
  userId: string,
  sessionId?: string
): PersonaCopilot {
  const id = sessionId || crypto.randomUUID();
  return new PersonaCopilot(persona, id, userId);
}

// Get all active sessions for monitoring
export function getActiveSessions(): CopilotSession[] {
  return Array.from(SESSIONS.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Clean up old sessions
export function cleanupOldSessions(olderThanHours: number = 24): number {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - olderThanHours);
  
  let cleaned = 0;
  for (const [sessionId, session] of SESSIONS.entries()) {
    if (new Date(session.updatedAt) < cutoff) {
      SESSIONS.delete(sessionId);
      cleaned++;
    }
  }
  
  console.log(`[AI Copilot] Cleaned up ${cleaned} old sessions`);
  return cleaned;
}