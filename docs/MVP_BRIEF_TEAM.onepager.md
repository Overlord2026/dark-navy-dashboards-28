# My.BFOCFO MVP Brief — One-Pager

**Date:** 2025-09-14 | **Contact:** (owner)

## Vision
Enabling advisors to invite families into shared financial workspace with unified tool access, audit trails, and secure document management through persona-scoped workflows.

## What Exists Now
• **31 routes** across landing, auth, onboarding, and professional/family hubs
• **8 core financial tools** (Goals ✅, Transactions ✅, Cash Flow ✅, Reports 🚧, Accounts ❌, Budget ✅, Investments ✅, Advice ✅)
• **6 personas** (advisors, accountants, attorneys, insurance professionals, families with segments)
• **Supabase foundation** with 75+ tables, RLS policies, Edge Functions, audit logging, receipt system
• **Working auth flows** (OAuth, magic links, persona-based onboarding)

## MVP Scope
**Core Flow:** Advisor → Invite Families → Shared Financial Tools

Unified navigation experience replacing current fragmented systems (SecondaryNav, PersonaSideNav, MegaMenu consuming 216px vertical space). Persona-scoped access control ensuring advisors and families see appropriate tools with proper context.

## Advisors→Families Outcome
• **Advisor dashboard** with client management, prospect invitations, meeting scheduling
• **Magic link invitations** enabling seamless family onboarding via `/invite/:token`
• **Shared financial workspace** where advisors can collaborate with families on Goals, Cash Flow, Transactions
• **Audit trail compliance** through receipt system and detailed logging for professional requirements
• **Document vault integration** for secure family financial document sharing

## P0 Plan
• **Implement Accounts Tool** - Replace stub with functional account management (`src/App.tsx:401,483`)
• **Complete Reports Tool** - Build report generation and display (`src/pages/ReportsPage.tsx`)
• **Fix Navigation Fragmentation** - Unified sidebar, remove SecondaryNav (`src/App.tsx:372-373`)
• **Resolve Route Conflicts** - Single `/reports` route with persona scoping (`src/App.tsx:396,482`)
• **Service Worker Safety** - Environment check before registration (`src/main.tsx:32`)

## KPIs
• **#invites sent** - Advisor → Family invitation volume
• **#families onboarded** - Successful account creation rate  
• **DAU on /reports** - Daily active users accessing reporting
• **Linking completion rate** - End-to-end advisor-family connection success

## Timeline (2 Sprints)
**Sprint 1:** Accounts Tool + Reports Tool completion
**Sprint 2:** Navigation unification + route conflict resolution