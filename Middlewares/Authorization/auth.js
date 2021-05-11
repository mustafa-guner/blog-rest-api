const CustomError = require("../../Helpers/Custom Error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../Helpers/Authorization/tokenHelpers");
const expressAsyncHandler = require("express-async-handler");
const User = require("../../Models/User");

module.exports = {

    getAccessToRoute: (req,res,next)=>{
        const {JWT_SECRET_KEY} = process.env;
        //Check Token
        if(!isTokenIncluded(req)){
            //Token Dogru Formatta degilsa
            //401 => Unauthorized Status => Sayfaya giremeyince
            //403 => Forbidden Status => Sayfaya girilir ama yetkisi olmayan alana ulasmaya calisilirsa
            return next(new CustomError("You are not authorized to this route!",401))
        }
        console.log(req.headers.authorization);
        const AccessToken = getAccessTokenFromHeader(req);

        jwt.verify(AccessToken,JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                return next(new CustomError("You are not authorized to this route!",401))
            }
            req.user = {
                id:decoded.id,
                name:decoded.name,
            }
            //console.log(decoded);
            next();
        })
    },

    getAdminAccess: expressAsyncHandler( async(req,res,next)=>{
        const id = req.user.id;
        const user = await User.findOne({_id:id});
        console.log(user);
        return user.role !== "admin" ? next(new CustomError("Only Admins Can Access This Route!",403)):next();
    })
}