
import { 
  HomePage, 
  AccountsPage, 
  EducationPage, 
  FamilyWealthPage, 
  CollaborationPage, 
  SettingsPage 
} from '@/pages/TabPages';

// These routes should be added to your existing routes.tsx file
const additionalRoutes = [
  {
    path: '/home-tab',
    element: <HomePage />
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
