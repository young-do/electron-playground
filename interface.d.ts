// see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript

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
