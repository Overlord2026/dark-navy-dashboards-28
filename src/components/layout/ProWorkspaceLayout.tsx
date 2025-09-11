import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { TOOL_NAV, PRO_RECOMMENDED_ORDER, PRO_QUICK_ACTIONS } from "@/config/toolNav";

function useSortedNav(role?: string) {
  return useMemo(() => {
    const order = (role && PRO_RECOMMENDED_ORDER[role]) || TOOL_NAV.map(t => t.key);
    const map = new Map(TOOL_NAV.map(t => [t.key, t]));
    return order.map(k => map.get(k)).filter(Boolean) as typeof TOOL_NAV;
  }, [role]);
}

export default function ProWorkspaceLayout() {
  const { role = "" } = useParams();
  const nav = useNavigate();
  const items = useSortedNav(role);
  const quick = PRO_QUICK_ACTIONS[role] || [];

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen border-r border-border bg-card/50 backdrop-blur">
        <div className="px-4 py-4 text-sm font-semibold tracking-tight text-muted-foreground">Service Professionals</div>
        <nav className="px-2 pb-4 space-y-1">
          {items.map(it => (
            <NavLink
              key={it.key}
              to={it.to}
              className={({isActive}) =>
                "group flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors " +
                (isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")
              }
            >
              {it.icon && (
                <it.icon className="h-4 w-4" />
              )}
              {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-sm font-medium">
                {role ? role.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) : "Professionals"}
              </span>
            </div>
            <button
              onClick={() => nav("/pros")}
              className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Switch persona"
              title="Switch persona"
            >
              Switch persona
            </button>
          </div>

          {/* Quick actions toolbar */}
          {quick.length > 0 && (
            <div className="mx-auto max-w-7xl px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {quick.map(q => (
                  <NavLink
                    key={q.to}
                    to={q.to}
                    className="inline-flex items-center rounded-md bg-primary/15 text-primary hover:bg-primary/25 px-3 py-1.5 text-sm transition-colors"
                  >
                    {q.label} →
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tools content */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
