const path = require('path');
const moment = require('moment');
const{PaketSoal,Post} = require(path.join(__dirname+'/../models/index'));
const{getImages, getDesc} = require(path.join(__dirname+'/../custom-function/funct'));

// Show All List of Paket Soal adn 5 posts
const listPaketSoal = async(req,res)=>{
    const error = await req.consumeFlash('error');
    const info = await req.consumeFlash('info');
    try {
        const posts = await Post.findAndCountAll({
            limit:5,
            order:[
                ['updatedAt','DESC']
            ]
        });    

        // get image and desc from post
        posts.rows.forEach(element => {
        let imagesArr = getImages(element.body); //get images from html string
        element.image = imagesArr[0];
        // if image doesn't exist use the default image
        if(!element.image){
            element.image = "/img/default-post.jpg"
        }
        let desc = getDesc(element.body); //get description from teks
        element.desc = desc;

        // Change format date
        let dateVal = element.updatedAt;
        dateVal = dateVal.toString();
        dateVal = new Date(dateVal);
        dateVal = moment(dateVal).format('DD MMMM YYYY')
        element.datePost = dateVal;
    });

        const paketSoal = await PaketSoal.findAll();
        // console.log(data);
        res.render('list_paket_soal',{paketSoal,posts,info,error});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

// go to insert paket soal page
const insertPaketSoalPage = async (req,res)=>{
    res.render('insert_paket_soal');
};

// Go to Edit Paket Soal Page
const editPaketSoalPage = async(req,res)=>{
    const id = req.params.id.trim();
    try {
        const data = await PaketSoal.findByPk(id);
        res.render('insert_paket_soal',{paketSoal:data});    
    } catch (error) {
        console.log(error);
    }
};

//save paket Soal update to db
const editPaketSoal = async(req,res)=>{
    const id = req.body.id;
    const request = req.body;
    try {
        const dat = await PaketSoal.update({
            nama_paket:request.namaPaket
        },{
            where:{
                id:id
            }
        });
        await req.flash('info', 'Paket Soal berhasil diupdate');
        res.redirect('/paket-soal');
    } catch (error) {
        console.log(error);
        await req.flash('error', `Terdapat error: ${error}`);
        res.redirect('/paket-soal');
        // res.json(error);
    }
};

//save inserted paket soal to db
const insertPaketSoal = async(req,res)=>{
    const request = req.body;
    try {
        const dat = await PaketSoal.create({
            nama_paket: request.namaPaket
        });
        await req.flash('info','Paket Soal berhasil ditambahkan');
        res.redirect('/paket-soal');
    } catch (error) {
        console.log(error);
        await req.flash('error', `Terdapat error: ${error}`);
        res.redirect('/paket-soal');
    }
};



module.exports = {
    listPaketSoal,
    insertPaketSoalPage,
    editPaketSoalPage,
    editPaketSoal,
    insertPaketSoal
}