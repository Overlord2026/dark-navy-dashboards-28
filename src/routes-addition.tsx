
import { 
  HomePage, 
  AccountsPage, 
  EducationPage, 
  FamilyWealthPage, 
  CollaborationPage, 
  SettingsPage 
} from '@/pages/TabPages';
import { AnnuitiesPage } from '@/pages/AnnuitiesPage';
import { EducationCenter } from '@/components/annuities/EducationCenter';
import { ProductComparison } from '@/components/annuities/ProductComparison';
import { ContractAnalyzer } from '@/components/annuities/ContractAnalyzer';
import GoalsPage from '@/pages/GoalsPage';
import CreateGoalPage from '@/pages/CreateGoalPage';
import GoalFormPage from '@/pages/GoalFormPage';
import GoalDetailPage from '@/pages/GoalDetailPage';
import TaxCenter from '@/pages/TaxCenter';
import AdvisorROIDashboard from '@/pages/AdvisorROIDashboard';
import { ComprehensiveQATest } from '@/pages/ComprehensiveQATest';
import { SystemValidationPage } from '@/pages/SystemValidationPage';
import { AttorneyOnboarding } from '@/pages/AttorneyOnboarding';
import MobileQATestPage from '@/pages/MobileQATestPage';
import MobileMore from '@/pages/mobile/MobileMore';
import MobileMobileQATest from '@/pages/mobile/MobileMobileQATest';
import MasterLanding from '@/pages/MasterLanding';
import ValueCalculator from '@/pages/ValueCalculator';
import AdminHome from '@/pages/admin/AdminHome';
import { WithRole } from '@/components/auth/withRole';

// These routes should be added to your existing routes.tsx file
const additionalRoutes = [
  // Public Routes
  {
    path: '/',
    element: <MasterLanding />
  },
  {
    path: '/value-calculator',
    element: <ValueCalculator />
  },
  {
    path: '/marketplace',
    element: <div className="p-8 text-center"><h1 className="text-3xl font-bold">Marketplace Coming Soon</h1></div>
  },
  {
    path: '/athletes',
    element: <div className="p-8 text-center"><h1 className="text-3xl font-bold">Athletes/NIL Education Coming Soon</h1></div>
  },
  {
    path: '/estate-planning',
    element: <div className="p-8 text-center"><h1 className="text-3xl font-bold">Estate Planning Coming Soon</h1></div>
  },
  {
    path: '/magic-link/:id?',
    element: <div className="p-8 text-center"><h1 className="text-3xl font-bold">Magic Link Entry Coming Soon</h1></div>
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <WithRole requiredRoles={['admin', 'cfo', 'marketing', 'compliance']}>
        <AdminHome />
      </WithRole>
    )
  },
  {
    path: '/admin/cfo',
    element: (
      <WithRole requiredRoles={['admin', 'cfo']}>
        <div className="p-8 text-center"><h1 className="text-3xl font-bold">CFO Command Center Coming Soon</h1></div>
      </WithRole>
    )
  },
  {
    path: '/admin/marketing',
    element: (
      <WithRole requiredRoles={['admin', 'marketing', 'cfo']}>
        <div className="p-8 text-center"><h1 className="text-3xl font-bold">Marketing Hub Coming Soon</h1></div>
      </WithRole>
    )
  },
  {
    path: '/admin/security',
    element: (
      <WithRole requiredRoles={['admin', 'compliance', 'cfo']}>
        <div className="p-8 text-center"><h1 className="text-3xl font-bold">Security & Compliance Coming Soon</h1></div>
      </WithRole>
    )
  },
  {
    path: '/admin/vetting',
    element: (
      <WithRole requiredRoles={['admin', 'compliance']}>
        <div className="p-8 text-center"><h1 className="text-3xl font-bold">Professional Vetting Coming Soon</h1></div>
      </WithRole>
    )
  },
  {
    path: '/admin/operations',
    element: (
      <WithRole requiredRoles={['admin', 'cfo']}>
        <div className="p-8 text-center"><h1 className="text-3xl font-bold">Operations Coming Soon</h1></div>
      </WithRole>
    )
  },
  // Existing Routes
  {
    path: '/home-tab',
    element: <HomePage />
  },
  {
    path: '/goals',
    element: <GoalsPage />
  },
  {
    path: '/goals/create',
    element: <CreateGoalPage />
  },
  {
    path: '/goals/create/:category',
    element: <GoalFormPage />
  },
  {
    path: '/goals/:id',
    element: <GoalDetailPage />
  },
  {
    path: '/accounts-tab',
    element: <AccountsPage />
  },
  {
    path: '/education-tab',
    element: <EducationPage />
  },
  {
    path: '/family-wealth-tab',
    element: <FamilyWealthPage />
  },
  {
    path: '/collaboration-tab',
    element: <CollaborationPage />
  },
  {
    path: '/settings-tab',
    element: <SettingsPage />
  },
  {
    path: '/annuities',
    element: <AnnuitiesPage />
  },
  {
    path: '/annuities/learn',
    element: <EducationCenter />
  },
  {
    path: '/annuities/compare',
    element: <ProductComparison />
  },
  {
    path: '/annuities/analyze',
    element: <ContractAnalyzer />
  },
  {
    path: '/tax-center',
    element: <TaxCenter />
  },
  {
    path: '/advisor-roi',
    element: <AdvisorROIDashboard />
  },
  {
    path: '/attorney-onboarding',
    element: <AttorneyOnboarding />
  },
  {
    path: '/comprehensive-qa-test',
    element: <ComprehensiveQATest />
  },
  {
    path: '/system-validation',
    element: <SystemValidationPage />
  },
  {
    path: '/mobile-qa-test',
    element: <MobileQATestPage />
  },
  {
    path: '/more',
    element: <MobileMore />
  },
  {
    path: '/mobile/qa-test',
    element: <MobileMobileQATest />
  }
];

export default additionalRoutes;
