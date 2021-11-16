const path = require('path');
const express = require('express');
const routers = express.Router();
const blogController = require(path.join(__dirname+'/../controller/blogController'));

routers.get('/blog',blogController.blogList);
routers.get('/insert-post',blogController.insertPostPage);
routers.get('/post/:id',blogController.showPost ); //show One Post
routers.get('/edit-post/:id', blogController.editPostPage ); //go to edit pOst page
routers.post('/insert-post',blogController.insertPost ); // insert post to db
routers.post('/update-post/:id', blogController.updatePost ); // update and save post to db
routers.delete('/post-delete/:id', blogController.deletePost); // delete post data from db


module.exports = routers;