const path = require('path');
const jwt = require("jsonwebtoken");
const {User} = require(path.join(__dirname+'/../models/index'));

// Check JWT Token
const checkToken = ()=>{
    return async (req,res,next)=>{
        // Get jwt Token from cookie browser
        const jwtCookie = req.cookies.jwtToken;
        // Check jwt Cookie
            if(jwtCookie){
            // verify jwt token and decode it
            jwt.verify(jwtCookie,'blognisfa', async (err,decoded)=>{
                if(err){
                    console.log(err);
                }
                // Take user Data from Database
                try {
                    const user = await User.findOne({
                        where:{
                            username:decoded.username,
                        }
                    });
                    
                    if(user!==null){
                        //Data Username Exist
                        next();
                    }else{
                        //user not authorized
                        console.log('user tidak authorized')
                        res.redirect('/');
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        }else{
            console.log('not authorized');
            next();
        }
    }
    
};


//Checking Current User Session
const currentUser = (req,res,next)=>{
    // GET JWT Token from cookie
    const jwtCookie = req.cookies.jwtToken;
    // console.log(jwtCookie);
    if(jwtCookie){
        // Verify JWT TOken and decode it
        jwt.verify(jwtCookie,'blognisfa', async (err, decoded)=>{
            if(err){
                console.log(err);
            }
            // Take User Data from Database
            console.log(decoded);
            try {   
                const user = await User.findOne({
                    where:{
                        username:decoded.username,
                    }
                })
                if(user!==null){
                    //user authorized
                    //send user data to view engine
                    res.locals.user = user;
                    next();
                }else{
                    //user not authorized
                    res.locals.user = null;
                    console.log('user tidak ada');
                    next();
                }
            } catch (error) {
                console.log(error);
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

//Checking Current User Session
const checkUser = (req,res,next)=>{
    // GET JWT Token from cookie
    const jwtCookie = req.cookies.jwtToken;
    // console.log(jwtCookie);
    if(jwtCookie){
        // Verify JWT TOken and decode it
        jwt.verify(jwtCookie,'blognisfa', async (err, decoded)=>{
            if(err){
                console.log(err);
            }
            // Take User Data from Database
            console.log(decoded);
            try {   
                const user = await User.findOne({
                    where:{
                        username:decoded.username,
                    }
                })
                if(user!==null){
                    //user authorized
                    //send user data to view engine
                    res.locals.user = user;
                    next();
                }else{
                    //user not authorized
                    res.locals.user = null;
                    console.log('user tidak ada');
                    res.redirect('/')
                }
            } catch (error) {
                console.log(error);
            }
        })
    }else{
        res.locals.user = null;
        res.redirect('/');
    }
}



module.exports = {
    checkToken,
    currentUser,
    checkUser
}

