const path = require('path');
const moment = require('moment');
const {Post, Soal, PaketSoal} = require(path.join(__dirname+'/../models/index'));
const {mergeImageName,deleteImage, checkDomain, getPublicId} = require(path.join(__dirname+'/../custom-function/funct'));
const cloudinary = require("cloudinary").v2;

// upload Image to cloudninary
const uploadImage = async(req,res)=>{
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
                console.log(error);
            }
    });    
}


// delete Image from Cloudinary
const deleteImageAPI = async(req,res)=>{
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
}

module.exports = {
    uploadImage,
    deleteImageAPI,
}
