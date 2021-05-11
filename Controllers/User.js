const User = require("../Models/User");
const asyncHandler = require('express-async-handler');
const CustomError = require("../Helpers/Custom Error/CustomError");

module.exports = {

    getUserById: asyncHandler( async (req,res,next)=>{

        //Get ID from the params
        const {id} = req.params;

        const user = await User.findOne({_id:id});

        if(!user) return next(new CustomError("User coudlnt find!",404));

        res.status(200).json({
            success:true,
            message:"User fetched succesfuly",
            data:user
        })
    })
    ,

    getAllUsers: asyncHandler(async(req,res,next)=>{
        
        const users = await User.find({});
        res.status(200).json({
            success:true,
            message:"All Users Fetched From Database",
            datas:users
        })
    })
}