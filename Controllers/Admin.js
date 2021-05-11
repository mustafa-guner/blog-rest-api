const asyncHandler = require("express-async-handler");
const CustomError  =require("../Helpers/Custom Error/CustomError");
const User = require("../Models/User");

//We are going to create BLOCK USERS and DELETE USER/USERS funcitons in ADMIN

module.exports = {

    //Get Admin Page
    getAdminPage:asyncHandler(async(req,res,next)=>{
        res.status(200).json({
            success:true,
            message:"Welcome! Admin"
        })
    }),

    blockUser: asyncHandler(async(req,res,next)=>{
        //We should get the id from params
        const {id} = req.params;

        //Check the params if it is valid user id
        const user = await User.findById(id);
        if(!user) return next(new CustomError("User couldnt find",400));

        //We are blocking / unblocking the user
        //If the user is already blokced then UNBLOCK it
        user.blocked = !user.blocked;

        //Save the changes
        await user.save();

        //Response Feedback
        res.status(200).json({
            success:true,
            message:"User block-unblocked succesfuly.",
            data:user
        })
    }),

    deleteUser: asyncHandler(async(req,res,next)=>{
        //INORDER TO DELETE A USER WE SHOULD GET ID FROM PARAMS
        const {id} = req.params;

        //Find the user and test the user exists or not
        const user = await User.findOne({_id:id});
        console.log(user);
        if(!user) return next(new CustomError("User Couldnt Found",400));

        //Delete user
        await user.remove();

       

       return res.status(200).json({
            success:true,
            message:"User is deleted from the database",
            deletedUser: user
        })

    })
}