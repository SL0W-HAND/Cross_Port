const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Menu, ipcMain, dialog} = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

var fork = require("child_process").fork;

let mainWindow;

const wifiName = require('wifi-name');
var network = require('network');


function createWindow() {
    mainWindow = new BrowserWindow({ 
        minWidth: 900, 
        minHeight: 680,
        icon: path.join(__dirname ,'./favicon.ico'), 
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true

    }});

    mainWindow.maximize();
    Menu.setApplicationMenu(null);

    mainWindow.loadURL( isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
    app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

var files = [];

let options = {
    title : "Select files", 
        
    buttonLabel : "Select",
    
    properties: ['multiSelections'],
     name: 'All Files', 
     extensions: ['*'] 
};

electron.ipcMain.on('get-files', async () => {
    mainWindow.webContents.send('return-name', files);
})

electron.ipcMain.on('open-dialog', async () =>{
    var result;

    result = await dialog.showOpenDialog(mainWindow,options);

    if (result.canceled == false){
        
        //missing cancel repeated
         result.filePaths.forEach((element) => {

                files.push({
                    'path':element,
                    'name':path.basename(element),
                    'extension':path.extname(element)
                });
    
            });
        

        mainWindow.webContents.send('return-name', files);

    };
});

var iPadress = {
    privateIp: '',
    publicIp: ''
};

electron.ipcMain.on('ip_adress_req', async () => {
    
    const publicIp = new Promise((resolve,reject) => {
        network.get_public_ip(function(err, ip) {
    
            //mainWindow.webContents.send('publicIp',err || ip)
            if (err){
                iPadress.publicIp = false;
                resolve();
            }else{
                iPadress.publicIp = ip;
                resolve();
            };
          });
    });

    const privateIp = new Promise((resolve,reject) => {
        network.get_private_ip(function(err, ip) {
            if (err){
                iPadress.privateIp = false;
                reject();
            }else{
                iPadress.privateIp = ip;
                resolve();
            };
          });
    });

    privateIp.then(
        publicIp
    ).then(() => {
        mainWindow.webContents.send('ip_adress_res',iPadress);
    }).catch(() => {
        mainWindow.webContents.send('ip_adress_res',iPadress);
    });

});



electron.ipcMain.on('burn-baby', () => {
    var serverScript = fork(path.join(__dirname, './subprocess/serverscript.js'));
    serverScript.send({"is_on":true , "files":files});

    electron.ipcMain.on('turn-off-server', () => { 
    //serverScript.send({"is_on":false});
        serverScript.kill();
 });
});

electron.ipcMain.on('update-files',(e,data)=>{
    files = data;
});
/*
.catch(
    mainWindow.webContents.send('network_name','error')
);*/
electron.ipcMain.on('network_name_req',() => {
    wifiName().then(name => {
        mainWindow.webContents.send('network_name_response',name);
    }).catch(err => {
        mainWindow.webContents.send('network_name_response',false);
    });
});