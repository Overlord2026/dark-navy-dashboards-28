
// This is a simplified version to add only what's needed
import { Route } from "react-router-dom";
import Integration from "@/pages/Integration";

// Add this route to your existing routes array
const integrationRoute = 
  <Route 
    key="integration" 
    path="/integration" 
    element={<Integration />} 
  />;

// Export as a named export so it can be imported in your main routes file
export { integrationRoute };
