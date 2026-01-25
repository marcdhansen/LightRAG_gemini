import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/Button';
import { AlertCircle, RefreshCcw, Trash2 } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = window.location.pathname; // Reload to root
    } catch (e) {
      console.error('Failed to clear storage:', e);
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-foreground">
          <div className="w-full max-w-md rounded-xl border-2 border-destructive/30 bg-card p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
                <AlertCircle size={48} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
              <p className="mt-2 text-muted-foreground">
                The application encountered an unexpected error and could not continue.
              </p>
            </div>

            <div className="mb-8 rounded-lg bg-muted/50 p-4 font-mono text-xs overflow-auto max-h-32 border">
              <p className="font-bold text-destructive mb-1">{this.state.error?.name}:</p>
              <p className="opacity-80">{this.state.error?.message}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} />
                Try Reloading
              </Button>
              <Button
                variant="destructive"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Reset & Reload
              </Button>
            </div>

            <p className="mt-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
              Resetting will clear your local settings and history
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
