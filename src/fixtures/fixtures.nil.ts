// src/fixtures/fixtures.nil.ts
import { recordReceipt, listReceipts, clearReceipts } from '@/features/receipts/record'
import type { DecisionRDS } from '@/features/receipts/types'
import { anchorBatch } from '@/features/anchor/providers'
import * as Canonical from '@/lib/canonical'

// Robust configuration
const CONFIG = {
  skipAnchoring: new URLSearchParams(window.location.search).get('no_anchor') === '1',
  fallbackToMemory: true,
  enableDebugLogs: !import.meta.env.PROD
}

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
    cosignRequests: number
    cosignApprovals: number
  }
  lastLoaded: string
}

// In-memory fallback state for demo
const fallbackState: { 
  snapshot: NILSnapshot | null
  invites: any[]
  educationModules: any[]
  offers: any[]
  catalogItems: any[]
  searchRows: any[]
  goals: any[]
  receipts: any[]
  isUsingFallback: boolean
} = { 
  snapshot: null,
  invites: [],
  educationModules: [],
  offers: [],
  catalogItems: [],
  searchRows: [],
  goals: [],
  receipts: [],
  isUsingFallback: true
}

// Primary state (tries DB first, falls back to memory)
const state: typeof fallbackState = { 
  snapshot: null,
  invites: [],
  educationModules: [],
  offers: [],
  catalogItems: [],
  searchRows: [],
  goals: [],
  receipts: [],
  isUsingFallback: false
}

// Safe logging utility
function safeLog(message: string, data?: any) {
  if (CONFIG.enableDebugLogs) {
    console.log(`[NIL-Fixtures] ${message}`, data || '')
  }
}

// Safe receipt operations with fallback
function safeRecordReceipt(receipt: DecisionRDS): boolean {
  try {
    recordReceipt(receipt)
    return true
  } catch (error) {
    safeLog('Receipt store failed, using fallback', error)
    state.receipts.push(receipt)
    state.isUsingFallback = true
    return false
  }
}

function safeListReceipts(): any[] {
  try {
    return listReceipts()
  } catch (error) {
    safeLog('Receipt list failed, using fallback', error)
    return state.receipts
  }
}

function safeClearReceipts(): boolean {
  try {
    clearReceipts()
    state.receipts = []
    return true
  } catch (error) {
    safeLog('Receipt clear failed, using fallback', error)
    state.receipts = []
    return false
  }
}

// Safe anchoring with skip option
async function safeAnchorBatch(data: any): Promise<any> {
  if (CONFIG.skipAnchoring) {
    safeLog('Anchoring skipped via query flag')
    return null
  }
  
  try {
    return await anchorBatch(data)
  } catch (error) {
    safeLog('Anchoring failed, continuing without', error)
    return null
  }
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

export async function loadNilFixtures(profile: Profile = 'coach'): Promise<NILSnapshot> {
  safeLog(`Loading NIL fixtures for profile: ${profile}`)
  
  try {
    // Clear existing state safely
    safeClearReceipts()
    state.invites = []
    state.educationModules = []
    state.offers = []
    state.catalogItems = []
    state.searchRows = []
    state.goals = []
  
    // Create demo data safely
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
    
    // Generate content-free receipts safely
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
    safeRecordReceipt(eduReceipt)
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
    safeRecordReceipt(inviteReceipt)
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
    safeRecordReceipt(offerReceipt)
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
      anchor_ref: await safeAnchorBatch(await Canonical.hash({ action: 'catalog.view', profile }).catch(() => 'demo_hash')),
      ts: new Date().toISOString()
    }
    safeRecordReceipt(catalogReceipt)
    receipts.push(catalogReceipt.id)
    
    // Build snapshot
    const snapshot: NILSnapshot = {
      profile,
      counts: {
        invites: state.invites.length,
        receipts: receipts.length,
        education: state.educationModules.length,
        offers: state.offers.length,
        catalog: state.catalogItems.length,
        cosignRequests: 0, // Will be updated dynamically
        cosignApprovals: 0  // Will be updated dynamically
      },
      lastLoaded: new Date().toISOString()
    }
    
    state.snapshot = snapshot
    safeLog('NIL fixtures loaded successfully', snapshot)
    return snapshot
    
  } catch (error) {
    safeLog('Failed to load NIL fixtures, using fallback', error)
    
    // Fallback to minimal snapshot
    const fallbackSnapshot: NILSnapshot = {
      profile,
        counts: {
          invites: 0,
          receipts: 0,
          education: 0,
          offers: 0,
          catalog: 0,
          cosignRequests: 0,
          cosignApprovals: 0
        },
      lastLoaded: new Date().toISOString()
    }
    
    state.snapshot = fallbackSnapshot
    state.isUsingFallback = true
    return fallbackSnapshot
  }
}

export function dehydrateNilState(): string {
  try {
    if (!state.snapshot) {
      const receipts = safeListReceipts()
      state.snapshot = {
        profile: 'coach',
        counts: {
          invites: state.invites.length,
          receipts: receipts.length,
          education: state.educationModules.length,
          offers: state.offers.length,
          catalog: state.catalogItems.length,
          cosignRequests: 0,
          cosignApprovals: 0
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
      searchRows: state.searchRows,
      goals: state.goals,
      receipts: safeListReceipts(),
      isUsingFallback: state.isUsingFallback
    }
    
    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    safeLog('Failed to dehydrate state, returning minimal', error)
    return JSON.stringify({ snapshot: null, error: 'dehydration_failed' }, null, 2)
  }
}

export function hydrateNilState(json: string): void {
  try {
    const data = JSON.parse(json)
    state.snapshot = data.snapshot
    state.invites = data.invites || []
    state.educationModules = data.educationModules || []
    state.offers = data.offers || []
    state.catalogItems = data.catalogItems || []
    state.searchRows = data.searchRows || []
    state.goals = data.goals || []
    state.isUsingFallback = data.isUsingFallback || false
    
    // Restore receipts safely
    safeClearReceipts()
    if (data.receipts) {
      data.receipts.forEach((receipt: any) => safeRecordReceipt(receipt))
    }
    
    safeLog('NIL state hydrated successfully', state.snapshot)
  } catch (error) {
    safeLog('Failed to hydrate NIL state, keeping current', error)
  }
}

export function clearNilFixtures(): void {
  try {
    safeClearReceipts()
    state.snapshot = null
    state.invites = []
    state.educationModules = []
    state.offers = []
    state.catalogItems = []
    state.searchRows = []
    state.goals = []
    state.receipts = []
    state.isUsingFallback = false
    safeLog('NIL fixtures cleared successfully')
  } catch (error) {
    safeLog('Failed to clear fixtures, forcing reset', error)
    // Force reset even if clearing fails
    Object.assign(state, {
      snapshot: null,
      invites: [],
      educationModules: [],
      offers: [],
      catalogItems: [],
      searchRows: [],
      goals: [],
      receipts: [],
      isUsingFallback: true
    })
  }
}

// Force reset with cache clearing
export function forceResetNilFixtures(): void {
  try {
    // Clear any browser caches that might exist
    if (typeof localStorage !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('nil-') || key.includes('fixtures')) {
          localStorage.removeItem(key)
        }
      })
    }
    
    clearNilFixtures()
    safeLog('Force reset completed')
  } catch (error) {
    safeLog('Force reset failed', error)
  }
}

// Getters for accessing demo data (now safe)
export function getNilInvites() {
  return state.invites || []
}

export function getNilEducationModules() {
  return state.educationModules || []
}

export function getNilOffers() {
  return state.offers || []
}

export function getNilCatalogItems() {
  return state.catalogItems || []
}

export function getNilSnapshot() {
  return state.snapshot
}

export function getNilSearchRows() {
  return state.searchRows || []
}

export function getNilGoals() {
  return state.goals || []
}

// Health check for debugging
export function getNilFixturesHealth() {
  return {
    isUsingFallback: state.isUsingFallback,
    skipAnchoring: CONFIG.skipAnchoring,
    hasSnapshot: !!state.snapshot,
    dataLoaded: {
      invites: state.invites.length,
      education: state.educationModules.length,
      offers: state.offers.length,
      catalog: state.catalogItems.length,
      searchRows: state.searchRows.length,
      goals: state.goals.length,
      receipts: state.receipts.length
    }
  }
}