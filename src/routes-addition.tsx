
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

// These routes should be added to your existing routes.tsx file
const additionalRoutes = [
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
    path: '/attorney-dashboard',
    element: <AttorneyDashboard />
  },
  {
    path: '/comprehensive-qa-test',
    element: <ComprehensiveQATest />
  }
];

export default additionalRoutes;
