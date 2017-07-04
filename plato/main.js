const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const {dialog, Menu, shell} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: false,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // openExternalBrowser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow();
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {label: 'New File'},
        {type: 'separator'},
        {label: 'Save'},
        {label: 'Save As...'},
        {type: 'separator'},
        {label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: function() {app.quit();}}
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }},
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
        {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
      ]
    },
    {
      label: 'Help',
      submenu: [
        {label: 'About',
        click (item, focusedWindow) {
          var remote_app = require('electron').remote;
          var options = {
            buttons: ['OK'],
            message: 'mruby IoT framework \'Plato\'',
            detail: '\nVersion ' + app.getVersion() + '\n\n© 2016 mruby Plato developers.',
            icon: app.getAppPath() + '/images/plato-logo.png'
          };
          if (dialog.showMessageBox(focusedWindow, options) > 0) return;
        }}
      ]
    },
  ]);

  Menu.setApplicationMenu(menu);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.