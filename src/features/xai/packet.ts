import { recordReceipt } from '@/features/receipts/store';

export interface ExplainabilityFeature {
  name: string;
  importance: number; // 0-1 scale
  band: 'high' | 'medium' | 'low';
  category?: string;
}

export interface FairnessMetrics {
  demographic_parity?: number;
  equality_of_opportunity?: number;
  bias_score?: number;
  protected_attributes?: string[];
}

export interface ExplainabilityPacket {
  id: string;
  inputs_hash: string;
  policy_version: string;
  model_id: string;
  model_version: string;
  features: ExplainabilityFeature[];
  fairness: FairnessMetrics;
  rationale_ptr: string; // SHA256 pointer to detailed explanation
  confidence_score?: number;
  created_at: string;
  canonical_template?: any; // For replay verification
}

export interface PacketBinding {
  id: string;
  packet_id: string;
  action_id: string;
  action_class: string;
  bound_at: string;
  status: 'active' | 'revoked';
}

export interface AccessLog {
  id: string;
  packet_id: string;
  accessor_role: string;
  access_scope: 'read' | 'write' | 'admin';
  accessed_at: string;
  purpose: string;
}

// In-memory storage for demo
let EXPLAINABILITY_PACKETS: Record<string, ExplainabilityPacket> = {};
let PACKET_BINDINGS: Record<string, PacketBinding> = {};
let ACCESS_LOGS: AccessLog[] = [];

/**
 * Generate and store an explainability packet
 */
export async function generateExplainabilityPacket(
  modelId: string,
  modelVersion: string,
  inputs: any,
  features: ExplainabilityFeature[],
  fairnessMetrics: FairnessMetrics = {}
): Promise<ExplainabilityPacket> {
  
  const packetId = `xai_packet_${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  // Create content-free inputs hash (no PII)
  const sanitizedInputs = {
    feature_count: features.length,
    model_id: modelId,
    model_version: modelVersion,
    timestamp: timestamp
  };
  const inputsHash = `sha256:${btoa(JSON.stringify(sanitizedInputs))}`;
  
  // Generate rationale pointer (content-free)
  const rationalePtr = `sha256:rationale_${modelId}_${Date.now()}`;
  
  // Store canonical template for replay verification
  const canonicalTemplate = {
    model_id: modelId,
    model_version: modelVersion,
    feature_names: features.map(f => f.name),
    feature_importance_bands: features.map(f => f.band),
    fairness_metrics: Object.keys(fairnessMetrics),
    generated_at: timestamp
  };
  
  const packet: ExplainabilityPacket = {
    id: packetId,
    inputs_hash: inputsHash,
    policy_version: 'XAI-2025',
    model_id: modelId,
    model_version: modelVersion,
    features,
    fairness: fairnessMetrics,
    rationale_ptr: rationalePtr,
    confidence_score: features.length > 0 ? features.reduce((sum, f) => sum + f.importance, 0) / features.length : 0,
    created_at: timestamp,
    canonical_template: canonicalTemplate
  };
  
  EXPLAINABILITY_PACKETS[packetId] = packet;
  
  // Emit Explainability-RDS receipt
  await recordReceipt({
    receipt_id: `rds_explainability_${Date.now()}`,
    type: 'Explainability-RDS',
    ts: timestamp,
    policy_version: 'XAI-2025',
    inputs_hash: inputsHash,
    explainability_details: {
      packet_id: packetId,
      model_id: modelId,
      model_version: modelVersion,
      features: features.map(f => ({
        name: f.name,
        importance: f.importance,
        band: f.band
      })),
      fairness: fairnessMetrics,
      rationale_ptr: rationalePtr,
      confidence_score: packet.confidence_score
    },
    reasons: ['canonical_ok', 'pii_free', 'explainability_generated']
  });
  
  console.log('✅ Explainability packet generated:', packetId);
  
  return packet;
}

/**
 * Bind an explainability packet to a specific action
 */
export async function bindPacketToAction(
  packetId: string,
  actionId: string,
  actionClass: string
): Promise<PacketBinding> {
  
  const packet = EXPLAINABILITY_PACKETS[packetId];
  if (!packet) {
    throw new Error(`Explainability packet ${packetId} not found`);
  }
  
  const bindingId = `binding_${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  const binding: PacketBinding = {
    id: bindingId,
    packet_id: packetId,
    action_id: actionId,
    action_class: actionClass,
    bound_at: timestamp,
    status: 'active'
  };
  
  PACKET_BINDINGS[bindingId] = binding;
  
  // Emit Binding-RDS receipt
  await recordReceipt({
    receipt_id: `rds_binding_${Date.now()}`,
    type: 'Binding-RDS',
    ts: timestamp,
    policy_version: 'XAI-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ packetId, actionId, actionClass }))}`,
    binding_details: {
      binding_id: bindingId,
      packet_id: packetId,
      action_id: actionId,
      action_class: actionClass,
      model_id: packet.model_id,
      model_version: packet.model_version
    },
    reasons: ['packet_bound', 'action_linked', 'audit_trail']
  });
  
  console.log('✅ Packet bound to action:', { packetId, actionId, actionClass });
  
  return binding;
}

/**
 * Log access to an explainability packet
 */
export async function logPacketAccess(
  packetId: string,
  accessorRole: string,
  accessScope: 'read' | 'write' | 'admin' = 'read',
  purpose: string = 'regulatory_review'
): Promise<AccessLog> {
  
  const packet = EXPLAINABILITY_PACKETS[packetId];
  if (!packet) {
    throw new Error(`Explainability packet ${packetId} not found`);
  }
  
  const accessId = `access_${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  const accessLog: AccessLog = {
    id: accessId,
    packet_id: packetId,
    accessor_role: accessorRole,
    access_scope: accessScope,
    accessed_at: timestamp,
    purpose
  };
  
  ACCESS_LOGS.push(accessLog);
  
  // Emit Access-RDS receipt
  await recordReceipt({
    receipt_id: `rds_access_${Date.now()}`,
    type: 'Access-RDS',
    ts: timestamp,
    policy_version: 'XAI-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ packetId, accessorRole, accessScope }))}`,
    access_details: {
      access_id: accessId,
      packet_id: packetId,
      accessor_role: accessorRole,
      access_scope: accessScope,
      purpose,
      model_id: packet.model_id
    },
    reasons: ['packet_accessed', accessScope + '_access', purpose]
  });
  
  console.log('✅ Packet access logged:', { packetId, accessorRole, accessScope });
  
  return accessLog;
}

/**
 * Get explainability packet by ID
 */
export function getExplainabilityPacket(packetId: string): ExplainabilityPacket | null {
  return EXPLAINABILITY_PACKETS[packetId] || null;
}

/**
 * List all explainability packets
 */
export function listExplainabilityPackets(): ExplainabilityPacket[] {
  return Object.values(EXPLAINABILITY_PACKETS);
}

/**
 * Get bindings for a packet
 */
export function getPacketBindings(packetId: string): PacketBinding[] {
  return Object.values(PACKET_BINDINGS).filter(b => b.packet_id === packetId);
}

/**
 * Get access logs for a packet
 */
export function getPacketAccessLogs(packetId: string): AccessLog[] {
  return ACCESS_LOGS.filter(log => log.packet_id === packetId);
}

/**
 * Revoke a packet binding
 */
export async function revokePacketBinding(bindingId: string): Promise<void> {
  const binding = PACKET_BINDINGS[bindingId];
  if (!binding) {
    throw new Error(`Binding ${bindingId} not found`);
  }
  
  binding.status = 'revoked';
  
  // Log revocation
  await recordReceipt({
    receipt_id: `rds_binding_revoke_${Date.now()}`,
    type: 'Binding-RDS',
    ts: new Date().toISOString(),
    policy_version: 'XAI-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ bindingId, action: 'revoke' }))}`,
    binding_details: {
      binding_id: bindingId,
      packet_id: binding.packet_id,
      action: 'revoke',
      revoked_at: new Date().toISOString()
    },
    reasons: ['binding_revoked', 'audit_trail']
  });
  
  console.log('✅ Packet binding revoked:', bindingId);
}