// src/fixtures/fixtures.nil.ts
import { recordReceipt, listReceipts, clearReceipts } from '@/features/receipts/record'
import type { DecisionRDS } from '@/features/receipts/types'
import { anchorBatch } from '@/features/anchor/providers'
import { hash } from '@/lib/canonical'

type Profile = 'coach' | 'mom'

// NIL Demo State
interface NILSnapshot {
  profile: Profile
  counts: {
    invites: number
    receipts: number
    education: number
    offers: number
    catalog: number
  }
  lastLoaded: string
}

// In-memory state for demo
const state: { 
  snapshot: NILSnapshot | null
  invites: any[]
  educationModules: any[]
  offers: any[]
  catalogItems: any[]
  searchRows: any[]
  goals: any[]
} = { 
  snapshot: null,
  invites: [],
  educationModules: [],
  offers: [],
  catalogItems: [],
  searchRows: [],
  goals: []
}

// Demo data generators
function createDemoInvites(profile: Profile) {
  const baseInvites = [
    { email: 'tony@awmfl.com', role: 'Advisor', status: 'pending', id: `inv_${Date.now()}_1` }
  ]
  
  if (profile === 'mom') {
    baseInvites.push(
      { email: 'guardian@example.com', role: 'Guardian', status: 'pending', id: `inv_${Date.now()}_2` }
    )
  }
  
  return baseInvites
}

function createDemoEducation() {
  return [
    { id: 'nil_basics', name: 'NIL Basics', status: 'complete', progress: 100 },
    { id: 'disclosure_ftc', name: 'Disclosure & FTC', status: 'complete', progress: 100 },
    { id: 'brand_safety', name: 'Brand Safety', status: 'complete', progress: 100 }
  ]
}

function createDemoOffer(profile: Profile) {
  const brand = profile === 'coach' ? 'Local Coffee Co.' : 'Youth Sports Gear'
  return {
    id: `offer_${Date.now()}`,
    brand,
    category: 'Food & Bev',
    budget: 500,
    channels: ['IG', 'TikTok'],
    start: '2025-09-01',
    end: '2025-09-30',
    status: 'active'
  }
}

function createDemoCatalog() {
  return [
    {
      id: `catalog_${Date.now()}`,
      title: 'Media Kit Review',
      price: 99,
      category: 'Content Creation',
      description: 'Professional review of your NIL media kit and recommendations',
      actionPath: '/nil/marketplace'
    }
  ]
}

export async function loadNilFixtures(profile: Profile = 'coach') {
  console.log(`Loading NIL fixtures for profile: ${profile}`)
  
  // Clear existing state
  clearReceipts()
  state.invites = []
  state.educationModules = []
  state.offers = []
  state.catalogItems = []
  
  // Create demo data
  state.invites = createDemoInvites(profile)
  state.educationModules = createDemoEducation()
  const offer = createDemoOffer(profile)
  state.offers = [offer]
  state.catalogItems = createDemoCatalog()
  state.searchRows = [
    { id: 'search_1', term: '#LocalBusiness', category: 'hashtag', trending: true, actionPath: '/nil/offers', actionLabel: 'Create Offer' },
    { id: 'search_2', term: 'Campus Coffee Co.', category: 'local_brand', trending: false, actionPath: '/nil/marketplace', actionLabel: 'View Brand' },
    { id: 'search_3', term: 'State University', category: 'school', trending: false, actionPath: '/nil/offers', actionLabel: 'Check Rules' }
  ]
  state.goals = [
    { id: 'goal_1', title: 'Land 2 local brand deals this month', description: 'Focus on food & beverage partnerships', progress: 65, status: 'on_track', deadline: '2025-09-30', category: 'Partnerships', actionPath: '/nil/offers', actionLabel: 'Create Offer' },
    { id: 'goal_2', title: 'Complete compliance training', description: 'Finish all required NIL education modules', progress: 100, status: 'active', deadline: '2025-09-15', category: 'Education', actionPath: '/nil/education', actionLabel: 'View Progress' }
  ]
  
  // Generate content-free receipts
  const receipts = []
  
  // Education completion receipt
  const eduReceipt: DecisionRDS = {
    id: `rds_edu_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'education.complete',
    policy_version: 'NIL-2025.01',
    inputs_hash: 'sha256:education_demo',
    reasons: ['EDU_MODULES_COMPLETE'],
    result: 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  }
  recordReceipt(eduReceipt)
  receipts.push(eduReceipt.id)
  
  // Invite creation receipt
  const inviteReceipt: DecisionRDS = {
    id: `rds_invite_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'invite.create',
    policy_version: 'NIL-2025.01',
    inputs_hash: 'sha256:invite_demo',
    reasons: ['INVITE_ADVISOR_APPROVED'],
    result: 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  }
  recordReceipt(inviteReceipt)
  receipts.push(inviteReceipt.id)
  
  // Offer creation receipt
  const offerReceipt: DecisionRDS = {
    id: `rds_offer_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'offer.create',
    policy_version: 'NIL-2025.01',
    inputs_hash: 'sha256:offer_demo',
    reasons: ['NO_CONFLICTS_FOUND'],
    result: 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  }
  recordReceipt(offerReceipt)
  receipts.push(offerReceipt.id)
  
  // Catalog view receipt (anchored for demo)
  const catalogReceipt: DecisionRDS = {
    id: `rds_catalog_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'catalog.view',
    policy_version: 'NIL-2025.01',
    inputs_hash: 'sha256:catalog_demo',
    reasons: ['CATALOG_ACCESS_GRANTED'],
    result: 'approve',
    anchor_ref: await anchorBatch(await hash({ action: 'catalog.view', profile })),
    ts: new Date().toISOString()
  }
  recordReceipt(catalogReceipt)
  receipts.push(catalogReceipt.id)
  
  // Build snapshot
  const snapshot: NILSnapshot = {
    profile,
    counts: {
      invites: state.invites.length,
      receipts: receipts.length,
      education: state.educationModules.length,
      offers: state.offers.length,
      catalog: state.catalogItems.length
    },
    lastLoaded: new Date().toISOString()
  }
  
  state.snapshot = snapshot
  
  console.log('NIL fixtures loaded:', snapshot)
  return snapshot
}

export function dehydrateNilState(): string {
  if (!state.snapshot) {
    const receipts = listReceipts()
    state.snapshot = {
      profile: 'coach',
      counts: {
        invites: state.invites.length,
        receipts: receipts.length,
        education: state.educationModules.length,
        offers: state.offers.length,
        catalog: state.catalogItems.length
      },
      lastLoaded: new Date().toISOString()
    }
  }
  
  const exportData = {
    snapshot: state.snapshot,
    invites: state.invites,
    educationModules: state.educationModules,
    offers: state.offers,
    catalogItems: state.catalogItems,
    receipts: listReceipts()
  }
  
  return JSON.stringify(exportData, null, 2)
}

export function hydrateNilState(json: string): void {
  try {
    const data = JSON.parse(json)
    state.snapshot = data.snapshot
    state.invites = data.invites || []
    state.educationModules = data.educationModules || []
    state.offers = data.offers || []
    state.catalogItems = data.catalogItems || []
    
    // Restore receipts
    clearReceipts()
    if (data.receipts) {
      data.receipts.forEach((receipt: any) => recordReceipt(receipt))
    }
    
    console.log('NIL state hydrated:', state.snapshot)
  } catch (error) {
    console.error('Failed to hydrate NIL state:', error)
  }
}

export function clearNilFixtures(): void {
  clearReceipts()
  state.snapshot = null
  state.invites = []
  state.educationModules = []
  state.offers = []
  state.catalogItems = []
  console.log('NIL fixtures cleared')
}

// Getters for accessing demo data
export function getNilInvites() {
  return state.invites
}

export function getNilEducationModules() {
  return state.educationModules
}

export function getNilOffers() {
  return state.offers
}

export function getNilCatalogItems() {
  return state.catalogItems
}

export function getNilSnapshot() {
  return state.snapshot
}

export function getNilSearchRows() {
  return state.searchRows
}

export function getNilGoals() {
  return state.goals
}