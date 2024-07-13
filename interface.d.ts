// see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript

export interface IElectronAPI {
  showWindow: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}