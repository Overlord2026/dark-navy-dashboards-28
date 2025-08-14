import React from "react";

type Group = "family" | "pro";

export function getPersonaGroup(): Group {
  if (typeof window === "undefined") return "family";
  return (localStorage.getItem("persona_group") as Group) || "family";
}

export default function AudienceGuard({
  audience,
  children,
}: { 
  audience: Group | "both"; 
  children: React.ReactNode 
}) {
  const active = getPersonaGroup();
  if (audience === "both" || audience === active) return <>{children}</>;
  return null;
}