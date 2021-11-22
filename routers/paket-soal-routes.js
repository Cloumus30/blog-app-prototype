const path = require('path');
const express = require('express');
const routers = express.Router();
const paketSoalController = require(path.join(__dirname+'/../controller/paketSoalController'));
const {checkUser, currentUser} = require(path.join(__dirname,'../middleware/auth-middleware'));

routers.get('/paket-soal',currentUser, paketSoalController.listPaketSoal);

routers.get('/insert-paket-soal',checkUser, paketSoalController.insertPaketSoalPage); //go to insert paket Soal page
routers.get('/edit-paket-soal/:id',checkUser, paketSoalController.editPaketSoalPage); //go to edit paket Soal page
routers.post('/update-paket-soal',checkUser, paketSoalController.editPaketSoal); //update and save to db
routers.post('/insert-paket-soal',checkUser, paketSoalController.insertPaketSoal ); //insert paket soal data to db

module.exports = routers;
