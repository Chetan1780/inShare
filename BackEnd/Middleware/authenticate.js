const jwt = require('jsonwebtoken');
const handleError = require("../Helper/handleError")
const authenticate = async (req,res,next)=>{
    try {
        // console.log("request coming");
        
        const token = req.cookies.token;
        console.log(token);
        
        if(!token){
            return next(handleError(403,'Unauthorized acesss'));
        }
        const decodetoken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodetoken;
        next();
        
    } catch (error) {
        next(handleError(500,error.message));
    }
}
module.exports = authenticate;