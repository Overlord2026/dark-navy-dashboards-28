import React from 'react';
import './App.css';
import Dashboard from "./pages/Index";
import CustomerProfile from "./pages/CustomerProfile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<CustomerProfile />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
