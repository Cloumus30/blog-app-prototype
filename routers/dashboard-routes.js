const path = require('path');
const express = require('express');
const routers = express.Router();


routers.get('/about', async(req,res)=>{
    res.render('about');
})

routers.get('/', async (req,res)=>{
    res.render('index')
});

module.exports = routers;