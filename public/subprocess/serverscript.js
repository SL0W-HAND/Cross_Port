const express = require('express')
const server = express();
const path = require("path");
const fs = require('fs');
const port = 8989;
var exphbs  = require('express-handlebars');

server.set('port',port)
server.set('views', path.join(__dirname,'../views'));
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

server.use(express.static(path.join(__dirname , '../views')))



process.on("message" ,(message) => {

    if (message.is_on == true) {

        const files = message.files

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
        
          server.listen(port);
    
    } else {
        console.log('apagar')
        process.exit(0);
    }
})


 