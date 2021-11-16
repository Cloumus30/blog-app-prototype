const path = require('path');
const express = require('express');
const routers = express.Router();
const imageController = require(path.join(__dirname+'/../controller/imageController'));

routers.post('/image-upload',imageController.uploadImage);
routers.delete('/image-delete', imageController.deleteImageAPI);


module.exports = routers;
