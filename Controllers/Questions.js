const asyncHandler = require("express-async-handler");
const Question = require("../Models/Question");
const CustomError = require("../Helpers/Custom Error/CustomError");

module.exports = {

    createQuestion: asyncHandler( async (req,res,next)=>{
        
        //We have to create a question from the req.body ({title,content e.g})
        const informations = req.body;

        //Create question
        const question = await new Question({
            ...informations,
            //We have to know which user is going to post this question (take the user id from request)
            user:req.user.id
        })

        //SAVE QUESTION
        await question.save();

        res.status(200).json({
            success:true,
            message:"Question is created succesfuly",
            data:question
        })

    }),

    getAllQuestions: (req,res,next)=>{
       res.status(200).json({
           message:"Questions are rendering",
           success:true
       })
    },
  
}






