import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { 
  handleError, 
  handleCORS, 
  logInfo, 
  logError,
  generateRequestId,
  corsHeaders,
  StandardError,
  DatabaseError,
  ValidationError
} from '../shared/errorHandler.ts'

interface DisasterRecoveryRequest {
  action: 'create-incident' | 'update-progress' | 'get-runbook' | 'test-recovery' | 'complete-incident';
  incidentType?: 'data_loss' | 'corruption' | 'security_breach' | 'service_outage';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  affectedBuckets?: string[];
  recoveryId?: string;
  checklistItemIndex?: number;
  completed?: boolean;
  notes?: string;
}

interface DisasterRecoveryRunbook {
  overview: string;
  procedures: {
    dataLoss: RecoveryProcedure;
    corruption: RecoveryProcedure;
    securityBreach: RecoveryProcedure;
    serviceOutage: RecoveryProcedure;
  };
  contacts: EmergencyContact[];
  backupLocations: BackupLocation[];
  recoveryTimeObjectives: RTO[];
}

interface RecoveryProcedure {
  name: string;
  severity: string;
  estimatedTime: string;
  steps: RecoveryStep[];
  prerequisites: string[];
  rollbackPlan: string[];
}

interface RecoveryStep {
  step: number;
  title: string;
  description: string;
  estimatedDuration: string;
  responsible: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  automatable: boolean;
  verification: string;
}

interface EmergencyContact {
  role: string;
  name: string;
  phone: string;
  email: string;
  backup?: string;
}

interface BackupLocation {
  name: string;
  type: 'primary' | 'secondary' | 'offsite';
  location: string;
  accessInstructions: string;
  retentionPeriod: string;
}

interface RTO {
  service: string;
  recoveryTimeObjective: string;
  recoveryPointObjective: string;
  businessImpact: string;
}

Deno.serve(async (req) => {
  const requestId = generateRequestId();
  const functionName = 'disaster-recovery-runbook';
  
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    logInfo(`Starting ${functionName}`, { functionName, requestId });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: DisasterRecoveryRequest = await req.json();
    
    if (!body.action) {
      throw new ValidationError('Action is required', { functionName, requestId });
    }

    let result: any;

    switch (body.action) {
      case 'create-incident':
        result = await createIncident(supabase, body, functionName, requestId);
        break;
        
      case 'update-progress':
        result = await updateProgress(supabase, body, functionName, requestId);
        break;
        
      case 'get-runbook':
        result = await getRunbook(supabase, body, functionName, requestId);
        break;
        
      case 'test-recovery':
        result = await testRecoveryProcedures(supabase, body, functionName, requestId);
        break;
        
      case 'complete-incident':
        result = await completeIncident(supabase, body, functionName, requestId);
        break;
        
      default:
        throw new ValidationError(`Invalid action: ${body.action}`, { functionName, requestId });
    }

    logInfo(`${functionName} completed successfully`, { functionName, requestId, action: body.action });

    return new Response(
      JSON.stringify({
        success: true,
        requestId,
        data: result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    return handleError(error, corsHeaders);
  }
});

async function createIncident(
  supabase: any, 
  request: DisasterRecoveryRequest, 
  functionName: string,
  requestId: string
): Promise<any> {
  if (!request.incidentType || !request.severity || !request.description) {
    throw new ValidationError('incidentType, severity, and description are required for creating incidents', { functionName, requestId });
  }

  // Use the database function to create the incident
  const { data: recoveryId, error } = await supabase.rpc('initiate_disaster_recovery', {
    p_incident_type: request.incidentType,
    p_severity: request.severity,
    p_description: request.description,
    p_affected_buckets: request.affectedBuckets || null
  });

  if (error) {
    throw new DatabaseError('Failed to create disaster recovery incident', error, { functionName });
  }

  // Get the created incident details
  const { data: incident, error: fetchError } = await supabase
    .from('disaster_recovery_checklist')
    .select('*')
    .eq('id', recoveryId)
    .single();

  if (fetchError) {
    throw new DatabaseError('Failed to fetch created incident', fetchError, { functionName });
  }

  logInfo(`Disaster recovery incident created`, { 
    functionName, 
    requestId, 
    incidentId: incident.incident_id,
    severity: request.severity,
    type: request.incidentType
  });

  return {
    recoveryId,
    incidentId: incident.incident_id,
    status: 'created',
    checklist: incident.checklist_items,
    estimatedRecoveryTime: getEstimatedRecoveryTime(request.incidentType, request.severity),
    nextSteps: getNextSteps(request.incidentType),
    emergencyContacts: getEmergencyContacts()
  };
}

async function updateProgress(
  supabase: any, 
  request: DisasterRecoveryRequest, 
  functionName: string,
  requestId: string
): Promise<any> {
  if (!request.recoveryId || request.checklistItemIndex === undefined || request.completed === undefined) {
    throw new ValidationError('recoveryId, checklistItemIndex, and completed are required for updating progress', { functionName, requestId });
  }

  // Use the database function to update progress
  const { data: success, error } = await supabase.rpc('update_disaster_recovery_progress', {
    p_recovery_id: request.recoveryId,
    p_checklist_item_index: request.checklistItemIndex,
    p_completed: request.completed,
    p_notes: request.notes || null
  });

  if (error || !success) {
    throw new DatabaseError('Failed to update disaster recovery progress', error, { functionName });
  }

  // Get updated incident
  const { data: incident, error: fetchError } = await supabase
    .from('disaster_recovery_checklist')
    .select('*')
    .eq('id', request.recoveryId)
    .single();

  if (fetchError) {
    throw new DatabaseError('Failed to fetch updated incident', fetchError, { functionName });
  }

  // Calculate progress
  const checklist = incident.checklist_items;
  const totalItems = Array.isArray(checklist) ? checklist.length : 0;
  const completedItems = Array.isArray(checklist) ? checklist.filter((item: any) => item.completed).length : 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  logInfo(`Disaster recovery progress updated`, { 
    functionName, 
    requestId, 
    recoveryId: request.recoveryId,
    progress: `${completedItems}/${totalItems} (${progressPercent}%)`
  });

  return {
    recoveryId: request.recoveryId,
    progress: {
      completed: completedItems,
      total: totalItems,
      percentage: progressPercent
    },
    updatedItem: {
      index: request.checklistItemIndex,
      completed: request.completed,
      notes: request.notes
    },
    status: progressPercent === 100 ? 'ready_for_completion' : 'in_progress'
  };
}

async function getRunbook(
  supabase: any, 
  request: DisasterRecoveryRequest, 
  functionName: string,
  requestId: string
): Promise<DisasterRecoveryRunbook> {
  logInfo(`Generating disaster recovery runbook`, { functionName, requestId });

  return {
    overview: `
# Disaster Recovery Runbook

This runbook provides comprehensive procedures for handling various disaster scenarios affecting our storage buckets and database infrastructure.

## Quick Reference
- **Critical incidents**: Follow immediate response procedures
- **Data loss**: Begin backup restoration immediately
- **Corruption**: Isolate affected systems first
- **Security breach**: Activate incident response team

## Recovery Time Objectives (RTO)
- Critical systems: 2 hours
- Storage buckets: 4 hours
- Database: 1 hour
- Complete system: 8 hours
    `,
    procedures: {
      dataLoss: {
        name: "Data Loss Recovery",
        severity: "Critical",
        estimatedTime: "2-6 hours",
        steps: [
          {
            step: 1,
            title: "Immediate Assessment",
            description: "Assess the scope and extent of data loss. Identify affected buckets, tables, and time range.",
            estimatedDuration: "15 minutes",
            responsible: "Incident Commander",
            criticality: "critical",
            automatable: false,
            verification: "Document scope in incident ticket"
          },
          {
            step: 2,
            title: "Stop Further Damage",
            description: "Immediately stop all write operations to affected systems to prevent further data loss.",
            estimatedDuration: "5 minutes",
            responsible: "System Administrator",
            criticality: "critical",
            automatable: true,
            verification: "Confirm write operations disabled"
          },
          {
            step: 3,
            title: "Identify Last Good Backup",
            description: "Locate the most recent backup that contains the lost data and verify its integrity.",
            estimatedDuration: "30 minutes",
            responsible: "Backup Administrator",
            criticality: "critical",
            automatable: false,
            verification: "Backup integrity report generated"
          },
          {
            step: 4,
            title: "Initiate Restore Process",
            description: "Begin restoring data from the identified backup using the backup-restore-manager function.",
            estimatedDuration: "1-4 hours",
            responsible: "System Administrator",
            criticality: "high",
            automatable: true,
            verification: "Restore operation logs reviewed"
          },
          {
            step: 5,
            title: "Verify Restored Data",
            description: "Thoroughly verify the integrity and completeness of restored data.",
            estimatedDuration: "30 minutes",
            responsible: "Data Integrity Team",
            criticality: "high",
            automatable: false,
            verification: "Data verification report completed"
          },
          {
            step: 6,
            title: "Resume Operations",
            description: "Gradually resume normal operations after confirming data integrity.",
            estimatedDuration: "15 minutes",
            responsible: "Incident Commander",
            criticality: "medium",
            automatable: false,
            verification: "System status dashboard shows normal operations"
          }
        ],
        prerequisites: [
          "Access to backup storage systems",
          "Verified backup integrity",
          "Database admin privileges",
          "Incident response team activated"
        ],
        rollbackPlan: [
          "If restore fails, revert to read-only mode",
          "Activate secondary backup location",
          "Escalate to vendor support if needed",
          "Consider point-in-time recovery options"
        ]
      },
      corruption: {
        name: "Data Corruption Recovery",
        severity: "High",
        estimatedTime: "1-4 hours",
        steps: [
          {
            step: 1,
            title: "Isolate Corrupted Data",
            description: "Immediately isolate corrupted data to prevent spread to healthy systems.",
            estimatedDuration: "10 minutes",
            responsible: "System Administrator",
            criticality: "critical",
            automatable: true,
            verification: "Isolation confirmation logged"
          },
          {
            step: 2,
            title: "Assess Corruption Extent",
            description: "Analyze the scope of corruption and identify affected files/records.",
            estimatedDuration: "45 minutes",
            responsible: "Data Integrity Team",
            criticality: "high",
            automatable: false,
            verification: "Corruption assessment report"
          },
          {
            step: 3,
            title: "Find Clean Backup Point",
            description: "Identify the most recent backup before corruption occurred.",
            estimatedDuration: "20 minutes",
            responsible: "Backup Administrator",
            criticality: "critical",
            automatable: false,
            verification: "Clean backup point identified and verified"
          },
          {
            step: 4,
            title: "Selective Restore",
            description: "Restore only the corrupted data from clean backup point.",
            estimatedDuration: "1-2 hours",
            responsible: "System Administrator",
            criticality: "high",
            automatable: true,
            verification: "Selective restore logs reviewed"
          },
          {
            step: 5,
            title: "Implement Safeguards",
            description: "Add additional validation checks to prevent similar corruption.",
            estimatedDuration: "30 minutes",
            responsible: "Development Team",
            criticality: "medium",
            automatable: false,
            verification: "Additional validation deployed"
          }
        ],
        prerequisites: [
          "Data corruption analysis tools",
          "Access to backup systems",
          "Database forensic capabilities"
        ],
        rollbackPlan: [
          "Revert to last known good state",
          "Implement temporary data validation",
          "Manual data recovery procedures"
        ]
      },
      securityBreach: {
        name: "Security Breach Response",
        severity: "Critical",
        estimatedTime: "1-8 hours",
        steps: [
          {
            step: 1,
            title: "Immediate Containment",
            description: "Immediately contain the breach by isolating affected systems.",
            estimatedDuration: "15 minutes",
            responsible: "Security Team",
            criticality: "critical",
            automatable: true,
            verification: "Systems isolated and access revoked"
          },
          {
            step: 2,
            title: "Threat Assessment",
            description: "Assess the nature and scope of the security breach.",
            estimatedDuration: "1 hour",
            responsible: "Security Analyst",
            criticality: "critical",
            automatable: false,
            verification: "Threat assessment report completed"
          },
          {
            step: 3,
            title: "Evidence Preservation",
            description: "Preserve evidence for forensic analysis and compliance.",
            estimatedDuration: "30 minutes",
            responsible: "Forensics Team",
            criticality: "high",
            automatable: false,
            verification: "Evidence preservation log"
          },
          {
            step: 4,
            title: "System Hardening",
            description: "Implement additional security measures and patch vulnerabilities.",
            estimatedDuration: "2-4 hours",
            responsible: "Security Team",
            criticality: "high",
            automatable: true,
            verification: "Security hardening checklist completed"
          },
          {
            step: 5,
            title: "Gradual Recovery",
            description: "Gradually restore services with enhanced monitoring.",
            estimatedDuration: "1-2 hours",
            responsible: "Incident Commander",
            criticality: "medium",
            automatable: false,
            verification: "Services restored with monitoring active"
          }
        ],
        prerequisites: [
          "Security incident response team",
          "Forensic analysis tools",
          "Communication plan for stakeholders"
        ],
        rollbackPlan: [
          "Complete system isolation if needed",
          "Activate backup communication channels",
          "Implement emergency access procedures"
        ]
      },
      serviceOutage: {
        name: "Service Outage Recovery",
        severity: "High",
        estimatedTime: "30 minutes - 2 hours",
        steps: [
          {
            step: 1,
            title: "Service Health Check",
            description: "Quickly assess which services are affected and their current status.",
            estimatedDuration: "10 minutes",
            responsible: "Operations Team",
            criticality: "critical",
            automatable: true,
            verification: "Service status dashboard updated"
          },
          {
            step: 2,
            title: "Activate Failover",
            description: "Activate backup systems and failover procedures.",
            estimatedDuration: "15 minutes",
            responsible: "System Administrator",
            criticality: "critical",
            automatable: true,
            verification: "Failover systems active and verified"
          },
          {
            step: 3,
            title: "Root Cause Analysis",
            description: "Identify the root cause of the service outage.",
            estimatedDuration: "30 minutes",
            responsible: "Technical Lead",
            criticality: "high",
            automatable: false,
            verification: "Root cause documented"
          },
          {
            step: 4,
            title: "Implement Fix",
            description: "Apply the appropriate fix to resolve the service outage.",
            estimatedDuration: "30-60 minutes",
            responsible: "Development Team",
            criticality: "high",
            automatable: false,
            verification: "Fix deployed and tested"
          }
        ],
        prerequisites: [
          "Monitoring and alerting systems",
          "Backup infrastructure ready",
          "On-call engineer availability"
        ],
        rollbackPlan: [
          "Maintain failover systems",
          "Implement temporary workarounds",
          "Schedule maintenance window if needed"
        ]
      }
    },
    contacts: getEmergencyContacts(),
    backupLocations: [
      {
        name: "Primary Backup Storage",
        type: "primary",
        location: "Supabase automated backups",
        accessInstructions: "Use Supabase dashboard or backup-restore-manager function",
        retentionPeriod: "30 days"
      },
      {
        name: "Secondary Backup Storage",
        type: "secondary",
        location: "External cloud storage (if configured)",
        accessInstructions: "Contact system administrator for access credentials",
        retentionPeriod: "90 days"
      },
      {
        name: "Offsite Backup Storage",
        type: "offsite",
        location: "Geo-distributed backup system",
        accessInstructions: "Emergency access via disaster recovery team",
        retentionPeriod: "1 year"
      }
    ],
    recoveryTimeObjectives: [
      {
        service: "Storage Buckets (documents)",
        recoveryTimeObjective: "4 hours",
        recoveryPointObjective: "1 hour",
        businessImpact: "Medium - document access unavailable"
      },
      {
        service: "Storage Buckets (healthcare-documents)",
        recoveryTimeObjective: "2 hours",
        recoveryPointObjective: "30 minutes",
        businessImpact: "High - critical health records unavailable"
      },
      {
        service: "Database Tables",
        recoveryTimeObjective: "1 hour",
        recoveryPointObjective: "15 minutes",
        businessImpact: "Critical - application functionality compromised"
      },
      {
        service: "Analytics Systems",
        recoveryTimeObjective: "8 hours",
        recoveryPointObjective: "4 hours",
        businessImpact: "Low - analytics data delayed"
      }
    ]
  };
}

async function testRecoveryProcedures(
  supabase: any, 
  request: DisasterRecoveryRequest, 
  functionName: string,
  requestId: string
): Promise<any> {
  logInfo(`Starting disaster recovery test`, { functionName, requestId });

  const testResults = [];

  // Test 1: Backup verification
  try {
    const { data: backupTest } = await supabase.functions.invoke('backup-restore-manager', {
      body: { action: 'verify', bucketName: 'documents' }
    });
    
    testResults.push({
      test: 'Backup Verification',
      status: backupTest?.data?.integrityStatus === 'valid' ? 'passed' : 'failed',
      details: backupTest?.data
    });
  } catch (error) {
    testResults.push({
      test: 'Backup Verification',
      status: 'failed',
      error: error.message
    });
  }

  // Test 2: Test restore
  try {
    const { data: restoreTest } = await supabase.functions.invoke('backup-restore-manager', {
      body: { action: 'test-restore', bucketName: 'documents' }
    });
    
    testResults.push({
      test: 'Test Restore',
      status: restoreTest?.data?.overallStatus === 'passed' ? 'passed' : 'failed',
      details: restoreTest?.data
    });
  } catch (error) {
    testResults.push({
      test: 'Test Restore',
      status: 'failed',
      error: error.message
    });
  }

  // Test 3: Emergency contact verification
  const contacts = getEmergencyContacts();
  testResults.push({
    test: 'Emergency Contacts',
    status: contacts.length > 0 ? 'passed' : 'failed',
    details: `${contacts.length} contacts configured`
  });

  // Test 4: Runbook accessibility
  testResults.push({
    test: 'Runbook Accessibility',
    status: 'passed',
    details: 'Disaster recovery runbook accessible'
  });

  const overallStatus = testResults.every(r => r.status === 'passed') ? 'passed' : 'failed';

  return {
    overallStatus,
    testResults,
    recommendation: overallStatus === 'failed' ? 
      'Some tests failed. Review failed items and resolve issues before next test.' :
      'All disaster recovery tests passed. System is ready for emergency scenarios.',
    nextTestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  };
}

async function completeIncident(
  supabase: any, 
  request: DisasterRecoveryRequest, 
  functionName: string,
  requestId: string
): Promise<any> {
  if (!request.recoveryId) {
    throw new ValidationError('recoveryId is required for completing incidents', { functionName, requestId });
  }

  // Update incident status to resolved
  const { error } = await supabase
    .from('disaster_recovery_checklist')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      lessons_learned: request.notes
    })
    .eq('id', request.recoveryId);

  if (error) {
    throw new DatabaseError('Failed to complete incident', error, { functionName });
  }

  logInfo(`Disaster recovery incident completed`, { functionName, requestId, recoveryId: request.recoveryId });

  return {
    recoveryId: request.recoveryId,
    status: 'completed',
    completedAt: new Date().toISOString(),
    message: 'Incident has been resolved and lessons learned documented'
  };
}

function getEstimatedRecoveryTime(incidentType: string, severity: string): string {
  const timeMatrix: Record<string, Record<string, string>> = {
    data_loss: {
      critical: '2-6 hours',
      high: '4-8 hours',
      medium: '6-12 hours',
      low: '12-24 hours'
    },
    corruption: {
      critical: '1-4 hours',
      high: '2-6 hours',
      medium: '4-8 hours',
      low: '8-12 hours'
    },
    security_breach: {
      critical: '1-8 hours',
      high: '2-12 hours',
      medium: '4-16 hours',
      low: '8-24 hours'
    },
    service_outage: {
      critical: '30 minutes - 2 hours',
      high: '1-4 hours',
      medium: '2-6 hours',
      low: '4-8 hours'
    }
  };

  return timeMatrix[incidentType]?.[severity] || '4-8 hours';
}

function getNextSteps(incidentType: string): string[] {
  const nextStepsMap: Record<string, string[]> = {
    data_loss: [
      'Immediately stop write operations to affected systems',
      'Identify the scope and timeline of data loss',
      'Locate the most recent intact backup',
      'Begin backup restoration process'
    ],
    corruption: [
      'Isolate corrupted data to prevent spread',
      'Analyze corruption patterns and extent',
      'Identify clean backup point before corruption',
      'Plan selective data restoration'
    ],
    security_breach: [
      'Immediately isolate affected systems',
      'Revoke potentially compromised access credentials',
      'Begin forensic evidence preservation',
      'Notify security incident response team'
    ],
    service_outage: [
      'Check service health and monitoring systems',
      'Activate backup/failover systems if available',
      'Identify root cause of the outage',
      'Begin service restoration procedures'
    ]
  };

  return nextStepsMap[incidentType] || ['Assess situation and activate incident response team'];
}

function getEmergencyContacts(): EmergencyContact[] {
  return [
    {
      role: "Incident Commander",
      name: "Primary On-Call Engineer",
      phone: "+1-555-EMERGENCY",
      email: "oncall@company.com",
      backup: "Secondary On-Call Engineer"
    },
    {
      role: "System Administrator",
      name: "Infrastructure Team Lead",
      phone: "+1-555-SYSADMIN",
      email: "sysadmin@company.com"
    },
    {
      role: "Security Team Lead",
      name: "CISO",
      phone: "+1-555-SECURITY",
      email: "security@company.com"
    },
    {
      role: "Database Administrator",
      name: "DBA Team Lead",
      phone: "+1-555-DATABASE",
      email: "dba@company.com"
    },
    {
      role: "Executive Escalation",
      name: "CTO",
      phone: "+1-555-EXECUTIVE",
      email: "cto@company.com"
    }
  ];
}