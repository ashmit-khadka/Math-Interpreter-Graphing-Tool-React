const { app, BrowserWindow } = require('electron')
const path = require("path")
const isDev = require("electron-is-dev")

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    },
    frame: false,
  })

  win.loadURL(
      isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, "../build/index.html")}`
    )
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})