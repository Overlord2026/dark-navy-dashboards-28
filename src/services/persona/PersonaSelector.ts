// Persona Selector with Hysteresis Guard
// Prevents rapid persona switching with confidence thresholds and time delays

import { supabase } from '@/integrations/supabase/client';
import { ClassificationResult } from './HybridClassifier';

export interface PersonaState {
  current_persona: string;
  confidence: number;
  last_switch: number;
  switch_count: number;
  stable_since: number;
}

export interface HysteresisConfig {
  confidence_delta_threshold: number; // Minimum confidence difference required
  min_elapsed_time_ms: number; // Minimum time between switches
  stability_period_ms: number; // Time to consider persona "stable"
  max_switches_per_hour: number; // Rate limiting
}

export interface PersonaSwitchResult {
  switched: boolean;
  new_persona?: string;
  previous_persona: string;
  confidence: number;
  reason: string;
  blocked_reason?: string;
}

export class PersonaSelector {
  private config: HysteresisConfig;
  private personaStates: Map<string, PersonaState> = new Map();

  constructor(config?: Partial<HysteresisConfig>) {
    this.config = {
      confidence_delta_threshold: 0.15, // 15% confidence difference required
      min_elapsed_time_ms: 30000, // 30 seconds minimum between switches
      stability_period_ms: 300000, // 5 minutes to be considered stable
      max_switches_per_hour: 6, // Max 6 switches per hour
      ...config
    };
  }

  async selectPersona(
    userId: string,
    classification: ClassificationResult,
    sessionId: string
  ): Promise<PersonaSwitchResult> {
    // Get current persona state
    const currentState = await this.getPersonaState(userId);
    const newPersona = classification.topPersona;
    const newConfidence = classification.confidence;
    
    // If no current persona, accept the new one
    if (!currentState) {
      await this.setPersonaState(userId, newPersona, newConfidence, sessionId);
      return {
        switched: true,
        new_persona: newPersona,
        previous_persona: 'none',
        confidence: newConfidence,
        reason: 'Initial persona assignment'
      };
    }
    
    // Check if persona would change
    if (currentState.current_persona === newPersona) {
      // Same persona, just update confidence
      await this.updatePersonaConfidence(userId, newConfidence);
      return {
        switched: false,
        previous_persona: currentState.current_persona,
        confidence: newConfidence,
        reason: 'Persona confirmed, no change needed'
      };
    }
    
    // Apply hysteresis guard
    const hysteresisResult = this.applyHysteresisGuard(
      currentState,
      newPersona,
      newConfidence
    );
    
    if (!hysteresisResult.allowed) {
      return {
        switched: false,
        previous_persona: currentState.current_persona,
        confidence: currentState.confidence,
        reason: 'Change detected but not applied',
        blocked_reason: hysteresisResult.reason
      };
    }
    
    // Switch allowed, perform the change
    await this.setPersonaState(userId, newPersona, newConfidence, sessionId);
    
    // Log the switch for audit
    await this.logPersonaSwitch(
      userId,
      currentState.current_persona,
      newPersona,
      newConfidence,
      classification.reasoning.join('; ')
    );
    
    return {
      switched: true,
      new_persona: newPersona,
      previous_persona: currentState.current_persona,
      confidence: newConfidence,
      reason: hysteresisResult.reason
    };
  }

  private applyHysteresisGuard(
    currentState: PersonaState,
    newPersona: string,
    newConfidence: number
  ): { allowed: boolean; reason: string } {
    const now = Date.now();
    const timeSinceLastSwitch = now - currentState.last_switch;
    const confidenceDelta = newConfidence - currentState.confidence;
    
    // Check minimum elapsed time
    if (timeSinceLastSwitch < this.config.min_elapsed_time_ms) {
      return {
        allowed: false,
        reason: `Minimum time not elapsed (${timeSinceLastSwitch}ms < ${this.config.min_elapsed_time_ms}ms)`
      };
    }
    
    // Check confidence delta threshold
    if (confidenceDelta < this.config.confidence_delta_threshold) {
      return {
        allowed: false,
        reason: `Confidence delta insufficient (${confidenceDelta.toFixed(3)} < ${this.config.confidence_delta_threshold})`
      };
    }
    
    // Check rate limiting
    const oneHourAgo = now - 3600000;
    if (currentState.last_switch > oneHourAgo && 
        currentState.switch_count >= this.config.max_switches_per_hour) {
      return {
        allowed: false,
        reason: `Rate limit exceeded (${currentState.switch_count} switches in last hour)`
      };
    }
    
    // Additional stability check: if persona has been stable for a while,
    // require higher confidence delta
    const timeSinceStable = now - currentState.stable_since;
    if (timeSinceStable > this.config.stability_period_ms) {
      const stabilityThreshold = this.config.confidence_delta_threshold * 1.5;
      if (confidenceDelta < stabilityThreshold) {
        return {
          allowed: false,
          reason: `Stability threshold not met (${confidenceDelta.toFixed(3)} < ${stabilityThreshold.toFixed(3)})`
        };
      }
    }
    
    return {
      allowed: true,
      reason: `Switch approved: confidence delta ${confidenceDelta.toFixed(3)}, time elapsed ${timeSinceLastSwitch}ms`
    };
  }

  private async getPersonaState(userId: string): Promise<PersonaState | null> {
    try {
      // Check memory cache first
      if (this.personaStates.has(userId)) {
        return this.personaStates.get(userId)!;
      }
      
      // Get from database
      const { data: persona } = await supabase
        .from('personas')
        .select('*')
        .eq('user_id', userId)
        .order('detected_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!persona) return null;
      
      // Get switch history for rate limiting
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      const { data: recentSwitches } = await supabase
        .from('personas')
        .select('id')
        .eq('user_id', userId)
        .gte('detected_at', oneHourAgo);
      
      const state: PersonaState = {
        current_persona: persona.persona_type,
        confidence: persona.confidence_score,
        last_switch: new Date(persona.detected_at).getTime(),
        switch_count: recentSwitches?.length || 0,
        stable_since: new Date(persona.detected_at).getTime()
      };
      
      // Cache in memory
      this.personaStates.set(userId, state);
      
      return state;
    } catch (error) {
      console.error('Error getting persona state:', error);
      return null;
    }
  }

  private async setPersonaState(
    userId: string,
    persona: string,
    confidence: number,
    sessionId: string
  ): Promise<void> {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userId)
        .single();
      
      if (!userProfile) return;
      
      const now = new Date();
      
      // Insert new persona record
      await supabase.from('personas').insert({
        user_id: userId,
        tenant_id: userProfile.tenant_id,
        persona_type: persona,
        confidence_score: confidence,
        detected_at: now.toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours
        metadata: { session_id: sessionId }
      });
      
      // Update memory cache
      const currentState = this.personaStates.get(userId);
      const switchCount = currentState ? currentState.switch_count + 1 : 1;
      
      this.personaStates.set(userId, {
        current_persona: persona,
        confidence,
        last_switch: now.getTime(),
        switch_count: switchCount,
        stable_since: now.getTime()
      });
      
    } catch (error) {
      console.error('Error setting persona state:', error);
    }
  }

  private async updatePersonaConfidence(
    userId: string,
    confidence: number
  ): Promise<void> {
    try {
      // Update confidence in most recent persona record
      const { data: latestPersona } = await supabase
        .from('personas')
        .select('id')
        .eq('user_id', userId)
        .order('detected_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latestPersona) {
        await supabase
          .from('personas')
          .update({ confidence_score: confidence })
          .eq('id', latestPersona.id);
      }
      
      // Update memory cache
      const state = this.personaStates.get(userId);
      if (state) {
        state.confidence = confidence;
        this.personaStates.set(userId, state);
      }
      
    } catch (error) {
      console.error('Error updating persona confidence:', error);
    }
  }

  private async logPersonaSwitch(
    userId: string,
    fromPersona: string,
    toPersona: string,
    confidence: number,
    reasoning: string
  ): Promise<void> {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userId)
        .single();
      
      if (!userProfile) return;
      
      // Create audit entry for persona switch
      const inputs = { fromPersona, toPersona, confidence };
      const outputs = { result: 'switched', reasoning };
      
      const inputsHash = this.hashObject(inputs);
      const outputsHash = this.hashObject(outputs);
      
      // Get parent hash for chain
      const { data: lastAudit } = await supabase
        .from('persona_audit')
        .select('current_hash')
        .eq('tenant_id', userProfile.tenant_id)
        .order('block_number', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      const parentHash = lastAudit?.current_hash || null;
      const blockNumber = await this.getNextBlockNumber(userProfile.tenant_id);
      const timestamp = new Date();
      
      // Calculate current hash
      const { data: hashResult } = await supabase.rpc('calculate_audit_hash', {
        p_inputs_hash: inputsHash,
        p_outputs_hash: outputsHash,
        p_parent_hash: parentHash,
        p_block_number: blockNumber,
        p_timestamp: timestamp.toISOString()
      });
      
      // Insert audit record
      await supabase.from('persona_audit').insert({
        tenant_id: userProfile.tenant_id,
        user_id: userId,
        operation_type: 'persona_switch',
        inputs_hash: inputsHash,
        outputs_hash: outputsHash,
        parent_hash: parentHash,
        current_hash: hashResult,
        narrative: `Persona switched from ${fromPersona} to ${toPersona} (confidence: ${confidence.toFixed(3)})`,
        metadata: { reasoning, confidence },
        block_number: blockNumber,
        timestamp: timestamp.toISOString()
      });
      
    } catch (error) {
      console.error('Error logging persona switch:', error);
    }
  }

  private async getNextBlockNumber(tenantId: string): Promise<number> {
    try {
      const { data: result } = await supabase.rpc('get_next_audit_block_number', {
        p_tenant_id: tenantId
      });
      return result || 1;
    } catch (error) {
      console.error('Error getting next block number:', error);
      return 1;
    }
  }

  private hashObject(obj: any): string {
    const canonical = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < canonical.length; i++) {
      const char = canonical.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // Public method to get current persona for a user
  async getCurrentPersona(userId: string): Promise<string | null> {
    const state = await this.getPersonaState(userId);
    return state?.current_persona || null;
  }

  // Public method to check if persona is stable
  async isPersonaStable(userId: string): Promise<boolean> {
    const state = await this.getPersonaState(userId);
    if (!state) return false;
    
    const timeSinceStable = Date.now() - state.stable_since;
    return timeSinceStable > this.config.stability_period_ms;
  }

  // Clear cache (useful for testing or when user logs out)
  clearCache(userId?: string): void {
    if (userId) {
      this.personaStates.delete(userId);
    } else {
      this.personaStates.clear();
    }
  }
}