import * as React from "react";

export default function ReactHealth() {
  const [ok] = React.useState(true);
  const info = {
    reactVersion: React.version,
    domVersion: (globalThis as any)?.ReactDOM?.version || "unknown",
    elementSymbol: (Symbol.for && Symbol.for("react.element")) ? "ok" : "missing",
    duplicates: false, // set true if you detect multiple copies during analysis
    useState: typeof React.useState,
    createContext: typeof React.createContext,
    useContext: typeof React.useContext,
  };
  
  return (
    <div style={{padding: 16, fontFamily: 'monospace'}}>
      <h2>React Health</h2>
      <pre>{JSON.stringify(info, null, 2)}</pre>
      <div style={{marginTop: 16}}>
        <h3>React Instance Check</h3>
        <p>useState available: {typeof React.useState === 'function' ? '✅' : '❌'}</p>
        <p>createContext available: {typeof React.createContext === 'function' ? '✅' : '❌'}</p>
        <p>useContext available: {typeof React.useContext === 'function' ? '✅' : '❌'}</p>
        <p>React version: {React.version || 'unknown'}</p>
      </div>
    </div>
  );
}