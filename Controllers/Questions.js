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

    getAllQuestions: asyncHandler( async (req,res,next)=>{

        const questions = await Question.find({});

       res.status(200).json({
           message:"Questions are rendering",
           success:true,
           questions:questions
       })
    }),


    editQuestion:asyncHandler(async(req,res,next)=>{

        //We should take the QUESTION ID from the params and UPDATE AND USER AS WELL
        const {id} = req.params;

        //Take the informations from the request body (updates)
        const update = req.body;

        const question = await Question.findOneAndUpdate(id,update,{
            new:true,
            runValidators:true
        });

        if(!question) return next(new CustomError("Question is not found!",404));

        return res.status(200).json({
            success:true,
            message:"Question is updated",
            updatedQuestion:question
        });
    }),

    getQuestionByID: asyncHandler(async(req,res,next)=>{

        //GET ID FROM PARAMS
        const {id} = req.params;

        const question = await Question.findById(id);

        if(!question) return next(new CustomError("Question is not found!",404));

       return res.status(200).json({
            success:true,
            message:"Question is fetched",
            question:question
        })
    }),

    deleteQuestion: asyncHandler(async(req,res,next)=>{
        //GET ID
        const {id} = req.params;

        const question = await Question.findByIdAndDelete(id);
        
        if(!question) return next(new CustomError("Question is not found!",404));


        return res.status(200).json({
            success:true,
            message:"Question is deleted!",
            deletedQuestion:question
        });
        
    })
  
}






