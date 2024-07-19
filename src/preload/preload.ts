// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from '../renderer/vite-env.d';

const electronAPI: IElectronAPI = {
  showWindow: () => ipcRenderer.send('show-window'),
  showNotification: () => ipcRenderer.send('show-notification'),
  savePassword: (password: string) => ipcRenderer.invoke('save-password', password),
  verifyPassword: (password: string) => ipcRenderer.invoke('verify-password', password),
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
