// BFO Global IP Execution - Patent Module Definitions
export const PATENT_MODULES = {
  P1: {
    id: 'P1',
    name: 'Persona-Gated OS™',
    title: 'Multi-Persona Operating System with Team Builder',
    routes: ['/team/new', '/team/:id', '/settings/permissions'],
    events: ['persona_claimed', 'rbac_policy_applied', 'team_created'],
    description: 'Persona detection + feature gating middleware; Tenant/Role RBAC; Consent Graph; Family Team Builder workspace'
  },
  P2: {
    id: 'P2', 
    name: 'SWAG Lead Score™',
    title: 'Strategic Wealth Alpha GPS Scoring',
    routes: ['/swag/score', '/swag/review'],
    events: ['swag_score_calculated', 'swag_override_applied'],
    description: 'Scoring service with privacy-preserving ingestion, calibrated bands, explanations, human override queue'
  },
  P3: {
    id: 'P3',
    name: 'Portfolio Intelligence (Phase-Aware)',
    title: 'Phase-Based Portfolio Optimization',
    routes: ['/portfolio/optimizer'],
    events: ['phase_plan_generated', 'rebal_queue_enqueued'],
    description: 'Phase engine (Income Now/Later/Growth/Legacy), constraint sets, execution queue'
  },
  P4: {
    id: 'P4',
    name: 'Volatility Shield',
    title: 'Adaptive Risk Management System',
    routes: ['/risk/volatility-shield'],
    events: ['throttle_changed', 'circuit_breaker_tripped'],
    description: 'Regime detector, risk throttle, circuit-breaker ladder; latency-bounded signals'
  },
  P5: {
    id: 'P5',
    name: 'Private Market Alpha',
    title: 'Private Market Intelligence Engine',
    routes: ['/private/alpha'],
    events: ['pm_alpha_signal_published'],
    description: 'Manager overlap/trend diffusion signals, explainability report'
  },
  P6: {
    id: 'P6',
    name: 'Due Diligence AI',
    title: 'AI-Powered Due Diligence Platform',
    routes: ['/dd/new', '/dd/:id'],
    events: ['dd_redflag_detected', 'dd_pack_exported'],
    description: 'Ingestion pipeline (PDF/HTML), red-flag taxonomy, overlap graphs, audit-pack export'
  },
  P7: {
    id: 'P7',
    name: 'Liquidity IQ™',
    title: 'Liquidity Intelligence System',
    routes: ['/liquidity/score'],
    events: ['liquidity_score_calculated'],
    description: 'Composite score (gate probability, NAV→cash latency, fulfillment history, penalty curve)'
  },
  P8: {
    id: 'P8',
    name: 'Annuity & Insurance Intelligence',
    title: 'Fiduciary Insurance Analytics',
    routes: ['/annuity/intel'],
    events: ['annuity_warning_flagged'],
    description: 'Fiduciary no-commission filters, surrender schedule optimizer, rollover red-flags'
  },
  P9: {
    id: 'P9',
    name: 'Longevity Advantage AI™',
    title: 'Healthspan-Wealthspan Integration',
    routes: ['/longevity/advantage'],
    events: ['longevity_plan_generated'],
    description: 'Healthspan input mapper (HIPAA-safe embeddings), product timing recommendations'
  },
  P10: {
    id: 'P10',
    name: 'EpochVault™',
    title: 'Multi-Generational Secure Vault with AI Avatar',
    routes: ['/vault', '/vault/avatar'],
    events: ['vault_trigger_fired', 'avatar_session_started'],
    description: 'Event-gated secure vault, multi-gen access policy, zero-knowledge training pipeline, ethics guardrails'
  },
  P11: {
    id: 'P11',
    name: 'AI Executive Suite',
    title: 'AI-Powered Executive Management Platform',
    routes: ['/exec-suite'],
    events: ['exec_action_executed'],
    description: 'Data contracts, KPI targets, anomaly detectors; RBAC-scoped actions; spend controllers'
  },
  P12: {
    id: 'P12',
    name: 'IP Navigator (Creator)',
    title: 'Intellectual Property Creation Assistant',
    routes: ['/ip/navigator'],
    events: ['ip_claim_draft_generated'],
    description: 'Prior-art search → risk scoring → claim draft → TEAS/PCT export templates'
  },
  P13: {
    id: 'P13',
    name: 'IP Guardian (Defender)',
    title: 'Intellectual Property Protection System',
    routes: ['/ip/guardian'],
    events: ['ip_notice_prepared'],
    description: 'Watchlists (marks/domains/repos/social); notice generator; escalation playbook'
  },
  P14: {
    id: 'P14',
    name: 'Compliance IQ™',
    title: 'AI-Powered Compliance Management',
    routes: ['/compliance/ce', '/compliance/ads'],
    events: ['ce_deadline_risk', 'ad_prepub_flagged', 'audit_export_created'],
    description: 'Rules ingestion (SEC/FINRA/state boards); persona mapping; deadline risk score; CE course matcher'
  },
  P15: {
    id: 'P15',
    name: 'Onboarding/Migration Engine',
    title: 'Automated Client Onboarding and Migration',
    routes: ['/onboarding', '/migration'],
    events: ['adv_prefill_done', 'nigo_predicted', 'migration_packet_ready'],
    description: 'ADV/U4 prefill; custodian packet generator; SWAG prepopulation; NIGO prediction'
  }
} as const;

export const TRADEMARK_MODULES = {
  T1: 'BFO Multi-Persona OS™',
  T2: 'BFO Compliance IQ™', 
  T3: 'EpochVault™',
  T4: 'Liquidity IQ™',
  T5: 'BFO IP Guardian™',
  T6: 'BFO AlphaRadar™',
  T7: 'BFO Due Diligence AI™',
  T8: 'BFO Annuity Intelligence™',
  T9: 'BFO Longevity Advantage AI™'
} as const;

export const OWNER_INFO = {
  inventor: 'Antonio Pedro Gomes (aka Tony Gomes)',
  address: '8858 Fisherman\'s Bay Drive, Sarasota, FL 34231',
  email: 'tony@awmfl.com',
  phone: '+1-941-539-8751',
  entity_type: 'micro-entity'
} as const;

export const BRAND_COLORS = {
  black: '#000000',
  gold: '#C7A449',
  white: '#FFFFFF',
  emerald_finance: '#046B4D',
  red_legal: '#A6192E',
  dark_navy_health: '#0A152E',
  royal_sports: '#1A44D1'
} as const;

export const CN_TRANSLITERATIONS = {
  'BFO': '必富欧',
  'EpochVault': '艾峰库', 
  'SWAG Roadmap': '斯威格路线',
  'Liquidity IQ': '流智衡',
  'Compliance IQ': '守智衡',
  'Longevity Advantage AI': '长智优'
} as const;