import React from "react";
import { IS_PROD } from "@/config/flags";
/* React Router v6 guard */
import { Navigate } from "react-router-dom";

export default function NonProdOnly({ children }: { children: JSX.Element }) {
  if (IS_PROD) return <Navigate to="/" replace />;
  return children;
}