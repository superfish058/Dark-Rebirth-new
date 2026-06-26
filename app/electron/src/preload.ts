require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
const { contextBridge, ipcRenderer } = require('electron');

// 暴露 openExternal 方法，让渲染进程可以用系统默认浏览器打开链接
contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
});

console.log('User Preload!');
