const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const SONGS_FILE = path.join(app.getPath('userData'), 'songs.json');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Cancionero',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('cancionero.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

// Cargar canciones guardadas
ipcMain.handle('load-songs', () => {
  try {
    if (fs.existsSync(SONGS_FILE))
      return JSON.parse(fs.readFileSync(SONGS_FILE, 'utf-8'));
  } catch(e) {}
  return null;
});

// Guardar canciones automaticamente
ipcMain.handle('save-songs', (e, songsJson) => {
  try {
    fs.writeFileSync(SONGS_FILE, songsJson, 'utf-8');
    return true;
  } catch(e) { return false; }
});

// Exportar HTML portatil para compartir con otras PCs
ipcMain.handle('export-html', async (e, htmlContent) => {
  const { filePath } = await dialog.showSaveDialog(win, {
    defaultPath: 'cancionero.html',
    filters: [{ name: 'Archivo HTML', extensions: ['html'] }],
    title: 'Exportar cancionero para compartir'
  });
  if (!filePath) return false;
  try {
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    return true;
  } catch(e) { return false; }
});
