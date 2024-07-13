import { Menu, NativeImage, nativeImage, Tray, BrowserWindow } from 'electron';
import { join } from 'path';

const createIconGetter = (start: number, end: number, gifname: string) => {
  const icons: NativeImage[] = [];
  for (let i = start; i <= end; i++) {
    const iconpath = join(
      __dirname,
      `../../assets/${gifname}/frame_${i.toString().padStart(3, '0')}.png`,
    );
    const icon = nativeImage.createFromPath(iconpath);
    !icon.isEmpty() && icons.push(icon);
  }

  let index = 0;
  return () => {
    const icon = icons[index];
    index = (index + 1) % icons.length;
    return icon;
  };
};

export const createTray = (window: BrowserWindow) => {
  const getIcon = createIconGetter(0, 10, 'partyparrot');
  const tray = new Tray(getIcon());
  const interval = 100;

  let timer: NodeJS.Timeout;
  const start = () => {
    clearInterval(timer);

    timer = setInterval(() => {
      tray.setImage(getIcon());
    }, interval);
  };
  const stop = () => {
    clearInterval(timer);
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: 'show', click: () => window.show() },
    { label: 'start', click: start },
    { label: 'stop', click: stop },
    { label: 'quit', role: 'quit' },
  ]);

  tray.setToolTip('This is my application.');
  // tray.setTitle('25:00');
  tray.setContextMenu(contextMenu);

  start();

  return tray;
};
