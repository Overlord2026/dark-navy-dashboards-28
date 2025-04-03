
import React from "react";
import { useFeatureFlagContext } from "@/context/FeatureFlagContext";

/**
 * NavigationHealthIndicator - A developer-only component that displays real-time diagnostic results
 */
export function NavigationHealthIndicator() {
  const { isEnabled } = useFeatureFlagContext();
  
  // Only render if diagnostics are enabled
  if (!isEnabled('ENABLE_DIAGNOSTICS')) {
    return null;
  }

  // This component has been disabled as per user request,
  // but could be re-enabled later through feature flags
  return null;
}
