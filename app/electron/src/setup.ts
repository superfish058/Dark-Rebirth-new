import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import {
  CapElectronEventEmitter,
  CapacitorSplashScreen,
  setupCapacitorElectronPlugins,
} from '@capacitor-community/electron';
import chokidar from 'chokidar';
import type { MenuItemConstructorOptions } from 'electron';
import { app, BrowserWindow, ipcMain, Menu, MenuItem, nativeImage, Tray, session, shell } from 'electron';
import electronIsDev from 'electron-is-dev';
import electronServe from 'electron-serve';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';

// Define components for a watcher to detect when the webapp is changed so we can reload in Dev mode.
const reloadWatcher = {
  debouncer: null,
  ready: false,
  watcher: null,
};
export function setupReloadWatcher(electronCapacitorApp: ElectronCapacitorApp): void {
  reloadWatcher.watcher = chokidar
    .watch(join(app.getAppPath(), 'app'), {
      ignored: /[/\\]\./,
      persistent: true,
    })
    .on('ready', () => {
      reloadWatcher.ready = true;
    })
    .on('all', (_event, _path) => {
      if (reloadWatcher.ready) {
        clearTimeout(reloadWatcher.debouncer);
        reloadWatcher.debouncer = setTimeout(async () => {
          electronCapacitorApp.getMainWindow().webContents.reload();
          reloadWatcher.ready = false;
          clearTimeout(reloadWatcher.debouncer);
          reloadWatcher.debouncer = null;
          reloadWatcher.watcher = null;
          setupReloadWatcher(electronCapacitorApp);
        }, 1500);
      }
    });
}

// Define our class to manage our app.
export class ElectronCapacitorApp {
  private MainWindow: BrowserWindow | null = null;
  private SplashScreen: CapacitorSplashScreen | null = null;
  private TrayIcon: Tray | null = null;
  private CapacitorFileConfig: CapacitorElectronConfig;
  private TrayMenuTemplate: (MenuItem | MenuItemConstructorOptions)[] = [
    new MenuItem({ label: 'Quit App', role: 'quit' }),
  ];
  private AppMenuBarMenuTemplate: (MenuItem | MenuItemConstructorOptions)[] = [
    { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
    { role: 'viewMenu' },
  ];
  private mainWindowState;
  private loadWebApp;
  private customScheme: string;

  constructor(
    capacitorFileConfig: CapacitorElectronConfig,
    trayMenuTemplate?: (MenuItemConstructorOptions | MenuItem)[],
    appMenuBarMenuTemplate?: (MenuItemConstructorOptions | MenuItem)[]
  ) {
    this.CapacitorFileConfig = capacitorFileConfig;

    this.customScheme = this.CapacitorFileConfig.electron?.customUrlScheme ?? 'capacitor-electron';

    if (trayMenuTemplate) {
      this.TrayMenuTemplate = trayMenuTemplate;
    }

    if (appMenuBarMenuTemplate) {
      this.AppMenuBarMenuTemplate = appMenuBarMenuTemplate;
    }

    // Setup our web app loader, this lets us load apps like react, vue, and angular without changing their build chains.
    this.loadWebApp = electronServe({
      directory: join(app.getAppPath(), 'app'),
      scheme: this.customScheme,
    });
  }

  // 生产环境：直连服务器地址
  private devServerUrl = 'http://101.43.38.56:8080';

  // Helper function to load in the app.
  private async loadMainWindow(thisRef: any) {
    if (!thisRef.MainWindow || thisRef.MainWindow.isDestroyed()) {
      console.log('[Dark Rebirth] 窗口已关闭，跳过加载');
      return;
    }
    if (thisRef.devServerUrl) {
      console.log('[Dark Rebirth] Loading from dev server:', thisRef.devServerUrl);
      try {
        await thisRef.MainWindow.loadURL(thisRef.devServerUrl);
        console.log('[Dark Rebirth] 前端页面加载成功');
      } catch (err) {
        console.log('[Dark Rebirth] 加载远程地址失败，回退到本地文件:', err);
        if (!thisRef.MainWindow.isDestroyed()) {
          await thisRef.loadWebApp(thisRef.MainWindow);
        }
      }
    } else {
      console.log('[Dark Rebirth] Loading local app');
      if (!thisRef.MainWindow.isDestroyed()) {
        await thisRef.loadWebApp(thisRef.MainWindow);
      }
    }
  }

  // Expose the mainWindow ref for use outside of the class.
  getMainWindow(): BrowserWindow {
    return this.MainWindow;
  }

  getCustomURLScheme(): string {
    return this.customScheme;
  }

  async init(): Promise<void> {
    const icon = nativeImage.createFromPath(
      join(app.getAppPath(), 'assets', process.platform === 'win32' ? 'appIcon.ico' : 'appIcon.png')
    );
    this.mainWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800,
    });
    // Setup preload script path and construct our main window.
    const preloadPath = join(app.getAppPath(), 'build', 'src', 'preload.js');
    this.MainWindow = new BrowserWindow({
      icon,
      show: false,
      x: this.mainWindowState.x,
      y: this.mainWindowState.y,
      width: this.mainWindowState.width,
      height: this.mainWindowState.height,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        // Use preload to inject the electron varriant overrides for capacitor plugins.
        // preload: join(app.getAppPath(), "node_modules", "@capacitor-community", "electron", "dist", "runtime", "electron-rt.js"),
        preload: preloadPath,
      },
    });
    this.mainWindowState.manage(this.MainWindow);

    if (this.CapacitorFileConfig.backgroundColor) {
      this.MainWindow.setBackgroundColor(this.CapacitorFileConfig.electron.backgroundColor);
    }

    // If we close the main window with the splashscreen enabled we need to destory the ref.
    this.MainWindow.on('closed', () => {
      if (this.SplashScreen?.getSplashWindow() && !this.SplashScreen.getSplashWindow().isDestroyed()) {
        this.SplashScreen.getSplashWindow().close();
      }
    });

    // When the tray icon is enabled, setup the options.
    if (this.CapacitorFileConfig.electron?.trayIconAndMenuEnabled) {
      this.TrayIcon = new Tray(icon);
      this.TrayIcon.on('double-click', () => {
        if (this.MainWindow) {
          if (this.MainWindow.isVisible()) {
            this.MainWindow.hide();
          } else {
            this.MainWindow.show();
            this.MainWindow.focus();
          }
        }
      });
      this.TrayIcon.on('click', () => {
        if (this.MainWindow) {
          if (this.MainWindow.isVisible()) {
            this.MainWindow.hide();
          } else {
            this.MainWindow.show();
            this.MainWindow.focus();
          }
        }
      });
      this.TrayIcon.setToolTip(app.getName());
      this.TrayIcon.setContextMenu(Menu.buildFromTemplate(this.TrayMenuTemplate));
    }

    // Setup the main manu bar at the top of our window.
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.AppMenuBarMenuTemplate));

    // If the splashscreen is enabled, show it first while the main window loads then switch it out for the main window, or just load the main window from the start.
    if (this.CapacitorFileConfig.electron?.splashScreenEnabled) {
      this.SplashScreen = new CapacitorSplashScreen({
        imageFilePath: join(
          app.getAppPath(),
          'assets',
          this.CapacitorFileConfig.electron?.splashScreenImageName ?? 'splash.png'
        ),
        windowWidth: 400,
        windowHeight: 400,
      });
      this.SplashScreen.init(this.loadMainWindow, this);
    } else {
      this.loadMainWindow(this);
    }

    // Security - allow loading from server URL
    const serverUrl = (this.CapacitorFileConfig as any).server?.url;
    this.MainWindow.webContents.on('did-finish-load', () => {
      console.log('[Dark Rebirth] 页面加载完成:', this.MainWindow.webContents.getURL());
      // 注入细滚动条样式（类似 Chrome 风格，窄条 + 两端圆角）
      this.MainWindow.webContents.insertCSS(`
        ::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2) !important;
          border-radius: 3px !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.35) !important;
        }
        ::-webkit-scrollbar-corner { background: transparent !important; }
      `);
    });
    this.MainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
      console.log('[Dark Rebirth] 页面加载失败:', validatedURL, '错误码:', errorCode, '描述:', errorDescription);
    });
    this.MainWindow.webContents.setWindowOpenHandler((details) => {
      const currentUrl = this.MainWindow.webContents.getURL();
      const isInternal =
        details.url.startsWith(currentUrl?.split('/').slice(0, 3).join('/') ?? '') ||
        details.url.includes('localhost') ||
        details.url.includes('101.43.38.56') ||
        details.url.startsWith(this.customScheme);
      if (isInternal) {
        return { action: 'allow' };
      }
      // 外部链接用系统默认浏览器打开
      shell.openExternal(details.url);
      return { action: 'deny' };
    });
    this.MainWindow.webContents.on('will-navigate', (event, _newURL) => {
      if (!serverUrl && !this.MainWindow.webContents.getURL().includes(this.customScheme)) {
        event.preventDefault();
      }
    });

    // 注册 IPC：用系统默认浏览器打开外部链接（复用已有浏览器窗口）
    try { ipcMain.removeHandler('open-external'); } catch (_) {}
    ipcMain.handle('open-external', async (_event, url: string) => {
      await shell.openExternal(url);
    });

    // Link electron plugins into the system.
    setupCapacitorElectronPlugins();

    // When the web app is loaded we hide the splashscreen if needed and show the mainwindow.
    this.MainWindow.webContents.on('dom-ready', () => {
      if (this.CapacitorFileConfig.electron?.splashScreenEnabled) {
        this.SplashScreen.getSplashWindow().hide();
      }
      if (!this.CapacitorFileConfig.electron?.hideMainWindowOnLaunch) {
        this.MainWindow.show();
      }
      setTimeout(() => {
        CapElectronEventEmitter.emit('CAPELECTRON_DeeplinkListenerInitialized', '');
      }, 400);
    });
  }
}

// Set a CSP up for our application based on the custom scheme
export function setupContentSecurityPolicy(customScheme: string): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          electronIsDev
            ? `default-src ${customScheme}://* http://localhost:* https://* 'unsafe-inline' devtools://* 'unsafe-eval' data:`
            : `default-src ${customScheme}://* http://101.43.38.56:* https://* 'unsafe-inline' 'unsafe-eval' data:`,
        ],
      },
    });
  });
}
