import { ProPersona } from '@/features/pro/types';
import { ComplianceHandler } from './ComplianceHandler';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import { supabase } from '@/integrations/supabase/client';

export interface VoiceCESession {
  id: string;
  userId: string;
  persona: ProPersona;
  courseId: string;
  courseName: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progressMarkers: VoiceProgressMarker[];
  interactionLog: VoiceInteraction[];
  completionPercentage: number;
  hoursEarned: number;
}

export interface VoiceProgressMarker {
  timestamp: Date;
  moduleId: string;
  moduleName: string;
  completed: boolean;
  quizScore?: number;
  userResponse?: string;
}

export interface VoiceInteraction {
  timestamp: Date;
  type: 'question' | 'answer' | 'clarification' | 'assessment';
  content: string;
  aiResponse?: string;
  confidence?: number;
}

export interface VoiceComplianceAlert {
  id: string;
  persona: ProPersona;
  alertType: 'ce_deadline' | 'audit_due' | 'violation_detected' | 'record_retention';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  voiceScript: string;
  deliveryPreference: 'immediate' | 'scheduled' | 'batch';
  deliveredAt?: Date;
  acknowledged?: boolean;
}

class VoiceComplianceService {
  private static instance: VoiceComplianceService;
  private activeSessions: Map<string, VoiceCESession> = new Map();

  private constructor() {}

  static getInstance(): VoiceComplianceService {
    if (!VoiceComplianceService.instance) {
      VoiceComplianceService.instance = new VoiceComplianceService();
    }
    return VoiceComplianceService.instance;
  }

  async startVoiceCESession(
    userId: string,
    persona: ProPersona,
    courseId: string,
    courseName: string,
    handler: ComplianceHandler
  ): Promise<VoiceCESession> {
    // Check if voice CE delivery is enabled for this persona
    if (!await handler.canUseVoiceAI('ceDelivery')) {
      throw new Error(`Voice CE delivery not enabled for persona: ${persona}`);
    }

    const session: VoiceCESession = {
      id: crypto.randomUUID(),
      userId,
      persona,
      courseId,
      courseName,
      startTime: new Date(),
      status: 'active',
      progressMarkers: [],
      interactionLog: [],
      completionPercentage: 0,
      hoursEarned: 0
    };

    this.activeSessions.set(session.id, session);

    // Record decision to start voice CE session
    await recordDecisionRDS({
      action: 'voice_ce_session_started',
      persona,
      inputs_hash: this.hashObject({ userId, courseId }),
      reasons: ['voice.ai', 'ce.delivery', 'interactive.learning'],
      risk_level: 'low',
      metadata: {
        sessionId: session.id,
        courseId,
        courseName,
        deliveryMethod: 'voice_ai'
      }
    });

    return session;
  }

  async recordVoiceInteraction(
    sessionId: string,
    interaction: Omit<VoiceInteraction, 'timestamp'>
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`No active session found: ${sessionId}`);
    }

    const fullInteraction: VoiceInteraction = {
      ...interaction,
      timestamp: new Date()
    };

    session.interactionLog.push(fullInteraction);

    // Update session in storage
    this.activeSessions.set(sessionId, session);

    // Record interaction for compliance audit
    await recordDecisionRDS({
      action: 'voice_ce_interaction',
      persona: session.persona,
      inputs_hash: this.hashObject(fullInteraction),
      reasons: ['voice.interaction', 'ce.progress'],
      risk_level: 'low',
      metadata: {
        sessionId,
        interactionType: interaction.type,
        hasResponse: !!interaction.content
      }
    });
  }

  async markProgress(
    sessionId: string,
    moduleId: string,
    moduleName: string,
    completed: boolean,
    quizScore?: number,
    userResponse?: string
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`No active session found: ${sessionId}`);
    }

    const marker: VoiceProgressMarker = {
      timestamp: new Date(),
      moduleId,
      moduleName,
      completed,
      quizScore,
      userResponse
    };

    session.progressMarkers.push(marker);

    // Calculate completion percentage
    const totalModules = await this.getTotalModulesForCourse(session.courseId);
    const completedModules = session.progressMarkers.filter(m => m.completed).length;
    session.completionPercentage = (completedModules / totalModules) * 100;

    // Calculate hours earned (assuming each module is worth a fraction of total course hours)
    const totalCourseHours = await this.getTotalHoursForCourse(session.courseId);
    session.hoursEarned = (completedModules / totalModules) * totalCourseHours;

    this.activeSessions.set(sessionId, session);

    // Record progress for compliance tracking
    await recordDecisionRDS({
      action: 'voice_ce_progress_marked',
      persona: session.persona,
      inputs_hash: this.hashObject(marker),
      reasons: ['ce.progress', 'module.completion'],
      risk_level: 'low',
      metadata: {
        sessionId,
        moduleId,
        completed,
        completionPercentage: session.completionPercentage,
        quizScore
      }
    });
  }

  async completeVoiceCESession(sessionId: string): Promise<VoiceCESession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`No active session found: ${sessionId}`);
    }

    session.endTime = new Date();
    session.status = 'completed';

    // Calculate final hours earned
    const completedModules = session.progressMarkers.filter(m => m.completed).length;
    const totalModules = await this.getTotalModulesForCourse(session.courseId);
    const totalCourseHours = await this.getTotalHoursForCourse(session.courseId);
    session.hoursEarned = (completedModules / totalModules) * totalCourseHours;

    this.activeSessions.set(sessionId, session);

    // Record completion for compliance
    await recordDecisionRDS({
      action: 'voice_ce_session_completed',
      persona: session.persona,
      inputs_hash: this.hashObject(session),
      reasons: ['ce.completed', 'voice.delivery'],
      risk_level: 'low',
      metadata: {
        sessionId,
        hoursEarned: session.hoursEarned,
        completionPercentage: session.completionPercentage,
        interactionCount: session.interactionLog.length,
        durationMinutes: Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
      }
    });

    return session;
  }

  async createVoiceAlert(
    persona: ProPersona,
    alertType: VoiceComplianceAlert['alertType'],
    priority: VoiceComplianceAlert['priority'],
    message: string,
    deliveryPreference: VoiceComplianceAlert['deliveryPreference'] = 'immediate'
  ): Promise<VoiceComplianceAlert> {
    const alert: VoiceComplianceAlert = {
      id: crypto.randomUUID(),
      persona,
      alertType,
      priority,
      message,
      voiceScript: this.generateVoiceScript(message, priority),
      deliveryPreference,
      acknowledged: false
    };

    // Store alert in local storage for now (will be moved to database after migration)
    const storedAlerts = JSON.parse(localStorage.getItem('voice_compliance_alerts') || '[]');
    storedAlerts.push(alert);
    localStorage.setItem('voice_compliance_alerts', JSON.stringify(storedAlerts));

    // Record decision to create alert
    await recordDecisionRDS({
      action: 'voice_compliance_alert_created',
      persona,
      inputs_hash: this.hashObject(alert),
      reasons: ['compliance.alert', alertType],
      risk_level: priority === 'urgent' ? 'high' : 'low',
      metadata: {
        alertId: alert.id,
        alertType,
        priority,
        deliveryPreference
      }
    });

    if (deliveryPreference === 'immediate') {
      await this.deliverVoiceAlert(alert);
    }

    return alert;
  }

  async deliverVoiceAlert(alert: VoiceComplianceAlert): Promise<void> {
    // Call voice delivery service (Twilio, ElevenLabs, etc.)
    try {
      // This would integrate with your voice service
      await this.callVoiceDeliveryService(alert);
      
      alert.deliveredAt = new Date();
      
      // Update alert status in local storage
      const storedAlerts = JSON.parse(localStorage.getItem('voice_compliance_alerts') || '[]');
      const alertIndex = storedAlerts.findIndex((a: any) => a.id === alert.id);
      if (alertIndex !== -1) {
        storedAlerts[alertIndex] = { ...alert, delivered_at: alert.deliveredAt.toISOString() };
        localStorage.setItem('voice_compliance_alerts', JSON.stringify(storedAlerts));
      }

      // Record delivery
      await recordDecisionRDS({
        action: 'voice_alert_delivered',
        persona: alert.persona,
        inputs_hash: this.hashObject({ alertId: alert.id }),
        reasons: ['voice.delivery', 'compliance.notification'],
        risk_level: 'low',
        metadata: {
          alertId: alert.id,
          deliveredAt: alert.deliveredAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to deliver voice alert:', error);
      
      // Record delivery failure
      await recordDecisionRDS({
        action: 'voice_alert_delivery_failed',
        persona: alert.persona,
        inputs_hash: this.hashObject({ alertId: alert.id, error: error.message }),
        reasons: ['voice.delivery.failed'],
        result: 'deny',
        risk_level: 'medium',
        metadata: {
          alertId: alert.id,
          error: error.message
        }
      });
    }
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    // Update alert status in local storage
    const storedAlerts = JSON.parse(localStorage.getItem('voice_compliance_alerts') || '[]');
    const alertIndex = storedAlerts.findIndex((a: any) => a.id === alertId);
    if (alertIndex !== -1) {
      storedAlerts[alertIndex].acknowledged = true;
      localStorage.setItem('voice_compliance_alerts', JSON.stringify(storedAlerts));
    }

    await recordDecisionRDS({
      action: 'voice_alert_acknowledged',
      persona: 'advisor', // This would be determined from context
      inputs_hash: this.hashObject({ alertId }),
      reasons: ['alert.acknowledged'],
      risk_level: 'low',
      metadata: { alertId }
    });
  }

  // Premium voice features
  async generatePersonalizedVoiceCourse(
    userId: string,
    persona: ProPersona,
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<{ courseId: string; estimatedHours: number }> {
    const courseId = `voice_custom_${crypto.randomUUID()}`;
    
    // This would integrate with AI course generation
    const estimatedHours = this.calculateCourseHours(topic, difficulty);

    await recordDecisionRDS({
      action: 'personalized_voice_course_generated',
      persona,
      inputs_hash: this.hashObject({ userId, topic, difficulty }),
      reasons: ['voice.ai', 'personalized.learning', 'premium.feature'],
      risk_level: 'low',
      metadata: {
        courseId,
        topic,
        difficulty,
        estimatedHours
      }
    });

    return { courseId, estimatedHours };
  }

  private async callVoiceDeliveryService(alert: VoiceComplianceAlert): Promise<void> {
    // Integration with voice service (Twilio Voice, ElevenLabs, etc.)
    // This would make an actual API call to deliver the voice message
    console.log(`Delivering voice alert: ${alert.voiceScript}`);
  }

  private generateVoiceScript(message: string, priority: VoiceComplianceAlert['priority']): string {
    const urgencyPrefix = priority === 'urgent' ? 'URGENT COMPLIANCE ALERT: ' : '';
    return `${urgencyPrefix}${message}. Please acknowledge this alert and take appropriate action.`;
  }

  private async getTotalModulesForCourse(courseId: string): Promise<number> {
    // This would query the course structure
    return 10; // Mock value
  }

  private async getTotalHoursForCourse(courseId: string): Promise<number> {
    // This would query the course metadata
    return 4; // Mock value
  }

  private calculateCourseHours(topic: string, difficulty: string): number {
    const baseHours = 2;
    const difficultyMultiplier = { beginner: 1, intermediate: 1.5, advanced: 2 };
    return baseHours * difficultyMultiplier[difficulty];
  }

  private hashObject(obj: any): string {
    return btoa(JSON.stringify(obj)).slice(0, 24);
  }
}

export default VoiceComplianceService;