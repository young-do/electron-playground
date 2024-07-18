// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from '../../interface.d';

const electronAPI: IElectronAPI = {
  showWindow: () => ipcRenderer.send('show-window'),
  showNotification: () => ipcRenderer.send('show-notification'),
  savePassword: (password: string) => ipcRenderer.sendSync('save-password', password),
  verifyPassword: (password: string) => ipcRenderer.sendSync('verify-password', password),
  getMachineId: () => ipcRenderer.sendSync('get-machine-id'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
