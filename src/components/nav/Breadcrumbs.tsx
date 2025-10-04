import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const trail = [
    { to: "/", label: "Home" },
    ...parts.map((_, i) => ({
      to: "/" + parts.slice(0, i + 1).join("/"),
      label: parts[i].replace(/-/g, " ")
    }))
  ];
  
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-white/70">
      {trail.map((p, i) => (
        <span key={p.to}>
          {i > 0 && <span className="mx-2 text-white/30">/</span>}
          <Link to={p.to} className="hover:text-bfo-gold capitalize">{p.label}</Link>
        </span>
      ))}
    </nav>
  );
}
