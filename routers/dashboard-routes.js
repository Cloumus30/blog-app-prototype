const path = require('path');
const express = require('express');
const routers = express.Router();
const {currentUser} = require(path.join(__dirname,'../middleware/auth-middleware'));


routers.get('/about', currentUser, async(req,res)=>{
    res.render('about');
})

routers.get('/', currentUser, async (req,res)=>{
    const info = await req.consumeFlash('info');
    const error = await req.consumeFlash('error');
    res.render('index',{info,error});
});

module.exports = routers;