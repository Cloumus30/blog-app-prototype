const path = require('path');
const express = require('express');
const routers = express.Router();
const soalController = require(path.join(__dirname+'/../controller/soalController'));
const {checkUser,currentUser} = require(path.join(__dirname,'../middleware/auth-middleware'));

routers.get('/soal/:id',currentUser, soalController.showAll); //show All Soal from paket Soal
// routers.use(checkUser);
routers.get('/insert-soal',checkUser, soalController.insertPage); //got to insert soal page
routers.get('/edit-soal/:id',checkUser, soalController.editPage); //Go to Edit Soal Page
routers.post('/update-soal/:id',checkUser, soalController.update); //Update and save to db
routers.post('/insert-soal',checkUser, soalController.insert); //Insert Soal and save to db
routers.post('/delete-soal/:id',checkUser, soalController.destroy); //delete soal from db

module.exports = routers;