// see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript

export interface IElectronAPI {
  showWindow: () => void;
  showNotification: () => void;
  savePassword: (password: string) => { ok: boolean };
  verifyPassword: (password: string) => { ok: boolean };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
