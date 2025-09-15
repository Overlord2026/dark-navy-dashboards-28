# Advisor Platform UI Import Audit

**Branch:** docs/advisor-audit  
**Date:** 2025-09-15  
**Scope:** Scan src/** for Advisor Platform UI components and features

## Feature Audit Table

| Feature | Expected Routes | Found? | Main File(s) | Notes |
|---------|----------------|--------|--------------|-------|
| Dashboard | `/advisors/home`, `/advisor-dashboard` | ✅ FOUND | `src/pages/advisors/AdvisorsHome.tsx`, `src/pages/personas/AdvisorDashboardWithSideNav.tsx` | Comprehensive dashboard with KPIs, quick actions, recent activity |
| Prospects | `/advisors/leads`, `/advisors/pipeline` | ✅ FOUND | `src/pages/advisors/LeadsPage.tsx`, `src/pages/advisors/PipelinePage.tsx` | Lead management, pipeline tracking, conversion metrics |
| Recordings | `/advisors/recordings` | ❌ MISSING | N/A | Only compliance mentions found, no dedicated recording UI |
| Questionnaires | `/advisors/questionnaires` | ⚠️ PARTIAL | `src/components/advisor/AdvisorQuestionnaire.tsx` | Basic questionnaire for advisor matching, no builder/management |
| Templates | `/advisors/templates` | ⚠️ PARTIAL | Various email template components | Scattered email templates, no unified template library |
| ROI Tracker | `/advisors/roi`, `/advisors/analytics` | ✅ FOUND | `src/components/advisor/ReportsAnalytics.tsx`, campaign components | ROI tracking embedded in campaigns and reports |
| Calendar | `/advisors/meetings`, `/advisors/calendar` | ✅ FOUND | `src/pages/advisors/MeetingsPage.tsx`, `src/components/advisor/AdvisorCalendar.tsx` | Meeting scheduling and calendar management |

## Summary

**Found Features:** 5/7 (71%)  
**Missing Features:** 1/7 (14%)  
**Partial Features:** 2/7 (29%)  

### Key Findings

1. **Strong Foundation**: Core advisor workflows (dashboard, leads, meetings) are well-implemented
2. **Modern Architecture**: Uses integrated workflows rather than standalone feature modules
3. **Missing Gaps**: Dedicated recording management and comprehensive questionnaire builder
4. **Template Fragmentation**: Email templates exist but lack centralized management

### Architectural Notes

The Dark Navy repo follows a persona-based architecture with:
- Unified navigation via `AdvisorsLayout`
- Role-based access control through persona guards
- Integration with family/client workflows
- Modern React patterns with TypeScript

### Recommendations

1. **Recordings**: Implement dedicated recording management UI
2. **Questionnaires**: Build comprehensive questionnaire builder/manager
3. **Templates**: Create unified template library with management interface
4. **Integration**: Leverage existing advisor-to-family invitation system