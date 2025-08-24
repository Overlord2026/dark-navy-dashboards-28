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

  // New Jersey
  'NJ/Bergen': { state:'NJ', county:'Bergen', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, minFontPt:10, eRecording:true, providers:['simplifile'], notes:'Transfer tax + Realty Transfer Fee; verify cover sheet.' },
  'NJ/Middlesex': { state:'NJ', county:'Middlesex', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'NJ/Essex': { state:'NJ', county:'Essex', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile','csc'] },
  'NJ/Hudson': { state:'NJ', county:'Hudson', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'NJ/Monmouth': { state:'NJ', county:'Monmouth', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Virginia
  'VA/Fairfax': { state:'VA', county:'Fairfax', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile','csc'] },
  'VA/Prince William': { state:'VA', county:'Prince William', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'VA/Virginia Beach': { state:'VA', county:'Virginia Beach', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'VA/Loudoun': { state:'VA', county:'Loudoun', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'VA/Chesterfield': { state:'VA', county:'Chesterfield', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Washington
  'WA/King': { state:'WA', county:'King', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WA/Pierce': { state:'WA', county:'Pierce', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WA/Snohomish': { state:'WA', county:'Snohomish', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WA/Spokane': { state:'WA', county:'Spokane', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WA/Clark': { state:'WA', county:'Clark', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Arizona
  'AZ/Maricopa': { state:'AZ', county:'Maricopa', pageSize:'Letter', topMarginIn:2, leftMarginIn:0.5, rightMarginIn:0.5, bottomMarginIn:0.5, firstPageStamp:{xIn:6.5,yIn:0.5,wIn:2.0,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile','csc'] },
  'AZ/Pima': { state:'AZ', county:'Pima', pageSize:'Letter', topMarginIn:2, leftMarginIn:0.5, rightMarginIn:0.5, bottomMarginIn:0.5, firstPageStamp:{xIn:6.5,yIn:0.5,wIn:2.0,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'AZ/Pinal': { state:'AZ', county:'Pinal', pageSize:'Letter', topMarginIn:2, leftMarginIn:0.5, rightMarginIn:0.5, bottomMarginIn:0.5, firstPageStamp:{xIn:6.5,yIn:0.5,wIn:2.0,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'AZ/Yavapai': { state:'AZ', county:'Yavapai', pageSize:'Letter', topMarginIn:2, leftMarginIn:0.5, rightMarginIn:0.5, bottomMarginIn:0.5, firstPageStamp:{xIn:6.5,yIn:0.5,wIn:2.0,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'AZ/Yuma': { state:'AZ', county:'Yuma', pageSize:'Letter', topMarginIn:2, leftMarginIn:0.5, rightMarginIn:0.5, bottomMarginIn:0.5, firstPageStamp:{xIn:6.5,yIn:0.5,wIn:2.0,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Massachusetts
  'MA/Middlesex': { state:'MA', county:'Middlesex', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MA/Worcester': { state:'MA', county:'Worcester', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'MA/Suffolk': { state:'MA', county:'Suffolk', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'MA/Essex': { state:'MA', county:'Essex', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MA/Norfolk': { state:'MA', county:'Norfolk', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Tennessee
  'TN/Shelby': { state:'TN', county:'Shelby', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'TN/Davidson': { state:'TN', county:'Davidson', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'TN/Knox': { state:'TN', county:'Knox', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'TN/Hamilton': { state:'TN', county:'Hamilton', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'TN/Rutherford': { state:'TN', county:'Rutherford', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Indiana
  'IN/Marion': { state:'IN', county:'Marion', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile','csc'] },
  'IN/Lake': { state:'IN', county:'Lake', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'IN/Allen': { state:'IN', county:'Allen', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'IN/Hamilton': { state:'IN', county:'Hamilton', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'IN/St Joseph': { state:'IN', county:'St Joseph', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },

  // Missouri
  'MO/St Louis County': { state:'MO', county:'St Louis County', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MO/Jackson': { state:'MO', county:'Jackson', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'MO/St Charles': { state:'MO', county:'St Charles', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MO/Greene': { state:'MO', county:'Greene', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MO/Clay': { state:'MO', county:'Clay', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },

  // Maryland
  'MD/Montgomery': { state:'MD', county:'Montgomery', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.25,yIn:0.5,wIn:2.25,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MD/Prince George\'s': { state:'MD', county:'Prince George\'s', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.25,yIn:0.5,wIn:2.25,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile','csc'] },
  'MD/Baltimore County': { state:'MD', county:'Baltimore County', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.25,yIn:0.5,wIn:2.25,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'MD/Anne Arundel': { state:'MD', county:'Anne Arundel', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.25,yIn:0.5,wIn:2.25,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'MD/Howard': { state:'MD', county:'Howard', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.25,yIn:0.5,wIn:2.25,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },

  // Wisconsin
  'WI/Milwaukee': { state:'WI', county:'Milwaukee', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WI/Dane': { state:'WI', county:'Dane', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
  'WI/Waukesha': { state:'WI', county:'Waukesha', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WI/Brown': { state:'WI', county:'Brown', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['simplifile'] },
  'WI/Racine': { state:'WI', county:'Racine', pageSize:'Letter', topMarginIn:3, leftMarginIn:1, rightMarginIn:1, bottomMarginIn:1, firstPageStamp:{xIn:6.0,yIn:0.5,wIn:2.5,hIn:3.0}, requiresReturnAddress:true, requiresPreparer:true, requiresAPN:true, eRecording:true, providers:['csc'] },
};

import { getDefaultCountyMeta } from '../states/registry';

export function getCountyKey(state: string, county: string): string { 
  return `${state}/${county}`; 
}

export function getCountiesByState(state: string): string[] {
  return Object.keys(COUNTY_META)
    .filter(key => key.startsWith(`${state}/`))
    .map(key => key.split('/')[1]);
}

export function getCountyMeta(state: string, county: string): CountyMeta | null {
  const existing = COUNTY_META[getCountyKey(state, county)];
  if (existing) return existing;
  
  // Return fallback with warning
  return {
    ...getDefaultCountyMeta(state, county),
    notes: `FALLBACK - ${county} County not configured. Verify requirements with ${state} ${county} County Recorder.`
  } as CountyMeta;
}