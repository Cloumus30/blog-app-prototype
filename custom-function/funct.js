const { customAlphabet}  = require("nanoid");
const fs = require('fs');

// function get images from string html
function getImages(html = ''){
    const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
    const images = [];
    let img;
    while ((img = imgRex.exec(html))) {
        images.push(img[1]);
    }
    return images;
}

// function to remove img tag and slice the string
function getDesc(html=''){
    let result = html.replace(/<img.*?src="(.*?)"[^>]+>/g,""); //delete image
    result = result.replace(/<[^>]*>?/gm,''); // delete html tag
    result = result.slice(0,300);
    return result;
}

// function for pagination
function pagination(query={},page=1,pageSize=10){
    let URLQuery = {
        page:page,
        pageSize:pageSize,
    };
    if(query.page){
        page = query.page;
        URLQuery.page =  page;
    }
    URLQuery.offset = (page-1)*pageSize;

    return URLQuery;
}

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
};

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


module.exports={
    getImages,
    getDesc,
    pagination,
    deleteImage,
    mergeImageName,
    checkDomain,
    getPublicId,
}