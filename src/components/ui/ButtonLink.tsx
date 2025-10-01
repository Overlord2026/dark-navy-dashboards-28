import { Link } from "react-router-dom";

export function ButtonPrimary({ to, children }: { to:string; children:React.ReactNode }) {
  return <Link to={to} className="inline-flex items-center rounded-lg bg-bfo-gold text-bfo-black px-5 py-3 text-sm font-semibold hover:bg-bfo-gold/90 focus:outline-none focus:ring-2 focus:ring-bfo-gold/40">{children}</Link>;
}
export function ButtonSecondary({ to, children }: { to:string; children:React.ReactNode }) {
  return <Link to={to} className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm text-bfo-ivory hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-bfo-gold/40">{children}</Link>;
}
