const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require(path.join(__dirname,'../models/index'));

//Create JWT Token For Authorized User
const createToken = (username)=>{
    return jwt.sign({username},'blognisfa');
};

// Check User Authorized for Login or Not
const checkLogin = async(req,res,next)=>{
    const request = req.body;
    console.log(request.username);
    const username = request.username.trim();

    //Take User data and Check Request data match DB Data or Not
    try{
        const data = await User.findOne({
            where:{
                username:username,
            }
        });

        //Checking username exist or not;
        if(data!==null){
            const hashPass = data.password;
            const reqPass = request.password;

            //Checking password Correct or not
            bcrypt.compare(reqPass, hashPass, async function(err,result){
                if(err){
                    console.log(err);
                    res.json(err);
                }
                if(result){
                    //password correct
                    const token = createToken(data.username);
                    res.cookie('jwtToken',token,{httpOnly:true});
                    return res.redirect('/');
                }
                //password does not correct
                console.log('password Salah');
            });
        }
    }catch(error){
        console.log(error);
    }
}

//Logout authorized User
const logout = (req,res)=>{
    //Overwrite jwt Token with temporary token 
    res.cookie('jwtToken','',{httpOnly:true,maxAge:1});
    res.redirect('/');
}

module.exports = {
    createToken,
    checkLogin,
    logout
}