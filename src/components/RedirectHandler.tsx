import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RedirectHandler() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    // Example logic: read ?redirect=... and navigate
    const p = new URLSearchParams(loc.search);
    const next = p.get('redirect');
    if (next) nav(next, { replace: true });
  }, [loc.search, nav]);

  return null; // headless router helper
}

export default RedirectHandler;