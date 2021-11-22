const path = require('path');
const {Soal,PaketSoal} = require(path.join(__dirname+'/../models/index'));

//Show All Soal From Paket Soal
const showAll = async(req,res)=>{
    const id = req.params.id.trim();
    const info = await req.consumeFlash('info');
    const error = await req.consumeFlash('error');
    try {
        const paket = await PaketSoal.findByPk(id);
        const data = await Soal.findAll({
            where:{
                nama_paket:id
            }
        });
        // console.log(data);
        res.render('soal',{soal:data,paket,info,error});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

// go to insert soal page
const insertPage = async(req,res)=>{
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
        let idPaket = paketSoal[0].id;
        if(req.query.idPaket){
            idPaket = req.query.idPaket;
        }
        return res.render('insert_soal_pembahasan',{paketSoal,idPaket});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

// Go To Edit Soal Page
const editPage = async(req,res)=>{
    const id = req.params.id.trim();
    try {
        const dat = await Soal.findByPk(id);
        const paket = await PaketSoal.findByPk(dat.nama_paket);
        const pakets = await PaketSoal.findAll();
        if(Object.keys(pakets).length===0){
            notif = {
                alert:'Paket Soal Tidak ada, Isi dulu paket Soal',
                redirect:'/insert-paket-soal'
            };
            return res.render('notifPage',{notif});
        }
        res.render('edit_soal',{soal:dat,pakets,paket});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

// update and save data to db
const update = async(req,res)=>{
    const id = req.params.id.trim();
    const request = req.body;
    try {
        const data  = {
            soal:request.soal,
            pilA: request.pilA,
            pilB: request.pilB,
            pilC: request.pilC,
            pilD: request.pilD,
            pilE: request.pilE,
            pembahasan: request.pembahasan
        };
        const dat = await Soal.update({
            dat_soal: data,
            nama_paket: request.paket_soal
        },{
            where:{
                id:id
            }
        });
        await req.flash('info','update Soal berhasil');
        res.redirect(`/paket-soal`);
    } catch (error) {
        console.log(error);
        await req.flash('error',`update Gagal: ${error}`);
        res.redirect(`/paket-soal`);
    }
};

//insert and save data to db
const insert = async(req,res)=>{
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
//    const datJson = JSON.stringify(data);
//    console.log(datJson);
//    console.log(JSON.stringify(request));
   try {
    const dat = await Soal.create({
        dat_soal: data,
        nama_paket: request.paket_soal
    });
    await req.flash('info','Soal berhasil ditambahkan');
    res.redirect('/paket-soal');    
   } catch (error) {
    console.log(error);
    await req.flash('error',`Input Gagal: ${error}`);
    res.redirect(`/paket-soal`);
   }
};

//delete soal data from db
const destroy = async(req,res)=>{
    const id = req.params.id.trim();
    try {
        const data = await Soal.destroy({
            where:{
                id:id
            }
        });
        await req.flash('Soal berhasil dihapus');
        res.redirect('/paket-soal');
    } catch (error) {
        console.log(error);
        await req.flash('error',`Soal Gagal dihapus: ${error}`);
        res.redirect(`/paket-soal`);
    }
}


module.exports = {
    showAll,
    insertPage,
    editPage,
    update,
    insert,
    destroy,
}