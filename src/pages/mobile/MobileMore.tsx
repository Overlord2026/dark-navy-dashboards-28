
import React from "react";
import { useTheme } from "@/context/ThemeContext";

// Create a basic MobileMore component to fix the errors
const MobileMore = () => {
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };
  
  return (
    <div>
      <h1>More Settings</h1>
      <div>
        <h2>Theme</h2>
        <button onClick={() => handleThemeChange('light')}>
          Light Mode {theme === 'light' && '(Current)'}
        </button>
        <button onClick={() => handleThemeChange('dark')}>
          Dark Mode {theme === 'dark' && '(Current)'}
        </button>
      </div>
    </div>
  );
};

export default MobileMore;
