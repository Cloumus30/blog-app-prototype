const path = require('path');
const express = require('express');
const routers = express.Router();
const paketSoalController = require(path.join(__dirname+'/../controller/paketSoalController'));

routers.get('/paket-soal', paketSoalController.listPaketSoal);
routers.get('/insert-paket-soal', paketSoalController.insertPaketSoalPage); //go to insert paket Soal page
routers.get('/edit-paket-soal/:id', paketSoalController.editPaketSoalPage); //go to edit paket Soal page
routers.post('/update-paket-soal', paketSoalController.editPaketSoal); //update and save to db
routers.post('/insert-paket-soal', paketSoalController.insertPaketSoal ); //insert paket soal data to db



module.exports = routers;
