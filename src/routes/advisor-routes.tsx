
import { Route } from "react-router-dom";
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import AdvisorLanding from "@/pages/AdvisorLanding";
import LoginPage from "@/pages/LoginPage";

export const advisorRoutes = [
  <Route 
    key="advisor" 
    path="/advisor" 
    element={<AdvisorLanding />} 
  />,
  <Route 
    key="advisor-dashboard" 
    path="/advisor/dashboard" 
    element={<AdvisorDashboard />} 
  />,
  <Route 
    key="advisor-login" 
    path="/advisor/login" 
    element={<LoginPage isAdvisor={true} />} 
  />
];

export default advisorRoutes;
