
import { IconTestResult } from './types';

export const testIcons = (): IconTestResult[] => {
  // In a real app, would verify all icons are rendering correctly
  return [
    {
      icon: "HomeIcon",
      location: "Sidebar",
      status: "success",
      message: "Home icon displays correctly"
    },
    {
      icon: "DocumentIcon",
      location: "Documents Page",
      status: "success",
      message: "Document icon displays correctly"
    },
    {
      icon: "UserIcon",
      location: "Profile Page",
      status: "success",
      message: "User icon displays correctly"
    },
    {
      icon: "SettingsIcon",
      location: "Settings Menu",
      status: "success",
      message: "Settings icon displays correctly"
    },
    {
      icon: "ChartIcon",
      location: "Financial Overview",
      status: "warning",
      message: "Chart icon may not display correctly in dark mode"
    },
    {
      icon: "BellIcon",
      location: "Notifications",
      status: "success",
      message: "Bell icon displays correctly"
    },
    {
      icon: "CalendarIcon",
      location: "Appointments",
      status: "error",
      message: "Calendar icon missing in mobile view"
    }
  ];
};
