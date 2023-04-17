// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const url = require('url')
const electronReload = require('electron-reload');

if (process.env.NODE_ENV === 'dev') {
    const electronReload = require('electron-reload');
    const rootPath = path.join(__dirname, '.');
    electronReload(rootPath, {
        electron: path.join(rootPath, 'node_modules', '.bin', 'electron')
    });
}

// Save data to file
ipcMain.handle('save-data', async(event, data) => {
    const options = {
        title: 'Save JSON Data',
        filters: [
            {
                name: 'JSON',
                extensions: ['json']
            }
        ]
    };

    const result = await dialog.showSaveDialog(options);
    if (!result.canceled && result.filePath) {
        const jsonData = JSON.stringify(data, null, 2);
        require('fs').writeFileSync(result.filePath, jsonData);
    }
});

// Load data from file
ipcMain.handle('load-data', async() => {
    const options = {
        title: 'Open JSON Data',
        filters: [
            {
                name: 'JSON',
                extensions: ['json']
            }
        ],
        properties: ['openFile']
    };

    const result = await dialog.showOpenDialog(options);
    if (!result.canceled && result.filePaths.length > 0) {
        const jsonData = require('fs').readFileSync(result.filePaths[0], 'utf-8');
        return JSON.parse(jsonData);
    }
});

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 1200,
        minWidth: 1200,
        minHeight: 900,
        icon: path.join(__dirname, 'icon_min.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);

    mainWindow.setMenu(null);

    // Open the DevTools. 
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished initialization and is
// ready to create browser windows. Some APIs can only be used after this event
// occurs.
app
    .whenReady()
    .then(() => {
        createWindow()

        app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the dock icon is
            // clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) 
                createWindow()
        })
    })

// Quit when all windows are closed, except on macOS. There, it's common for
// applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') 
        app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.