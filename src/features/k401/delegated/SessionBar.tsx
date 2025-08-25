import React from 'react';

export default function SessionBar({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = React.useState<number>(() => 
    Math.max(0, Date.parse(endsAt) - Date.now())
  );
  
  React.useEffect(() => { 
    const t = setInterval(() => 
      setLeft(Math.max(0, Date.parse(endsAt) - Date.now())), 
      1000
    ); 
    return () => clearInterval(t); 
  }, [endsAt]);
  
  const mins = Math.floor(left / 60000);
  const secs = Math.floor((left % 60000) / 1000);
  
  return left > 0 ? (
    <div className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium shadow-lg">
      Trade window: {mins}:{String(secs).padStart(2, '0')}
    </div>
  ) : null;
}