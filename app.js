require("dotenv").config();
const express = require("express");
const {Post, Soal, PaketSoal} = require('./models/index');
const fs = require('fs');
const fileUpload =  require('express-fileupload');
const moment = require('moment');
const { customAlphabet}  = require("nanoid");
const cloudinary = require("cloudinary").v2;
const { stringify } = require("querystring");
const res = require("express/lib/response");
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

app.get('/edit-post/:id',async(req,res)=>{
    const id = req.params.id.trim();
    try {
        const data = await Post.findByPk(id);
        res.render('edit_post',{post:data});    
    } catch (error) {
        console.log(error);
        res.json(error);
    }
    
})

// Insert Post API
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
            geogebra:request.geogebra
        });
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
    
});

// Update Post API
app.post('/update-post/:id',async (req,res)=>{
    const id = req.params.id.trim();
    const request = req.body;
    try {
        const data = await Post.update({
            title:request.title,
            body:request.body,
            geogebra:request.geogebra,
        },{
            where:{
                id:id
            }
        });
        res.redirect(`/`);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

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

// upload image API
app.post('/image-upload',(req,res)=>{
    const image = req.files.image;
    // console.info(image);
    let imageName = image.name.replace(/ /g,""); //delete or spacce in image name
    let arrImage = imageName.split('.');
    // console.log(arrImage);
    imageName = mergeImageName(arrImage);
    let formatImage = arrImage[arrImage.length-1]; //get format image
    let cloudName = imageName + '-'+moment().format('DD-MM-YYYY'); //cloudinary image public id (name)
    imageName += '-'+moment().format('DD-MM-YYYY')+'.'+formatImage;
    uploadPathServer = __dirname +'/'+imageName;
    // console.log(uploadPathServer);
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
                // console.log(result);
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

// Delete Post API
app.delete('/post-delete/:id', async(req,res)=>{
    let id = req.params.id.trim();
    try{
        const data = await Post.destroy({
            where:{
                id:id
            }
        });
        const result = {
            notif:"berhasil dihapus"
        }
        return res.json({"notif":"berhasil"});
    }catch(err){
        console.log(err);
        res.json(err);
    }

})

// Check Domain from the image src to define delete or not
function checkDomain(pathFile=''){
    const url = new URL(pathFile);
    const hostName = url.hostname;
    const username = url.pathname.split('/')[1];
    if((hostName=='res.cloudinary.com') && (username=="cloumus")){
        return true;
    }else{
        return false;
    }
}

// Get name of image (public id in cloudinary) from src image
function getPublicId(src=''){
    src = decodeURI(src);
    let arrString = src.split('/');
    let nameFormated = arrString[arrString.length-1].split('.');
    let justName = nameFormated[0].toString();
    // console.log(justName);

    return justName;
}

// Delete Image API
app.delete('/image-delete',(req,res)=>{
    // Delete images from delete button in show_post page
    if(req.body.images){
        const images = req.body.images;
        const imagesArr = images.split(',');
        cloudinary.api.delete_resources(imagesArr,
            function(error, result) {
                if(error){
                    console.log(error);
                } 
                res.json({"notif":"gambar dihapus"})
            }); 
    }

    // Delete image from active tinymce editor in edit page
    if(req.body.pathFile){
        const imageUrl = req.body.pathFile;
        console.log(imageUrl);
        if(checkDomain(imageUrl)){
            const imageName = getPublicId(imageUrl);
            cloudinary.api.delete_resources(imageName,
            function(error, result) {
                if(error){
                    console.log(error);
                } 
                res.json({"notif":"gambar dihapus"})
            }); 
        }
    }
});

app.get('/insert-paket-soal',(req,res)=>{
    res.render('insert_paket_soal');
});

app.post('/insert-paket-soal',async (req,res)=>{
    const request = req.body;
    try {
        const dat = await PaketSoal.create({
            nama_paket: request.namaPaket
        });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

app.get('/soal',async (req,res)=>{
   try {
       const data = await Soal.findAll();
       console.log(data);
       res.json(data);
   } catch (error) {
       console.log(error);
       res.json(error);
   } 
});

app.get('/insert-soal',async (req,res)=>{
    try {
        let paketSoal = await PaketSoal.findAll();
        // paketSoal = {}
        if(Object.keys(paketSoal).length===0){
            notif = {
                alert:'Paket Soal Tidak ada, Isi dulu paket Soal',
                redirect:'/insert-paket-soal'
            };
            return res.render('notifPage',{notif});
        }
        return res.render('soal_pembahasan',{paketSoal});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

app.post('/insert-soal',async (req,res)=>{
   const request = req.body;
   const data  = {
       soal:request.soal,
       pilA: request.pilA,
       pilB: request.pilB,
       pilC: request.pilC,
       pilD: request.pilD,
       pilE: request.pilE,
       pembahasan: request.pembahasan
   };
   const datJson = JSON.stringify(data);
   console.log(datJson);
//    console.log(JSON.stringify(request));
   try {
    const dat = await Soal.create({
        soal: request
    });
    res.redirect('/insert-soal');    
   } catch (error) {
    console.log(error);
    res.json(error);
    
   }
   
   
});

app.listen(port,()=>{
    console.log(`Listen at port: ${port}`);
})
