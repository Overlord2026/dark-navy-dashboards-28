export type IngestSource = 'notary' | 'review' | 'erecord' | 'esign' | 'drive' | 'email' | 'upload';

export type IngestPayload = {
  clientId: string;
  source: IngestSource;
  fileName: string;
  mime: 'application/pdf' | 'image/png' | 'image/jpeg' | 'application/zip';
  bytes: Uint8Array;
  meta?: Record<string, any>;
};

// Import the ingest function (will be defined in pipeline)
import { ingest } from './pipeline';

export async function onNotaryComplete(sessionId: string, clientId: string, pdfId: string): Promise<void> {
  console.log(`[Vault Autofill] Notary completion: ${sessionId} for client ${clientId}`);
  
  // In production, load actual bytes from vault
  const bytes = new Uint8Array(); // TODO: load from pdfId
  
  await ingest({
    clientId,
    source: 'notary',
    fileName: `notary-${sessionId}-stamped.pdf`,
    mime: 'application/pdf',
    bytes,
    meta: { sessionId, notarized: true }
  });
}

export async function onReviewFinalReady(sessionId: string, clientId: string, finalPdfId: string): Promise<void> {
  console.log(`[Vault Autofill] Review final ready: ${sessionId} for client ${clientId}`);
  
  const bytes = new Uint8Array(); // TODO: load from finalPdfId
  
  await ingest({
    clientId,
    source: 'review',
    fileName: `attorney-final-${sessionId}.pdf`,
    mime: 'application/pdf',
    bytes,
    meta: { sessionId, attorneyReviewed: true, final: true }
  });
}

export async function onERecordReturn(deedInfo: {
  clientId: string;
  state: string;
  county: string;
  instrumentNo: string;
  pdfId: string;
}): Promise<void> {
  console.log(`[Vault Autofill] E-record return:`, deedInfo);
  
  const bytes = new Uint8Array(); // TODO: load from pdfId
  
  await ingest({
    clientId: deedInfo.clientId,
    source: 'erecord',
    fileName: `deed-${deedInfo.state}-${deedInfo.county}-${deedInfo.instrumentNo}.pdf`,
    mime: 'application/pdf',
    bytes,
    meta: {
      state: deedInfo.state,
      county: deedInfo.county,
      instrumentNo: deedInfo.instrumentNo,
      recorded: true
    }
  });
}

export async function onESignCompleted(envelope: {
  clientId: string;
  pdfs: { id: string; name: string }[];
}): Promise<void> {
  console.log(`[Vault Autofill] E-sign completed:`, envelope);
  
  for (const pdf of envelope.pdfs) {
    const bytes = new Uint8Array(); // TODO: load from pdf.id
    
    await ingest({
      clientId: envelope.clientId,
      source: 'esign',
      fileName: pdf.name,
      mime: 'application/pdf',
      bytes,
      meta: { envelopeId: envelope, signed: true }
    });
  }
}

export async function onDrivePull(clientId: string, files: Array<{ name: string; bytes: Uint8Array }>): Promise<void> {
  console.log(`[Vault Autofill] Drive pull: ${files.length} files for client ${clientId}`);
  
  for (const file of files) {
    await ingest({
      clientId,
      source: 'drive',
      fileName: file.name,
      mime: 'application/pdf', // TODO: detect mime type
      bytes: file.bytes,
      meta: { driveSync: true }
    });
  }
}

export async function onEmailDrop(clientId: string, attachments: Array<{ name: string; bytes: Uint8Array }>): Promise<void> {
  console.log(`[Vault Autofill] Email drop: ${attachments.length} attachments for client ${clientId}`);
  
  for (const attachment of attachments) {
    await ingest({
      clientId,
      source: 'email',
      fileName: attachment.name,
      mime: 'application/pdf', // TODO: detect mime type
      bytes: attachment.bytes,
      meta: { emailAttachment: true }
    });
  }
}

export async function onSecureUpload(clientId: string, file: { name: string; bytes: Uint8Array }): Promise<void> {
  console.log(`[Vault Autofill] Secure upload: ${file.name} for client ${clientId}`);
  
  await ingest({
    clientId,
    source: 'upload',
    fileName: file.name,
    mime: 'application/pdf', // TODO: detect mime type
    bytes: file.bytes,
    meta: { secureUpload: true }
  });
}