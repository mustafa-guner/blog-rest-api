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

    likeAQuestion: asyncHandler(async(req,res,next)=>{
        //Inorder to like the question we have to get the ID
        const {id} = req.params; //Question ID
        const userId = req.user.id;
        const question = await Question.findById(id);

        if(!question) return next(new CustomError("Question is not found!",404));
        console.log(question.likes)
        if(question.likes.includes(userId)){
           return next(new CustomError("You have already liked it!",404));
        }
        //Like the question
        question.likes.push(userId);

        //We saved the updates.
        await question.save();

        //We are going to write a condition that checks user if already liked it
        res.status(200).json({
            data:question
        })
       

    }),


    dislikeAQuestion: asyncHandler(async(req,res,next)=>{
        const {id} = req.params;

        const question = await Question.findById(id);

        if(!question.likes.includes(req.user.id)){
            return next(new CustomError("You did not even like it! You cant dislike!",400));
        }

        //We are detecting the ID index
        const index = question.likes.indexOf(req.user.id);
        question.likes.splice(index,1);

        await question.save();

        return res.status(200).json({
            success:true,
            message:"You disliked the question.Are you happy?",
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






