// Lazy-loaded route components
import { lazy } from 'react';

// Brand pages
export const StartBrandPage = lazy(() => import('./pages/start/StartBrandPage'));
export const BrandHomePage = lazy(() => import('./pages/brand/BrandHomePage'));
export const SupervisorHomePage = lazy(() => import('./pages/supervisor/SupervisorHomePage'));

// Pro leads pages - wrapped to add persona prop
export const ProLeadsAdvisor = lazy(() => import('./pages/pro/ProLeadsPage').then(m => ({ 
  default: () => <m.ProLeadsPage persona="advisor" /> 
})));
export const ProLeadsCPA = lazy(() => import('./pages/pro/ProLeadsPage').then(m => ({ 
  default: () => <m.ProLeadsPage persona="cpa" /> 
})));
export const ProLeadsAttorney = lazy(() => import('./pages/pro/ProLeadsPage').then(m => ({ 
  default: () => <m.ProLeadsPage persona="attorney" /> 
})));
export const ProLeadsInsurance = lazy(() => import('./pages/pro/ProLeadsPage').then(m => ({ 
  default: () => <m.ProLeadsPage persona="insurance" /> 
})));
export const ProLeadsHealthcare = lazy(() => import('./pages/pro/ProLeadsPage').then(m => ({ 
  default: () => <m.ProLeadsPage persona="healthcare" /> 
})));
export const ProLeadsRealtor = lazy(() => import('./pages/pro/ProLeadsPage').then(m => ({ 
  default: () => <m.ProLeadsPage persona="realtor" /> 
})));

// Pro dashboard pages - wrapped to add persona prop
export const ProDashboardCPA = lazy(() => import('./pages/pro/ProDashboard').then(m => ({ 
  default: () => <m.ProDashboard persona="cpa" /> 
})));
export const ProDashboardAttorney = lazy(() => import('./pages/pro/ProDashboard').then(m => ({ 
  default: () => <m.ProDashboard persona="attorney" /> 
})));
export const ProDashboardInsurance = lazy(() => import('./pages/pro/ProDashboard').then(m => ({ 
  default: () => <m.ProDashboard persona="insurance" /> 
})));
export const ProDashboardHealthcare = lazy(() => import('./pages/pro/ProDashboard').then(m => ({ 
  default: () => <m.ProDashboard persona="healthcare" /> 
})));
export const ProDashboardRealtor = lazy(() => import('./pages/pro/ProDashboard').then(m => ({ 
  default: () => <m.ProDashboard persona="realtor" /> 
})));

// Pros pages
export const Accountants = lazy(() => import('./pages/pros/Accountants'));
export const AccountantsAccess = lazy(() => import('./pages/pros/AccountantsAccess'));
export const Attorneys = lazy(() => import('./pages/pros/Attorneys'));
export const AttorneysAccess = lazy(() => import('./pages/pros/AttorneysAccess'));

// Insurance pages
export const InsuranceHomePage = lazy(() => import('./pages/insurance/InsuranceHomePage').then(m => ({ default: m.InsuranceHomePage })));
export const InsuranceMeetingsPage = lazy(() => import('./pages/insurance/InsuranceMeetingsPage').then(m => ({ default: m.InsuranceMeetingsPage })));
export const InsurancePipelinePage = lazy(() => import('./pages/insurance/InsurancePipelinePage').then(m => ({ default: m.InsurancePipelinePage })));
export const InsuranceProofPage = lazy(() => import('./pages/insurance/InsuranceProofPage').then(m => ({ default: m.InsuranceProofPage })));

// Advisor pages
export const AdvisorsLayout = lazy(() => import('./layouts/AdvisorsLayout').then(m => ({ default: m.AdvisorsLayout })));
export const AdvisorHomePage = lazy(() => import('./pages/advisors/AdvisorHomePage').then(m => ({ default: m.AdvisorHomePage })));
export const AdvisorLeadsPage = lazy(() => import('./pages/advisors/AdvisorLeadsPage').then(m => ({ default: m.AdvisorLeadsPage })));
export const AdvisorMeetingsPage = lazy(() => import('./pages/advisors/AdvisorMeetingsPage').then(m => ({ default: m.AdvisorMeetingsPage })));
export const AdvisorCampaignsPage = lazy(() => import('./pages/advisors/AdvisorCampaignsPage').then(m => ({ default: m.AdvisorCampaignsPage })));
export const AdvisorPipelinePage = lazy(() => import('./pages/advisors/AdvisorPipelinePage').then(m => ({ default: m.AdvisorPipelinePage })));
export const AdvisorToolsPage = lazy(() => import('./pages/advisors/AdvisorToolsPage').then(m => ({ default: m.AdvisorToolsPage })));
export const AdvisorProofPage = lazy(() => import('./pages/advisors/AdvisorProofPage').then(m => ({ default: m.AdvisorProofPage })));

// Attorney pages
export const AttorneyHomePage = lazy(() => import('./pages/attorneys/AttorneyHomePage'));
export const AttorneyLeadsPage = lazy(() => import('./pages/attorneys/AttorneyLeadsPage'));
export const AttorneyMeetingsPage = lazy(() => import('./pages/attorneys/AttorneyMeetingsPage'));
export const AttorneyMattersPage = lazy(() => import('./pages/attorneys/AttorneyMattersPage'));
export const AttorneyProofPage = lazy(() => import('./pages/attorneys/AttorneyProofPage'));

// Insurance Life pages
export const InsuranceLifeHomePage = lazy(() => import('./pages/insurance/life/InsuranceLifeHomePage'));
export const InsuranceLifeLeadsPage = lazy(() => import('./pages/insurance/life/InsuranceLifeLeadsPage'));
export const InsuranceLifeToolsPage = lazy(() => import('./pages/insurance/life/InsuranceLifeToolsPage'));
export const InsuranceLifeProofPage = lazy(() => import('./pages/insurance/life/InsuranceLifeProofPage'));

// Medicare pages
export const MedicareHomePage = lazy(() => import('./pages/medicare/MedicareHomePage'));
export const MedicareLeadsPage = lazy(() => import('./pages/medicare/MedicareLeadsPage'));
export const MedicareSOAPage = lazy(() => import('./pages/medicare/MedicareSOAPage'));
export const MedicareProofPage = lazy(() => import('./pages/medicare/MedicareProofPage'));

// Healthcare pages
export const HealthcareHomePage = lazy(() => import('./pages/health/HealthcareHomePage'));
export const HealthcareLeadsPage = lazy(() => import('./pages/health/HealthcareLeadsPage'));
export const HealthcareToolsPage = lazy(() => import('./pages/health/HealthcareToolsPage'));
export const HealthcareProofPage = lazy(() => import('./pages/health/HealthcareProofPage'));

// Realtor pages
export const RealtorHomePage = lazy(() => import('./pages/realtor/RealtorHomePage'));
export const RealtorLeadsPage = lazy(() => import('./pages/realtor/RealtorLeadsPage'));
export const RealtorToolsPage = lazy(() => import('./pages/realtor/RealtorToolsPage'));
export const RealtorProofPage = lazy(() => import('./pages/realtor/RealtorProofPage'));

// Solutions page
export const SolutionsPage = lazy(() => import('@/pages/solutions/SolutionsPage'));

// Invite pages
export const InviteAdvisor = lazy(() => import('./pages/invite/InviteAdvisor'));
export const InviteRedemption = lazy(() => import('./pages/invite/InviteRedemption'));
