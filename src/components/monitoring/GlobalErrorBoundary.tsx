import React from "react";

type FallbackProps = { error?: unknown; onReset?: () => void };

function DefaultFallback({ error, onReset }: FallbackProps) {
  return (
    <div style={{ padding: 16, border: "1px solid #ddd", margin: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Something went wrong.</div>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
        {error ? String(error) : "Unknown error"}
      </pre>
      {onReset && (
        <button onClick={onReset} style={{ marginTop: 8, padding: "6px 10px", border: "1px solid #ccc" }}>
          Try again
        </button>
      )}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: unknown, info?: { componentStack?: string }) => void;
  onReset?: () => void;
};

type State = { hasError: boolean; error?: unknown };

class GlobalErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    this.props.onError?.(error, { componentStack: info?.componentStack });
    window.dispatchEvent(new CustomEvent("app-error", { detail: { error, info } }));
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    const Fallback = this.props.FallbackComponent ?? DefaultFallback;
    return this.state.hasError ? (
      <Fallback error={this.state.error} onReset={this.reset} />
    ) : (
      (this.props.children as React.ReactElement)
    );
  }
}

export default GlobalErrorBoundary;
export { GlobalErrorBoundary };