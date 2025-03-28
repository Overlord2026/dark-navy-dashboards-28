
import React from 'react';
import './App.css';
import Dashboard from "./pages/Index";
import CustomerProfile from "./pages/CustomerProfile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<CustomerProfile />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
