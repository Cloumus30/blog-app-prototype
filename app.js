require("dotenv").config();
const express = require("express");
const {Post} = require('./models/index');
const fs = require('fs');
const fileUpload =  require('express-fileupload');
const moment = require('moment');
const { customAlphabet}  = require("nanoid");
const app = express();
const port = process.env.PORT||3000;

app.set('view engine' , 'ejs');
app.set('views' , './views');

app.use(fileUpload());
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

app.get('/post/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        const post = await Post.findByPk(id);
    // res.json(post)
    res.render('show_post',{post});
    }catch(err){
        console.log(err);
    }
    
});

app.get('/',(req,res)=>{
    res.render('main');
})

app.post('/insert-post', async (req,res)=>{
    const request = req.body;
    // console.log(request);
    try{
        const data = await Post.create({
            title:request.title,
            body:request.body,
        });
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
    
});


app.post('/image-upload',(req,res)=>{
    const image = req.files.image;
    // console.info(image);
    let imageName = image.name.replace(/ /g,""); //delete or spacce in image name
    let arrImage = imageName.split('.');
    console.log(arrImage);
    imageName = mergeImageName(arrImage);
    let formatImage = arrImage[arrImage.length-1];
    imageName += '-'+moment().format('DD-MM-YYYY')+'.'+formatImage;
    uploadPathServer = __dirname + '/public/img/'+imageName;
    console.info(imageName);
  // Use the mv() method to place the file somewhere on your server
    image.mv(uploadPathServer, function(err) {
        if (err){
            return res.status(500).send(err);
        }
            uploadPathUser = '/img/' + imageName;
            console.log(uploadPathUser);
            return res.json({
                "location":uploadPathUser
            });
    });    
})

// Merge array of image Name and add id for uniq name
function mergeImageName(arr=[]){
    let id = customAlphabet('1234567890abcdefg', 6);
    let res='';
    let i=0;
    while(i<arr.length-1){
        res+=arr[i]
        i+=1;
    }
    res+='-'+id();
    return res;
}

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
