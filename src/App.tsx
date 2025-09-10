import * as React from "react";
import { Routes, Route } from "react-router-dom";
import HealthCheck from "@/pages/HealthCheck";
import ReactHealth from "@/routes/debug/ReactHealth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HealthCheck />} />
      <Route path="/debug/react" element={<ReactHealth />} />
    </Routes>
  );
}
