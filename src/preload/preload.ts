// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from '../../interface.d';

const electronAPI: IElectronAPI = {
  showWindow: () => ipcRenderer.send('show-window'),
  showNotification: () => ipcRenderer.send('show-notification'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
