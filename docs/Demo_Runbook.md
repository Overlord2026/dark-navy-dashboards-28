# Family Office Marketplace - Investor Demo Runbook

## Overview
This runbook provides a step-by-step script for demonstrating the Family Office Marketplace platform to investors, showcasing key features, compliance capabilities, and business value.

## Pre-Demo Setup
- Ensure DEMO_MODE=true is set
- Verify all fixtures are loaded
- Confirm zero 404 routes
- Check that receipt verification system is operational

## Demo Script

### 1. Platform Readiness Check (2 minutes)
**Location:** `/admin/hq`
**Action:** Run Readiness Check
**Expected Result:** GREEN status with all systems operational

**Script:**
"Let's start by verifying our platform readiness. This dashboard shows real-time system health across all core services."

*Click "Run Readiness Check"*

**Key Points to Highlight:**
- Zero 404 routes detected
- 100% brand compliance
- Receipt pipeline verified
- Demo fixtures loaded

### 2. Family Experience - Retirement Planning (3 minutes)
**Location:** `/families/retirees`
**Action:** Run 60-second demo
**Expected Result:** Toast notification + content-free receipt

**Script:**
"Now let's see the family experience. We'll simulate a retiree creating their bucket list and roadmap."

*Navigate to Families → Retirees → Click "60-sec Demo"*

**Key Points to Highlight:**
- Intuitive user interface
- Instant feedback and guidance
- Cryptographic receipt generation
- Content-free compliance logging

**Expected Receipt:**
- Type: Decision-RDS
- Action: retirement_roadmap_planning
- Includes: inputs_hash, policy_hash, model_id, anchor_ref

### 3. Professional Experience - 401k Fee Analysis (4 minutes)
**Location:** `/pros/advisors`
**Action:** 401k fee comparison → show receipt → verify anchor

**Script:**
"Here's how financial advisors use our platform. Let's run a 401k fee comparison analysis."

*Navigate to Service Pros → Advisors → Click "401k Fee Compare"*

**Key Points to Highlight:**
- Professional-grade analytics
- Instant plan benchmarking
- Compliance-ready documentation
- Cryptographic verification

**Expected Behavior:**
- Plan benchmark receipt generated
- Anchor chip displays GREEN after verification
- Merkle inclusion proof validates locally
- Full audit trail maintained

### 4. IP Ledger and Compliance (2 minutes)
**Location:** `/admin/hq/ip`
**Action:** Filter IP filings → Export CSV

**Script:**
"Our intellectual property ledger tracks all platform innovations and filings."

*Navigate to Admin → HQ → IP Ledger*
*Apply filters and export data*

**Key Points to Highlight:**
- Real-time IP portfolio tracking
- Comprehensive filing history
- Export capabilities for compliance
- Searchable artifact database

### 5. Publication and Release Management (2 minutes)
**Location:** `/admin/publish`
**Action:** Run Publish Batch → Show launch receipt

**Script:**
"Finally, let's see our automated release and compliance system."

*Navigate to Admin → Publish → Click "Run Publish Batch"*

**Key Points to Highlight:**
- Automated compliance checks
- Launch receipt generation
- Rules export functionality
- Content-free release notes

## Technical Validation Points

### Receipt Verification
- All receipts include proper cryptographic hashes
- Merkle inclusion proofs validate correctly
- Anchor chips show GREEN for verified receipts
- Local verification gates high-impact actions

### Brand Compliance
- Headers use bfo-black background
- Gold borders on all .bfo-card elements
- No translucency in brand elements
- Consistent color scheme throughout

### Performance Metrics
- LCP < 1.5s on all routes
- FID < 50ms average
- CLS < 0.1 across platform
- TTFB < 400ms typical

## Demo Timing
- **Total Duration:** 13 minutes
- **Setup:** 1 minute
- **Core Demo:** 11 minutes  
- **Q&A Buffer:** 2 minutes

## Key Differentiators to Emphasize
1. **Cryptographic Compliance:** Every action generates verifiable receipts
2. **Multi-Persona Platform:** Serves families, advisors, and service professionals
3. **Real-time Verification:** Instant compliance checking and validation
4. **IP Protection:** Comprehensive intellectual property management
5. **Professional Grade:** Enterprise-level security and audit capabilities

## Fallback Scenarios
- If demo environment is unavailable, reference static screenshots
- If receipts don't verify, explain the cryptographic validation process
- If performance is slow, highlight optimization features

## Post-Demo Artifacts
All demo artifacts are available in `/out/demo/InvestorDemo_Pack.zip`:
- Route audit showing zero 404s
- Component inventory with brand compliance
- Web vitals performance data
- Full demo session HAR file
- Receipt bundle with cryptographic proofs
- Technical documentation

## Success Metrics
- Green readiness status achieved
- All demo receipts verified successfully
- Zero technical issues during presentation
- Complete audit trail generated
- All artifacts exported successfully

---

*This runbook ensures a consistent, professional demonstration that highlights the platform's technical sophistication and business value.*