
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDiagnostics from "../pages/AdminDiagnostics";
import NotFound from "../pages/NotFound";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDiagnostics />} />
      <Route path="/navigation-diagnostics" element={<AdminDiagnostics />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
