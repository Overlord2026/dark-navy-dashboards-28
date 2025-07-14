import React from "react";
import { Navigate } from "react-router-dom";
import Transfers from "@/pages/Transfers";

const WealthTransfers = () => {
  // Reuse existing Transfers component
  return <Transfers />;
};

export default WealthTransfers;