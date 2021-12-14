const { w3cwebsocket } = require("websocket")
const { app, BrowserWindow } = require('electron')
const path = require('path')
const sensor = new w3cwebsocket('ws://localhost:8765');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,
    fullscreen: true
  })
  mainWindow.setMenu(null);
  mainWindow.loadFile('build/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

sensor.onclose = function () {
  setTimeout(() => {
    app.quit()
  }, 50*1000);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})