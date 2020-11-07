const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Menu, ipcMain, dialog} = require("electron");
const url = require("url");
const path = require("path");
const fs = require('fs');
const isDev = require("electron-is-dev");


const express = require('express')
const server = express();
const port = 8989;
let mainWindow;


//experiments
const wifiName = require('wifi-name');
var network = require('network');
var exphbs  = require('express-handlebars');


require('electron-reload')(__dirname);

//i dont know why thats didn't work 

server.set('port',port)
server.set('views', path.join(__dirname,'views'));
server.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(server.get('views'),'layouts'),
    partialsDir:path.join(server.get('views'),'partials'),
    extname:'.hbs'

  }));
server.set('view engine','.hbs');



function createWindow() {
mainWindow = new BrowserWindow({ 
    width: 900, 
    height: 680, 
    webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true

  }});


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
    title : "Custom title bar", 
        
    buttonLabel : "Select",
    
    properties: ['multiSelections'],
     name: 'All Files', 
     extensions: ['*'] 
};

electron.ipcMain.on('open-dialog', async () =>{
    var result;

    result = await dialog.showOpenDialog(mainWindow,options)

    if (result.canceled == false){
        
        
         result.filePaths.forEach((element) => {

                files.push({
                    'path':element,
                    'name':path.basename(element)
                });
    
            });
        

        mainWindow.webContents.send('return-name', files);

    }


   // console.log(files);
});

electron.ipcMain.on('burn-baby', (e,arg) => {
    console.log( arg );
    server.get('/', (req, res) => {
        res.render('index',{
            title:'server',
            documents: files
        });
      });
      server.listen(port, () => {
        console.log(`Example ap ap listeningt http://localhost:${port}`)
      });
    //mainWindow.webContents.send('return-exe', '');
});


/*
.catch(
    mainWindow.webContents.send('network_name','error')
);*/
electron.ipcMain.on('network_name_req',() => {
    wifiName().then(name => {
        console.log(name);   
       
        mainWindow.webContents.send('network_name_response',name)
        //=> 'wu-tang lan'
    }).catch(err => {
        mainWindow.webContents.send('network_name_response',false)
    })
})

network.get_public_ip(function(err, ip) {
    
    //mainWindow.webContents.send('publicIp',err || ip)
    if (err){
        console.log(err)
    }else{
        mainWindow.webContents.send('publicIp',ip)
    }
  })

network.get_private_ip(function(err, ip) {
    
    //mainWindow.webContents.send('privateIp',err || ip)
    if (err){
        console.log(err)
    }else{
        mainWindow.webContents.send('privateIp',ip)
    }
  })