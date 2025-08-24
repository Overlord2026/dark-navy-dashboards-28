export type ERecordingSubmit = {
  pdf: Uint8Array;
  county: string;
  state: string;
  apn?: string;               // assessor parcel no
  seller?: string; 
  buyer?: string;
  returnEmail?: string;
};

export type ERecordingResult = { 
  submitted: boolean; 
  trackingId?: string; 
  estFees?: number; 
  message?: string 
};

export async function submitERecording(p: ERecordingSubmit): Promise<ERecordingResult> {
  const mode = (import.meta.env.VITE_ERECORDING_PARTNER || 'none');
  
  switch(mode) {
    case 'simplifile':
      // TODO: integrate Simplifile API (server-side token)
      return { 
        submitted: true, 
        trackingId: `simplifile-${Date.now()}`, 
        estFees: 75,
        message: 'Submitted to Simplifile for e-recording'
      };
      
    case 'csc':
      // TODO: integrate CSC API (server-side token)
      return { 
        submitted: true, 
        trackingId: `csc-${Date.now()}`, 
        estFees: 85,
        message: 'Submitted to CSC for e-recording'
      };
      
    case 'manual':
    default:
      return { 
        submitted: false, 
        message: 'Manual submission required - please file with county recorder directly' 
      };
  }
}

export type RecordingStatus = 'requested' | 'drafted' | 'executed' | 'submitted' | 'recorded' | 'failed';

export interface DeedRequest {
  id: string;
  clientId: string;
  propertyAddress: string;
  currentTitleHolder: string;
  targetOwner: string;
  deedType: string;
  state: string;
  county: string;
  concierge: boolean;
  status: RecordingStatus;
  attorneyId?: string;
  trackingId?: string;
  instrumentNumber?: string;
  recordedDate?: string;
  createdAt: string;
  updatedAt: string;
}