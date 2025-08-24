export type CountyProvider = 'simplifile' | 'csc';
export type FirstPageStamp = { xIn: number; yIn: number; wIn: number; hIn: number; }; // inches from top-left
export type CountyMeta = {
  state: string; 
  county: string; 
  fips?: string;
  pageSize: 'Letter' | 'Legal';
  topMarginIn: number; 
  leftMarginIn: number; 
  rightMarginIn: number; 
  bottomMarginIn: number;
  firstPageStamp: FirstPageStamp;             // reserved area for Recorder stamp
  requiresReturnAddress: boolean;
  requiresPreparer: boolean;
  requiresGranteeAddress?: boolean;
  requiresAPN?: boolean;                       // Parcel/APN mandatory
  minFontPt?: number;                          // e.g., 10
  inkColor?: 'black' | 'blue';
  notarizationVariant?: 'standard' | 'stateSpecific';
  transferTaxNote?: string;                    // guidance only (attorney computes)
  eRecording: boolean;
  providers?: CountyProvider[];               // allowed providers if eRecording
  notes?: string;
};

export type CountyMetaMap = Record<string, CountyMeta>; // key: "CA/Los Angeles"

export const COUNTY_META: CountyMetaMap = {
  // California
  'CA/Los Angeles': {
    state: 'CA', county: 'Los Angeles', pageSize: 'Letter',
    topMarginIn: 2.5, leftMarginIn: 0.5, rightMarginIn: 0.5, bottomMarginIn: 0.5,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresGranteeAddress: true, requiresAPN: true,
    minFontPt: 10, inkColor: 'black', notarizationVariant: 'stateSpecific',
    transferTaxNote: 'City/county documentary transfer taxes may apply. Attorney computes.',
    eRecording: true, providers: ['simplifile', 'csc'],
    notes: 'Strict first-page margin; confirm APN formatting.'
  },
  'CA/San Diego': {
    state: 'CA', county: 'San Diego', pageSize: 'Letter',
    topMarginIn: 2.5, leftMarginIn: 0.5, rightMarginIn: 0.5, bottomMarginIn: 0.5,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresGranteeAddress: true, requiresAPN: true,
    minFontPt: 10, inkColor: 'black', notarizationVariant: 'stateSpecific',
    transferTaxNote: 'County taxes; city may impose additional tax.',
    eRecording: true, providers: ['simplifile']
  },

  // Texas
  'TX/Harris': {
    state: 'TX', county: 'Harris', pageSize: 'Letter',
    topMarginIn: 1.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true,
    minFontPt: 10, inkColor: 'black', notarizationVariant: 'stateSpecific',
    transferTaxNote: 'Doc stamps not typical; verify consideration language.',
    eRecording: true, providers: ['simplifile', 'csc']
  },
  'TX/Dallas': {
    state: 'TX', county: 'Dallas', pageSize: 'Letter',
    topMarginIn: 1.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true,
    minFontPt: 10, inkColor: 'black', notarizationVariant: 'stateSpecific',
    eRecording: true, providers: ['simplifile']
  },

  // Florida
  'FL/Miami-Dade': {
    state: 'FL', county: 'Miami-Dade', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresGranteeAddress: true, requiresAPN: true,
    minFontPt: 10, inkColor: 'black', notarizationVariant: 'stateSpecific',
    transferTaxNote: 'Doc stamp tax likely; attorney to compute.',
    eRecording: true, providers: ['simplifile', 'csc']
  },
  'FL/Broward': {
    state: 'FL', county: 'Broward', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresGranteeAddress: true, requiresAPN: true,
    eRecording: true, providers: ['simplifile']
  },

  // New York
  'NY/New York': {
    state: 'NY', county: 'New York', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 0.5, rightMarginIn: 0.5, bottomMarginIn: 0.5,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresGranteeAddress: true, requiresAPN: true,
    minFontPt: 10, notarizationVariant: 'stateSpecific',
    transferTaxNote: 'NYC RPTT + State transfer tax possible.',
    eRecording: true, providers: ['csc'], notes: 'NYC has strict margin/cover requirements.'
  },
  'NY/Kings': {
    state: 'NY', county: 'Kings', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 0.5, rightMarginIn: 0.5, bottomMarginIn: 0.5,
    firstPageStamp: { xIn: 6.5, yIn: 0.5, wIn: 2.0, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresGranteeAddress: true, requiresAPN: true,
    eRecording: true, providers: ['csc']
  },

  // Pennsylvania
  'PA/Philadelphia': {
    state: 'PA', county: 'Philadelphia', pageSize: 'Letter',
    topMarginIn: 2.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.25, yIn: 0.5, wIn: 2.25, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true,
    transferTaxNote: 'Philadelphia & PA transfer taxes apply.',
    eRecording: true, providers: ['simplifile']
  },
  'PA/Allegheny': {
    state: 'PA', county: 'Allegheny', pageSize: 'Letter',
    topMarginIn: 2.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.25, yIn: 0.5, wIn: 2.25, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true,
    eRecording: true, providers: ['simplifile']
  },

  // Illinois
  'IL/Cook': {
    state: 'IL', county: 'Cook', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true,
    transferTaxNote: 'City (Chicago) transfer taxes may apply.',
    eRecording: true, providers: ['simplifile', 'csc']
  },
  'IL/DuPage': {
    state: 'IL', county: 'DuPage', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true,
    eRecording: true, providers: ['simplifile']
  },

  // Ohio
  'OH/Cuyahoga': { 
    state: 'OH', county: 'Cuyahoga', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['simplifile'] 
  },
  'OH/Franklin': { 
    state: 'OH', county: 'Franklin', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['simplifile'] 
  },

  // Georgia
  'GA/Fulton': { 
    state: 'GA', county: 'Fulton', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['simplifile'] 
  },
  'GA/DeKalb': { 
    state: 'GA', county: 'DeKalb', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['simplifile'] 
  },

  // North Carolina
  'NC/Mecklenburg': { 
    state: 'NC', county: 'Mecklenburg', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['csc'] 
  },
  'NC/Wake': { 
    state: 'NC', county: 'Wake', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['csc'] 
  },

  // Michigan
  'MI/Wayne': { 
    state: 'MI', county: 'Wayne', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['simplifile', 'csc'] 
  },
  'MI/Oakland': { 
    state: 'MI', county: 'Oakland', pageSize: 'Letter',
    topMarginIn: 3.0, leftMarginIn: 1.0, rightMarginIn: 1.0, bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true, requiresPreparer: true, requiresAPN: true, 
    eRecording: true, providers: ['simplifile'] 
  },
};

export function getCountyKey(state: string, county: string): string { 
  return `${state}/${county}`; 
}

export function getCountiesByState(state: string): string[] {
  return Object.keys(COUNTY_META)
    .filter(key => key.startsWith(`${state}/`))
    .map(key => key.split('/')[1]);
}

export function getCountyMeta(state: string, county: string): CountyMeta | null {
  return COUNTY_META[getCountyKey(state, county)] || null;
}