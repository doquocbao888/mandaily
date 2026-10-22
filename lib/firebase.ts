import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Suppress benign browser WebChannel AbortError and Clipboard permission rejection in iframe
if (typeof window !== 'undefined') {
  const isIgnored = (reason: any, msg?: string) => {
    const text = (msg || (reason && typeof reason === 'object' && 'message' in reason ? String(reason.message) : String(reason || ''))).toLowerCase();
    const name = (reason && typeof reason === 'object' && 'name' in reason ? String(reason.name) : '');
    return (
      name === 'AbortError' ||
      name === 'NotAllowedError' ||
      text.includes('signal is aborted') ||
      text.includes('aborterror') ||
      text.includes('write permission denied') ||
      text.includes("failed to execute 'writetext'") ||
      text.includes('clipboard') ||
      text.includes('aborted')
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isIgnored(event?.reason)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      if (isIgnored(event?.error, event?.message)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      }
    },
    true
  );
}

// Initialize Firestore with experimentalForceLongPolling to avoid WebChannel stream AbortError
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: false,
    }, firebaseConfig.firestoreDatabaseId);
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Ignore abort errors from browser/React unmounts or network reconnects
  if (
    (error instanceof Error && error.name === 'AbortError') ||
    errorMessage.toLowerCase().includes('aborted') ||
    errorMessage.toLowerCase().includes('signal is aborted')
  ) {
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration.');
    }
  }
}
