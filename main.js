const electron = require('electron')
const app = electron.app

const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const template = [
    {
        label: 'Panel',
        submenu: [
            {
                label: 'Settings',
                click () { 
                    alert('settings')
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About',
                click () { 
                    electron.shell.openExternal('http://novosga.org') 
                }
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow.loadURL('file://' + __dirname + '/index.html')

    mainWindow.on('closed', function() {
        mainWindow = null
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});
