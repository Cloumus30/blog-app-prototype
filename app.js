require("dotenv").config();
const express = require("express");
const fs = require('fs');
const fileUpload =  require('express-fileupload');
const app = express();
const port = process.env.PORT||3000;

app.set('view engine' , 'ejs');
app.set('views' , './views');

app.use(fileUpload());
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

app.get('/',(req,res)=>{
    // console.log(__dirname);
    res.render('main');
});

app.post('/insert-post', (req,res)=>{
    const request = req.body;
    console.log(request);
    res.json(request);
});

app.post('/image-upload',(req,res)=>{
    const image = req.files.image;
    console.log(image);
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // sampleFile = req.files.sampleFile;
    let imageName = image.name.replace(/ /g,""); //delete or spacce in image name
    uploadPathServer = __dirname + '/public/img/'+imageName;
    uploadPathUser = '/img/' + imageName;

  // Use the mv() method to place the file somewhere on your server
    image.mv(uploadPathServer, function(err) {
        if (err){
            return res.status(500).send(err);
        }
            res.json({
                "location":uploadPathUser
            });
    });
    
})

app.delete('/image-delete',(req,res)=>{
    const pathFile = req.body.pathFile;
    // Get folder img and file Name of the Image from src
    let pathArr = pathFile.split('/');
    const pathLen = pathArr.length;
    const path = '/public/'+pathArr[pathLen-2]+'/'+pathArr[pathLen-1];

    fs.unlink(__dirname+path,(err)=>{
        if(err){
            console.log(err);
            res.json(err);
        }
        res.json(pathFile);
    })

    
})

app.listen(port,()=>{
    console.log(`Listen at port: ${port}`);
})
