import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const loc = useLocation();
  const items = useSortedNav(role);
  const quick = PRO_QUICK_ACTIONS[role] || [];

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen border-r border-border bg-card/50 backdrop-blur">
        <div className="px-4 py-3 text-sm font-semibold tracking-tight text-muted-foreground">Service Professionals</div>
        <nav className="px-2 pb-3 space-y-1">
          {items.map(it => (
            <NavLink
              key={it.key}
              to={it.to}
              className={({isActive}) =>
                "block rounded-md px-3 py-2 text-sm transition-colors " +
                (isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground")
              }
            >
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
            <div className="text-lg font-semibold">
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Professionals"}
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
        </div>

        {/* Persona banner */}
        {role && (
          <section className="mx-auto max-w-7xl px-4 pt-4">
            <div className="rounded-md border border-border bg-card p-4">
              <div className="text-base font-medium mb-2">Quick actions</div>
              <div className="flex flex-wrap gap-2">
                {quick.map((q) => (
                  <NavLink key={q.to} to={q.to}
                    className="inline-flex items-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-sm transition-colors">
                    {q.label} →
                  </NavLink>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Existing tools content */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
