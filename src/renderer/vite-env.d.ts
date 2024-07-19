/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_FIREBASE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
export interface IElectronAPI {
  showWindow: () => void;
  showNotification: () => void;
  savePassword: (password: string) => Promise<{ ok: boolean }>;
  verifyPassword: (password: string) => Promise<{ ok: boolean }>;
  getMachineId: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
