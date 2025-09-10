import React from 'react';
import toolReg from '@/config/toolRegistry.json';
import { isInstalled } from '@/lib/workspaceTools';
import InstallModal from '@/components/InstallModal';
import { useNavigate } from 'react-router-dom';

export default function ToolGate({ toolKey, children }: {
  toolKey: string,
  children: (p: { onClick: () => void }) => React.ReactNode
}) {
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);
  const item = (toolReg as any[]).find(t => t.key === toolKey);
  
  function onClick() {
    if (!item) return;
    if (item.routePriv && isInstalled(toolKey)) nav(item.routePriv);
    else if (item.routePriv) setOpen(true);
    else nav(item.routePub || `/preview/${toolKey}`);
  }
  
  return (
    <>
      {children({ onClick })}
      {open && <InstallModal toolKey={toolKey} registryItem={item} onClose={() => setOpen(false)} />}
    </>
  );
}