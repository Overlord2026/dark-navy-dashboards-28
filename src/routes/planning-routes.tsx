
import TaxPlanning from "@/pages/TaxPlanning";
import EstatePlanning from "@/pages/EstatePlanning";
import Insurance from "@/pages/Insurance";
import Healthcare from "@/pages/Healthcare";
import SocialSecurity from "@/pages/SocialSecurity";

export const planningRoutes = [
  {
    path: "/tax-planning",
    element: <TaxPlanning />,
  },
  {
    path: "/estate-planning",
    element: <EstatePlanning />,
  },
  {
    path: "/insurance",
    element: <Insurance />,
  },
  {
    path: "/healthcare",
    element: <Healthcare />,
  },
  {
    path: "/social-security",
    element: <SocialSecurity />,
  }
];
