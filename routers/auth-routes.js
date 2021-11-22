const path = require('path');
const express = require('express');
const routers = express.Router();
const authController = require(path.join(__dirname+'/../controller/authController'));

routers.get('/login', async (req,res)=>{
    const error = await req.consumeFlash('error');
    res.render('login',{error});
});

routers.post('/login', authController.checkLogin);
routers.get('/logout', authController.logout);


module.exports = routers;