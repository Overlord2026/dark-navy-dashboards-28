import React from 'react';
import { ToolGate } from '@/components/tools/ToolGate';

interface WithToolGateProps {
  toolKey: string;
  fallbackRoute?: string;
}

export function withToolGate<P extends object>(
  Component: React.ComponentType<P>,
  toolKey: string,
  fallbackRoute?: string
) {
  const WrappedComponent = (props: P) => {
    return (
      <ToolGate toolKey={toolKey} fallbackRoute={fallbackRoute}>
        <Component {...props} />
      </ToolGate>
    );
  };

  WrappedComponent.displayName = `withToolGate(${Component.displayName || Component.name})`;
  return WrappedComponent;
}