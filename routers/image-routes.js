const path = require('path');
const express = require('express');
const routers = express.Router();
const imageController = require(path.join(__dirname+'/../controller/imageController'));
const {checkUser} = require(path.join(__dirname,'../middleware/auth-middleware'));

// routers.use(checkUser);
routers.post('/image-upload',checkUser,imageController.uploadImage);
routers.delete('/image-delete',checkUser, imageController.deleteImageAPI);


module.exports = routers;
