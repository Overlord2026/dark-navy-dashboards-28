
import { 
  HomePage, 
  AccountsPage, 
  EducationPage, 
  FamilyWealthPage, 
  CollaborationPage, 
  SettingsPage 
} from '@/pages/TabPages';
import GoalsPage from '@/pages/GoalsPage';
import CreateGoalPage from '@/pages/CreateGoalPage';
import GoalFormPage from '@/pages/GoalFormPage';
import GoalDetailPage from '@/pages/GoalDetailPage';

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
  }
];

export default additionalRoutes;
