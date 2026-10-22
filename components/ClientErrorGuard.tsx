'use client';

import { useEffect } from 'react';

/**
 * ClientErrorGuard suppresses benign iframe sandbox errors in capture phase:
 * 1. WebChannel / Firestore AbortError on unmount or network switch
 * 2. Clipboard writeText permission denied in sandboxed iframes
 */
export default function ClientErrorGuard() {
  useEffect(() => {
    const isIgnored = (err: unknown, message?: string) => {
      const msg = (message || (err && typeof err === 'object' && 'message' in err ? String((err as any).message) : String(err || ''))).toLowerCase();
      const name = (err && typeof err === 'object' && 'name' in err ? String((err as any).name) : '');
      return (
        name === 'AbortError' ||
        name === 'NotAllowedError' ||
        msg.includes('signal is aborted') ||
        msg.includes('aborterror') ||
        msg.includes('write permission denied') ||
        msg.includes("failed to execute 'writetext'") ||
        msg.includes('clipboard') ||
        msg.includes('aborted')
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isIgnored(event?.reason)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isIgnored(event?.error, event?.message)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      }
    };

    // Use capture phase to intercept before any other error handler or dev overlay
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
}
