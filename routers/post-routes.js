const path = require('path');
const express = require('express');
const routers = express.Router();
const blogController = require(path.join(__dirname+'/../controller/blogController'));
const {checkUser, currentUser} = require(path.join(__dirname,'../middleware/auth-middleware'));

routers.get('/blog',currentUser,blogController.blogList);
routers.get('/post/:id',currentUser,blogController.showPost ); //show One Post
// routers.use(checkUser);
routers.get('/insert-post',checkUser,blogController.insertPostPage);
routers.get('/edit-post/:id',checkUser, blogController.editPostPage ); //go to edit pOst page
routers.post('/insert-post',checkUser,blogController.insertPost ); // insert post to db
routers.post('/update-post/:id',checkUser, blogController.updatePost ); // update and save post to db
routers.delete('/post-delete/:id',checkUser, blogController.deletePost); // delete post data from db


module.exports = routers;