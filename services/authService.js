require('dotenv').config();
const jwt = require('jsonwebtoken');


//
const secret = process.env.SECRET;

function setUser(user){
    return jwt.sign({
        id:user,
    },
    secret
    )
}

function getUser(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.json({success:false,message:'Unauthorized'});
    const token = authHeader.split(' ')[1];

    try {
        const user = jwt.verify(token,process.env.SECRET);
        console.log(`user = ${JSON.stringify(user)}`)
        req.user = user;
        next();
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

module.exports = {
    setUser,
    getUser
}
