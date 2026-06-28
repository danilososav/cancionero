const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadSongs:  ()       => ipcRenderer.invoke('load-songs'),
  saveSongs:  (json)   => ipcRenderer.invoke('save-songs', json),
  exportHTML: (html)   => ipcRenderer.invoke('export-html', html)
});
