require("dotenv").config();
const path = require('path');
const express = require("express");

const fileUpload =  require('express-fileupload');
const session = require('express-session');
const {flash} = require('express-flash-message');
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT||3000;

// Import routers
const dashboardRoutes = require(path.join(__dirname+'/routers/dashboard-routes'));
const postRoutes = require(path.join(__dirname+'/routers/post-routes'));
const imageRoutes = require(path.join(__dirname+'/routers/image-routes'));
const paketSoalRoutes = require(path.join(__dirname+'/routers/paket-soal-routes'));
const soalRoutes = require(path.join(__dirname+'/routers/soal-routes'));
const authRoutes = require(path.join(__dirname+'/routers/auth-routes'));

const {checkToken,currentUser} = require(path.join(__dirname,'middleware/auth-middleware'));

app.set('view engine' , 'ejs');
app.set('views' , './views');

app.use(fileUpload());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// express-session
app.use(
    session({
        secret: 'blognisfa',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash({sessionKeyName:'flashMessage'}));
app.use(cookieParser());

app.use(authRoutes);
// app.use(checkToken);
// app.use(currentUser);

// Using Imported Routers
app.use(dashboardRoutes);
app.use(postRoutes);
app.use(paketSoalRoutes);
app.use(soalRoutes);
app.use(imageRoutes);

app.listen(port,()=>{
    console.log(`Listen at port: ${port}`);
})

// app.get('/blog',async (req,res)=>{

//     let URLQuery = pagination(req.query);

//     try {
//         const posts = await Post.findAndCountAll({
//             limit:URLQuery.pageSize,
//             offset:URLQuery.offset,
//             order:[
//                 ['updatedAt','DESC']
//             ]
//         });    

//         // get image and desc from post
//     posts.rows.forEach(element => {
//         let imagesArr = getImages(element.body); //get images from html string
//         element.image = imagesArr[0];
//         // if image doesn't exist use the default image
//         if(!element.image){
//             element.image = "/img/default-post.jpg"
//         }
//         let desc = getDesc(element.body); //get description from teks
//         element.desc = desc;

//         // Change format date
//         let dateVal = element.updatedAt;
//         dateVal = dateVal.toString();
//         dateVal = new Date(dateVal);
//         dateVal = moment(dateVal).format('DD MMMM YYYY')
//         element.datePost = dateVal;
//     });

//     res.render('blog',{posts,URLQuery});

//     } catch (error) {
//         console.log(error);
//     }
    
// });

// app.get('/insert-post',async (req,res)=>{
//     res.render('insert-post');
// })

// app.get('/post/:id',async (req,res)=>{
//     const id = req.params.id;
//     try{
//         const post = await Post.findByPk(id);
//     // res.json(post)
//     res.render('show_post',{post});
//     }catch(err){
//         console.log(err);
//     }
// });

// app.get('/edit-post/:id',async(req,res)=>{
//     const id = req.params.id.trim();
//     try {
//         const data = await Post.findByPk(id);
//         res.render('edit_post',{post:data});    
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
    
// })

// Insert Post API
// app.post('/insert-post', async (req,res)=>{
//     const request = req.body;
//     // console.log(request);
//     if(request.title==''){
//         request.title="Judul post Default ";
//     }
//     try{
//         const data = await Post.create({
//             title:request.title,
//             body:request.body,
//             geogebra:request.geogebra
//         });
//         res.redirect('/blog');
//     }catch(err){
//         console.log(err);
//     }
    
// });

// Update Post API
// app.post('/update-post/:id',async (req,res)=>{
//     const id = req.params.id.trim();
//     const request = req.body;
//     try {
//         const data = await Post.update({
//             title:request.title,
//             body:request.body,
//             geogebra:request.geogebra,
//         },{
//             where:{
//                 id:id
//             }
//         });
//         res.redirect(`/blog`);
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// })

// function deleteImage(path=""){
//     fs.unlink(path,(err)=>{
//         if(err){
//             console.log(err);
//             // res.json(err);
//             return false;
//         }
//         // res.json(pathFile);
//         // console.log('image dihapus lagi')
//         return true;
//     })
// }

// upload image API
// app.post('/image-upload',(req,res)=>{
//     const image = req.files.image;
//     // console.info(image);
//     let imageName = image.name.replace(/ /g,""); //delete or spacce in image name
//     let arrImage = imageName.split('.');
//     // console.log(arrImage);
//     imageName = mergeImageName(arrImage);
//     let formatImage = arrImage[arrImage.length-1]; //get format image
//     let cloudName = imageName + '-'+moment().format('DD-MM-YYYY'); //cloudinary image public id (name)
//     imageName += '-'+moment().format('DD-MM-YYYY')+'.'+formatImage;
//     uploadPathServer = __dirname +'/'+imageName;
//     // console.log(uploadPathServer);
// //   Use the mv() method to place the file somewhere on your server
//     image.mv(uploadPathServer,async function(err) {
//         if (err){
//             console.log(err);
//             return res.status(500).send(err);
//         }
//             uploadPathUser = '/img/' + imageName;
//             uploadPathServer = __dirname +'/'+imageName; //update uploadPathServer for upload to cloud
//             let lokasi='';
            
//             try {
//                 const result = await cloudinary.uploader.upload(uploadPathServer,{public_id:cloudName});
//                 // console.log(result);
//                 uploadPathServer = __dirname +'/'+imageName; //update uploadPathServer for delete in local server
//                 deleteImage(uploadPathServer)
//                 // console.log(result);
//                 return res.json({"location":result.url})
//             } catch (error) {
                
//             }
//     });    
// })


// Merge array of image Name and add id for uniq name
// function mergeImageName(arr=[]){
//     let id = customAlphabet('1234567890abcdefg', 6);
//     let res='';
//     let i=0;
//     while(i<arr.length-1){
//         res+=arr[i]
//         i+=1;
//     }
//     res+='-'+id();
//     return res;
// }

// // Delete Post API
// app.delete('/post-delete/:id', async(req,res)=>{
//     let id = req.params.id.trim();
//     try{
//         const data = await Post.destroy({
//             where:{
//                 id:id
//             }
//         });
//         const result = {
//             notif:"berhasil dihapus"
//         }
//         return res.json({"notif":"berhasil"});
//     }catch(err){
//         console.log(err);
//         res.json(err);
//     }

// })

// // Check Domain from the image src to define delete or not
// function checkDomain(pathFile=''){
//     const url = new URL(pathFile);
//     const hostName = url.hostname;
//     const username = url.pathname.split('/')[1];
//     if((hostName=='res.cloudinary.com') && (username=="cloumus")){
//         return true;
//     }else{
//         return false;
//     }
// }

// // Get name of image (public id in cloudinary) from src image
// function getPublicId(src=''){
//     src = decodeURI(src);
//     let arrString = src.split('/');
//     let nameFormated = arrString[arrString.length-1].split('.');
//     let justName = nameFormated[0].toString();
//     // console.log(justName);

//     return justName;
// }

// // Delete Image API
// app.delete('/image-delete',(req,res)=>{
//     // Delete images from delete post button in show_post page
//     if(req.body.images){
//         const images = req.body.images;
//         const imagesArr = images.split(',');
//         cloudinary.api.delete_resources(imagesArr,
//             function(error, result) {
//                 if(error){
//                     console.log(error);
//                 } 
//                 res.json({"notif":"gambar dihapus"})
//             }); 
//     }

//     // Delete image from active tinymce editor in edit page
//     if(req.body.pathFile){
//         const imageUrl = req.body.pathFile;
//         console.log(imageUrl);
//         if(checkDomain(imageUrl)){
//             const imageName = getPublicId(imageUrl);
//             cloudinary.api.delete_resources(imageName,
//             function(error, result) {
//                 if(error){
//                     console.log(error);
//                 } 
//                 res.json({"notif":"gambar dihapus"})
//             }); 
//         }
//     }
// });

// app.get('/paket-soal', async (req,res)=>{
//     try {
//         const posts = await Post.findAndCountAll({
//             limit:5,
//             order:[
//                 ['updatedAt','DESC']
//             ]
//         });    

//         // get image and desc from post
//         posts.rows.forEach(element => {
//         let imagesArr = getImages(element.body); //get images from html string
//         element.image = imagesArr[0];
//         // if image doesn't exist use the default image
//         if(!element.image){
//             element.image = "/img/default-post.jpg"
//         }
//         let desc = getDesc(element.body); //get description from teks
//         element.desc = desc;

//         // Change format date
//         let dateVal = element.updatedAt;
//         dateVal = dateVal.toString();
//         dateVal = new Date(dateVal);
//         dateVal = moment(dateVal).format('DD MMMM YYYY')
//         element.datePost = dateVal;
//     });

//         const paketSoal = await PaketSoal.findAll();
//         // console.log(data);
//         res.render('list_paket_soal',{paketSoal,posts});
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// });


// app.get('/insert-paket-soal',(req,res)=>{
//     res.render('insert_paket_soal');
// });

// app.get('/edit-paket-soal/:id',async (req,res)=>{
//     const id = req.params.id.trim();
//     try {
//         const data = await PaketSoal.findByPk(id);
//         res.render('insert_paket_soal',{paketSoal:data});    
//     } catch (error) {
//         console.log(error);
//     }
    
// });

// app.post('/update-paket-soal',async (req,res)=>{
//     const id = req.body.id;
//     const request = req.body;
//     try {
//         const dat = await PaketSoal.update({
//             nama_paket:request.namaPaket
//         },{
//             where:{
//                 id:id
//             }
//         });
//         res.redirect('/paket-soal');
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// })

// app.post('/insert-paket-soal',async (req,res)=>{
//     const request = req.body;
//     try {
//         const dat = await PaketSoal.create({
//             nama_paket: request.namaPaket
//         });
//         res.redirect('/paket-soal');
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// })

// show All Soal from Paket Soal
// app.get('/soal/:id', async (req,res)=>{
//     const id = req.params.id.trim();
//     try {
//         const paket = await PaketSoal.findByPk(id);
//         const data = await Soal.findAll({
//             where:{
//                 nama_paket:id
//             }
//         });
//         // console.log(data);
//         res.render('soal',{soal:data,paket});
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// });

// app.get('/insert-soal',async (req,res)=>{
//     try {
//         let paketSoal = await PaketSoal.findAll();
//         // paketSoal = {}
//         if(Object.keys(paketSoal).length===0){
//             notif = {
//                 alert:'Paket Soal Tidak ada, Isi dulu paket Soal',
//                 redirect:'/insert-paket-soal'
//             };
//             return res.render('notifPage',{notif});
//         }
//         let idPaket = paketSoal[0].id;
//         if(req.query.idPaket){
//             idPaket = req.query.idPaket;
//         }
//         return res.render('insert_soal_pembahasan',{paketSoal,idPaket});
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// });


// Go to Edit Soal Page
// app.get('/edit-soal/:id',async(req,res)=>{
//     const id = req.params.id.trim();
//     try {
//         const dat = await Soal.findByPk(id);
//         const paket = await PaketSoal.findByPk(dat.nama_paket);
//         const pakets = await PaketSoal.findAll();
//         if(Object.keys(pakets).length===0){
//             notif = {
//                 alert:'Paket Soal Tidak ada, Isi dulu paket Soal',
//                 redirect:'/insert-paket-soal'
//             };
//             return res.render('notifPage',{notif});
//         }
//         res.render('edit_soal',{soal:dat,pakets,paket});
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// });

// app.post('/update-soal/:id',async (req,res)=>{
//     const id = req.params.id.trim();
//     const request = req.body;
//     try {
//         const data  = {
//             soal:request.soal,
//             pilA: request.pilA,
//             pilB: request.pilB,
//             pilC: request.pilC,
//             pilD: request.pilD,
//             pilE: request.pilE,
//             pembahasan: request.pembahasan
//         };
//         const dat = await Soal.update({
//             dat_soal: data,
//             nama_paket: request.paket_soal
//         },{
//             where:{
//                 id:id
//             }
//         });
//         res.redirect(`/paket-soal`);
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// })


// app.post('/insert-soal',async (req,res)=>{
//    const request = req.body;
//    const data  = {
//        soal:request.soal,
//        pilA: request.pilA,
//        pilB: request.pilB,
//        pilC: request.pilC,
//        pilD: request.pilD,
//        pilE: request.pilE,
//        pembahasan: request.pembahasan
//    };
// //    const datJson = JSON.stringify(data);
// //    console.log(datJson);
// //    console.log(JSON.stringify(request));
//    try {
//     const dat = await Soal.create({
//         dat_soal: data,
//         nama_paket: request.paket_soal
//     });
//     res.redirect('/paket-soal');    
//    } catch (error) {
//     console.log(error);
//     res.json(error);
    
//    }
   
// });

// app.post('/delete-soal/:id',async (req,res)=>{
//     const id = req.params.id.trim();
//     try {
//         const data = await Soal.destroy({
//             where:{
//                 id:id
//             }
//         });
//         res.redirect('/paket-soal');
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// });


