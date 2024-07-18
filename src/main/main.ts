import { app, BrowserWindow, ipcMain, Notification, safeStorage } from 'electron';
import { createTray } from './tray';
import { createWindow } from './window';
import { machineIdSync } from 'node-machine-id';

let mainWindow: BrowserWindow | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow = createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// 별도 파일에 저장하지 않고 1회적으로 암호화된 비밀번호를 저장하기 위한 변수
let temporallyEncryptedPassword: Buffer;

app.whenReady().then(() => {
  createTray(mainWindow);

  ipcMain.on('show-window', () => {
    mainWindow?.show();
  });
  ipcMain.on('show-notification', () => {
    // @see: https://www.electronjs.org/docs/latest/api/notification
    new Notification({
      title: '🍅 Pomodoro Timer (desktop) 🍅',
      body: '10분이 지났습니다!',
    }).show();
  });
  ipcMain.on('save-password', (event, password) => {
    if (safeStorage.isEncryptionAvailable()) {
      temporallyEncryptedPassword = safeStorage.encryptString(password);
      event.returnValue = { ok: true };
    } else {
      event.returnValue = { ok: false };
    }
  });
  ipcMain.on('verify-password', (event, password) => {
    if (!temporallyEncryptedPassword) {
      event.returnValue = { ok: false };
      return;
    }
    const decryptedPassword = safeStorage.decryptString(temporallyEncryptedPassword);
    if (password === decryptedPassword) {
      event.returnValue = { ok: true };
    } else {
      event.returnValue = { ok: false };
    }
  });
  ipcMain.on('get-machine-id', (event) => {
    event.returnValue = machineIdSync(true);
  });
});
