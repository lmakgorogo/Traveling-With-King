import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept third-party browser extension errors (e.g., MetaMask, Phantom inpage.js)
// to prevent external wallet extensions from disrupting the application window.
if (typeof window !== 'undefined') {
  const isExtensionError = (msg?: string | null, source?: string | null) => {
    const text = `${msg || ''} ${source || ''}`.toLowerCase();
    return (
      text.includes('chrome-extension://') ||
      text.includes('moz-extension://') ||
      text.includes('metamask') ||
      text.includes('inpage.js') ||
      text.includes('failed to connect to metamask')
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      if (
        isExtensionError(event.message, event.filename) ||
        (event.error && isExtensionError(event.error.message, event.error.stack))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason;
      const reasonText =
        typeof reason === 'string'
          ? reason
          : reason?.message || reason?.stack || JSON.stringify(reason || '');
      if (isExtensionError(reasonText, '')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Traveling with King runtime boundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090D] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#12131F] border border-[#DFB45E]/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <h2 className="text-2xl font-serif-luxury text-[#FCE9B0]">
              Traveling with King
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              An unexpected issue occurred while rendering. Click below to refresh your itinerary builder.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] text-[#090A0F] font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
