
import { IconTestResult } from '@/types/diagnostics';

export const testIcons = (): IconTestResult[] => {
  // Sample icon tests for different parts of the application
  return [
    {
      id: "home-icon-test",
      iconName: "HomeIcon",
      iconType: "lucide",
      status: "success",
      message: "Icon renders correctly in all themes",
      renderTime: 5,
      timestamp: Date.now()
    },
    {
      id: "settings-icon-test",
      iconName: "SettingsIcon",
      iconType: "lucide",
      status: "success",
      message: "Icon renders correctly in all themes",
      renderTime: 6,
      timestamp: Date.now()
    },
    {
      id: "notification-icon-test",
      iconName: "BellIcon",
      iconType: "lucide",
      status: "success",
      message: "Icon renders correctly in all themes",
      renderTime: 4,
      timestamp: Date.now()
    },
    {
      id: "search-icon-test",
      iconName: "SearchIcon",
      iconType: "lucide",
      status: "success",
      message: "Icon renders correctly in all themes",
      renderTime: 5,
      timestamp: Date.now()
    },
    {
      id: "alert-icon-test",
      iconName: "AlertTriangleIcon",
      iconType: "lucide",
      status: "warning",
      message: "Icon may not be visible in high contrast mode",
      renderTime: 7,
      timestamp: Date.now()
    },
    {
      id: "user-icon-test",
      iconName: "UserIcon",
      iconType: "lucide",
      status: "success",
      message: "Icon renders correctly in all themes",
      renderTime: 5,
      timestamp: Date.now()
    },
    {
      id: "docs-icon-test",
      iconName: "FileTextIcon",
      iconType: "lucide",
      status: "error",
      message: "Icon fails to render in Safari browser",
      renderTime: 12,
      timestamp: Date.now()
    }
  ];
};
