require("dotenv").config();
const express = require("express");
const {Post} = require('./models/index');
const fs = require('fs');
const fileUpload =  require('express-fileupload');
const moment = require('moment');
const { customAlphabet}  = require("nanoid");
const cloudinary = require("cloudinary").v2;
const { stringify } = require("querystring");
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

app.get('/',async (req,res)=>{
    // console.log(cloudinary.config());
    const posts = await Post.findAll();

    res.render('dashboard',{posts});
});

app.get('/insert',async (req,res)=>{
    res.render('main');
})

app.post('/insert-post', async (req,res)=>{
    const request = req.body;
    // console.log(request);
    if(request.title==''){
        request.title="Judul post Default ";
    }
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

function deleteImage(path=""){
    fs.unlink(path,(err)=>{
        if(err){
            console.log(err);
            // res.json(err);
            return false;
        }
        // res.json(pathFile);
        // console.log('image dihapus lagi')
        return true;
    })
}


app.post('/image-upload',(req,res)=>{
    const image = req.files.image;
    // console.info(image);
    let imageName = image.name.replace(/ /g,""); //delete or spacce in image name
    let arrImage = imageName.split('.');
    console.log(arrImage);
    imageName = mergeImageName(arrImage);
    let formatImage = arrImage[arrImage.length-1]; //get format image
    let cloudName = imageName + '-'+moment().format('DD-MM-YYYY'); //cloudinary image public id (name)
    imageName += '-'+moment().format('DD-MM-YYYY')+'.'+formatImage;
    uploadPathServer = __dirname +'/'+imageName;
    console.log(uploadPathServer);
//   Use the mv() method to place the file somewhere on your server
    image.mv(uploadPathServer,async function(err) {
        if (err){
            console.log(err);
            return res.status(500).send(err);
        }
            uploadPathUser = '/img/' + imageName;
            uploadPathServer = __dirname +'/'+imageName; //update uploadPathServer for upload to cloud
            let lokasi='';
            
            try {
                const result = await cloudinary.uploader.upload(uploadPathServer,{public_id:cloudName});
                // console.log(result);
                uploadPathServer = __dirname +'/'+imageName; //update uploadPathServer for delete in local server
                deleteImage(uploadPathServer)
                return res.json({"location":result.url})
            } catch (error) {
                
            }
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

    // fs.unlink(__dirname+path,(err)=>{
    //     if(err){
    //         console.log(err);
    //         res.json(err);
    //     }
    //     res.json(pathFile);
    // });
    const deleted = deleteImage(__dirname+path);
    if(deleted){
        res.json(pathFile);
    }else{
        res.json("error");
    }

    
})

app.listen(port,()=>{
    console.log(`Listen at port: ${port}`);
})
