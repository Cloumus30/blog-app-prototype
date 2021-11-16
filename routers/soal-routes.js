const path = require('path');
const express = require('express');
const routers = express.Router();
const soalController = require(path.join(__dirname+'/../controller/soalController'));

routers.get('/soal/:id', soalController.showAll); //show All Soal from paket Soal
routers.get('/insert-soal', soalController.insertPage); //got to insert soal page
routers.get('/edit-soal/:id', soalController.editPage); //Go to Edit Soal Page
routers.post('/update-soal/:id', soalController.update); //Update and save to db
routers.post('/insert-soal', soalController.insert); //Insert Soal and save to db
routers.post('/delete-soal/:id', soalController.destroy); //delete soal from db

module.exports = routers;