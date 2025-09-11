import { NavLink, useParams } from "react-router-dom";
import { TOOL_NAV, PRO_RECOMMENDED_ORDER, TOOL_COPY } from "@/config/toolNav";

export default function ToolsLauncher() {
  const { role = "" } = useParams();

  // role-ordered tools; fall back to default order
  const order = (role && PRO_RECOMMENDED_ORDER[role]) || TOOL_NAV.map(t => t.key);
  const map   = new Map(TOOL_NAV.map(t => [t.key, t]));
  const items = order.map(k => map.get(k)).filter(Boolean) as typeof TOOL_NAV;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Choose a tool</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-2">Pick where you want to work. You can also use the left menu at any time.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(it => (
          <li key={it.key}>
            <NavLink
              to={it.to}
              className="group block rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-border/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex items-start gap-3 p-6">
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {it.icon && <it.icon className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-medium text-foreground group-hover:text-foreground">{it.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{TOOL_COPY[it.key] ?? "Open this tool."}</div>
                </div>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}