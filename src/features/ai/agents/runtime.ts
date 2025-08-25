import { searchVector } from '@/features/ai/fabric/vector';
import { runRules } from '@/features/ai/decisions/dsl';
import { recordReceipt } from '@/features/receipts/record';

export type Tool = {
  key: string;
  run: (input: any) => Promise<any>;
  guard?: (input: any) => { ok: boolean; reason?: string };
  description?: string;
  inputSchema?: any;
};

export type AgentContext = {
  userId?: string;
  persona?: string;
  sessionId?: string;
  capabilities?: string[];
};

export type ToolResult = {
  success: boolean;
  data?: any;
  error?: string;
  receipts?: string[];
};

const TOOLS: Record<string, Tool> = {
  'rag.search': {
    key: 'rag.search',
    description: 'Search vector database for relevant documents and context',
    run: async (q) => searchVector(q.q || '', q.k || 5),
    guard: (input) => {
      if (!input.q || typeof input.q !== 'string') {
        return { ok: false, reason: 'Missing or invalid query string' };
      }
      if (input.k && (typeof input.k !== 'number' || input.k > 20)) {
        return { ok: false, reason: 'Invalid k parameter (max 20)' };
      }
      return { ok: true };
    }
  },
  'k401.rules': {
    key: 'k401.rules',
    description: 'Evaluate 401k decision rules against provided context',
    run: async (ctx) => {
      const { K401_RULES } = await import('@/features/ai/decisions/rules.k401');
      return runRules(K401_RULES, ctx);
    },
    guard: (input) => {
      if (!input || typeof input !== 'object') {
        return { ok: false, reason: 'Context must be an object' };
      }
      return { ok: true };
    }
  },
  'policy.check': {
    key: 'policy.check',
    description: 'Check policy constraints for given action',
    run: async ({ action, context }) => {
      // Placeholder for policy checking logic
      return { allowed: true, constraints: [] };
    },
    guard: (input) => {
      if (!input.action) {
        return { ok: false, reason: 'Action required for policy check' };
      }
      return { ok: true };
    }
  },
  'receipt.log': {
    key: 'receipt.log',
    description: 'Log content-free receipt for audit trail',
    run: async ({ type, action, reasons }) => {
      await recordReceipt({
        type: type || 'Decision-RDS',
        action,
        reasons: reasons || [],
        created_at: new Date().toISOString()
      } as any);
      return { logged: true };
    },
    guard: (input) => {
      if (!input.action) {
        return { ok: false, reason: 'Action required for receipt logging' };
      }
      return { ok: true };
    }
  }
};

export async function callTool(
  toolKey: string, 
  input: any, 
  context?: AgentContext
): Promise<ToolResult> {
  const tool = TOOLS[toolKey];
  
  if (!tool) {
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.tool.call',
      reasons: [toolKey, 'unknown_tool'],
      created_at: new Date().toISOString()
    } as any);
    
    return {
      success: false,
      error: `Unknown tool: ${toolKey}`
    };
  }

  // Apply guardrails
  const guardResult = tool.guard ? tool.guard(input) : { ok: true };
  
  // Log the tool call attempt
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'ai.tool.call',
    reasons: [toolKey, guardResult.ok ? 'ok' : 'blocked'],
    created_at: new Date().toISOString()
  } as any);

  if (!guardResult.ok) {
    return {
      success: false,
      error: guardResult.reason || 'Tool guard blocked execution'
    };
  }

  try {
    const result = await tool.run(input);
    
    // Log successful execution
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.tool.success',
      reasons: [toolKey],
      created_at: new Date().toISOString()
    } as any);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    // Log execution error
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.tool.error',
      reasons: [toolKey, 'execution_failed'],
      created_at: new Date().toISOString()
    } as any);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Tool execution failed'
    };
  }
}

export function registerTool(tool: Tool): void {
  if (TOOLS[tool.key]) {
    console.warn(`Tool ${tool.key} already exists, overwriting`);
  }
  
  TOOLS[tool.key] = tool;
  console.log(`[AI Runtime] Registered tool: ${tool.key}`);
}

export function getAvailableTools(): Tool[] {
  return Object.values(TOOLS);
}

export function getToolByKey(key: string): Tool | undefined {
  return TOOLS[key];
}

export async function executeWorkflow(
  steps: Array<{ tool: string; input: any }>,
  context?: AgentContext
): Promise<ToolResult[]> {
  const results: ToolResult[] = [];
  
  for (const step of steps) {
    const result = await callTool(step.tool, step.input, context);
    results.push(result);
    
    // Stop workflow if any step fails (unless configured otherwise)
    if (!result.success) {
      console.warn(`Workflow stopped at step ${step.tool}: ${result.error}`);
      break;
    }
  }
  
  return results;
}

// Capability checking for different personas
export function checkCapability(
  toolKey: string, 
  context?: AgentContext
): { allowed: boolean; reason?: string } {
  const tool = TOOLS[toolKey];
  if (!tool) {
    return { allowed: false, reason: 'Tool not found' };
  }
  
  // Basic capability checks based on persona
  if (context?.persona === 'CPA' && toolKey.startsWith('k401.trade')) {
    return { allowed: false, reason: 'CPAs cannot execute trades' };
  }
  
  if (context?.persona === 'Family' && toolKey.includes('admin')) {
    return { allowed: false, reason: 'Admin tools not available to family users' };
  }
  
  return { allowed: true };
}

// Safe execution wrapper with capability checks
export async function safeCallTool(
  toolKey: string,
  input: any,
  context?: AgentContext
): Promise<ToolResult> {
  const capabilityCheck = checkCapability(toolKey, context);
  
  if (!capabilityCheck.allowed) {
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.tool.blocked',
      reasons: [toolKey, 'capability_denied'],
      created_at: new Date().toISOString()
    } as any);
    
    return {
      success: false,
      error: capabilityCheck.reason
    };
  }
  
  return callTool(toolKey, input, context);
}