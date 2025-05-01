
import { Route } from "react-router-dom";
import Integration from "@/pages/Integration";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { FeedbackTab } from "@/components/integration/FeedbackTab";

export const integrationRoutes = [
  <Route 
    key="integration" 
    path="/integration" 
    element={<Integration />}
  >
    <Route 
      key="integration-connected" 
      index
      element={<ConnectedProjectsTab />} 
    />
    <Route 
      key="integration-architecture" 
      path="architecture" 
      element={<ArchitectureTab />} 
    />
    <Route 
      key="integration-api" 
      path="api" 
      element={<ApiIntegrationsTab />} 
    />
    <Route 
      key="integration-plugins" 
      path="plugins" 
      element={<PluginsTab />} 
    />
    <Route
      key="integration-feedback"
      path="feedback"
      element={<FeedbackTab />}
    />
  </Route>
];

export default integrationRoutes;
