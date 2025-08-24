export type FinalVersion = {
  vno: number;                     // 1,2,3,...
  pdfId: string;                   // Vault id for merged+stamped final
  sha256: string;                  // integrity hash
  anchor_ref?: any;                // optional anchor reference
  builtAt: string;                 // ISO timestamp
  builtBy: string;                 // user id/email
  reason?: string;                 // why rebuilt (checklist change, doc edit, state fix)
  notes?: string;                  // optional notes
};

export type ReviewSession = {
  id: string;
  clientId: string;
  state: string;
  createdBy: string;
  createdAt: string;
  status: 'requested' | 'assigned' | 'in_review' | 'signed' | 'merged' | 'delivered' | 'cancelled';
  attorneyUserId?: string;
  packet: { pdfId: string; sha256?: string };    // Vault id for Review Packet (pre-sign)
  signedLetter?: { pdfId: string; sha256?: string };
  // NEW - Version tracking
  finalVersions?: FinalVersion[]; // history (v1..vN)
  currentVno?: number;            // index of "current" version (e.g., 3)
  deliveredVno?: number;          // last delivered version number
  fee?: { amount: number; currency: 'USD' };
};

export type AttorneyInfo = {
  name: string;
  barNo: string;
  state: string;
  email?: string;
};

export type ReviewPacketData = {
  clientName: string;
  state: string;
  docIds: string[];
  createdAt: string;
  disclaimerText: string;
  checklist: ReviewChecklistItem[];
};

export type ReviewChecklistItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  category: 'execution' | 'notarization' | 'witnesses' | 'filing' | 'other';
};

export type ReviewLetterData = {
  clientName: string;
  state: string;
  attorneyName: string;
  barNumber: string;
  reviewDate: string;
  letterBody: string;
  recommendations: string[];
  signatureRequired: boolean;
};