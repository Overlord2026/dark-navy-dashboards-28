// Healthcare module exports
export * from './gates';
export * from './receipts';
export * from './fhir';

export { healthcareGate, checkHealthcareAccess } from './gates';
export { recordHealthRDS, recordConsentRDS, recordVaultRDS, healthcareReceiptStore } from './receipts';
export { fhirConnector, defaultFHIRConfig } from './fhir';
export type { HealthcareContext, GateResult } from './gates';
export type { HealthRDS, ConsentRDS, VaultRDS, HealthcareRDS } from './receipts';
export type { FHIRConfig, PatientSummary, HealthPlan } from './fhir';