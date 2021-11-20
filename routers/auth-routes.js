const path = require('path');
const express = require('express');
const routers = express.Router();
const authController = require(path.join(__dirname+'/../controller/authController'));

routers.get('/login', (req,res)=>{
    res.render('login');
});

routers.post('/login', authController.checkLogin);
routers.get('/logout', authController.logout);


module.exports = routers;