export type ReviewSession = {
  id: string;
  clientId: string;
  state: string;
  createdBy: string;
  createdAt: string;
  status: 'requested' | 'assigned' | 'in_review' | 'signed' | 'delivered' | 'cancelled';
  attorneyUserId?: string;
  packet: { pdfId: string; sha256?: string };    // Vault id for Review Packet (pre-sign)
  signedLetter?: { pdfId: string; sha256?: string };
  signedPacket?: { pdfId: string; sha256?: string };
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