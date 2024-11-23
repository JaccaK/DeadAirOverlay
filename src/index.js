const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('node:path');
if (require('electron-squirrel-startup')) return;
//
var mainWindow
let appIcon = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const toggleClickThru = () => {
    var truth = mainWindow.isAlwaysOnTop()
    mainWindow.setIgnoreMouseEvents(!truth)
    mainWindow.setAlwaysOnTop(!truth)
}

const createWindow = () => {
  

  // and load the index.html of the app.
  mainWindow.loadFile(__dirname + '/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  //Disable Clickthrough
  
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    mainWindow = new BrowserWindow({
    icon: __dirname + '/icon.png',
    width: 200,
    height: 100,
    maxHeight: 100, minHeight:100,
    maxWidth: 200, minWidth: 200,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: __dirname + '/preload.js',
    },
    transparent: true,
    alwaysOnTop: false,
  });

  appIcon = new Tray(__dirname + '/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Move', type: 'normal' , click: toggleClickThru},
    { label: 'Quit', type: 'normal' , role:'quit'}
  ])
  appIcon.setContextMenu(contextMenu)
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
