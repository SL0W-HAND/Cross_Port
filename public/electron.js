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
    extname:'.hbs',
    helpers: {
        isPdf: function(value) {
            if (value == '.pdf') {
                return true
            } else {
                return false
            }
        }
    }

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
        
        //falta cancelar repetidos
         result.filePaths.forEach((element) => {

                files.push({
                    'path':element,
                    'name':path.basename(element),
                    'extension':path.extname(element)
                });
    
            });
        

        mainWindow.webContents.send('return-name', files);

    }


   // console.log(files);
});


var iPadress = {
    privateIp: '',
    publicIp: ''
}
electron.ipcMain.on('ip_adress_req', async () => {
    
    const publicIp = new Promise((resolve,reject) => {
        network.get_public_ip(function(err, ip) {
    
            //mainWindow.webContents.send('publicIp',err || ip)
            if (err){
                iPadress.publicIp = false
                resolve()
            }else{
                iPadress.publicIp = ip
                resolve()
            }
          })
    }) 

    const privateIp = new Promise((resolve,reject) => {
        network.get_private_ip(function(err, ip) {
    
            //mainWindow.webContents.send('privateIp',err || ip)
            if (err){
                iPadress.privateIp = false
                reject()
            }else{
                iPadress.privateIp = ip
                console.log('ip')
                resolve()    
            }
          })
    })

    privateIp.then(
        publicIp
    ).then(() => {
        mainWindow.webContents.send('ip_adress_res',iPadress)
    }).catch(() => {
        mainWindow.webContents.send('ip_adress_res',iPadress)
    })

})



electron.ipcMain.on('burn-baby', () => {
    console.log( 'burn' );
    server.get('/', (req, res) => {
        res.render('index',{
            title:'server',
            documents: files
        });
      });

    server.get('/download/:id', async (req, res) => {
        console.log(req.params['id']);
        
        var pathResponse
        pathResponse = files.find(element => element.name == req.params['id']);
        console.log(pathResponse.path);

        res.download(pathResponse.path,pathResponse.name,function (err){
            if (err) {
                res.send('ubo un error')
            } else {
                
            }
        })
      });

      server.get('/view/:id', async(req,res) => {
        var pathResponse
        pathResponse = files.find(element =>  element.name == req.params['id']);
        console.log(pathResponse.path)
        
        fs.readFile(pathResponse.path, (err,data) => {
            res.contentType("application/pdf");
            res.send(data);
        })
        
      });

      server.listen(port, () => {
        console.log(`Example ap ap listeningt http://localhost:${port}`)
      });
    //mainWindow.webContents.send('return-exe', '');
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
        console.log(name);   
       
        mainWindow.webContents.send('network_name_response',name)
        //=> 'wu-tang lan'
    }).catch(err => {
        mainWindow.webContents.send('network_name_response',false)
    })
})



