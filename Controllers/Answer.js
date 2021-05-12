const Question = require("../Models/Question");
const Answer = require("../Models/Answer");
const CustomError = require("../Helpers/Custom Error/CustomError");
const asyncHandler = require("express-async-handler");

module.exports = {

    addNewAnswerToQuestion: asyncHandler(async(req,res,next)=>{

        //Add Anser Model
        const {id} = req.params;
        const userId = req.user.id;
        const information = req.body;

        const answer = await new Answer({
            ...information,
            //Answer icerisindeki question alanina gelen idyi verdik
            question:id,
            //Answer icerisinde user alanina user id verdik
            user:userId
        });

        //Save answer
        await answer.save();

        res.status(200).json({
            success:true,
            message:"Question answered",
            data:answer
        });
    }),

    getAnswers:asyncHandler(async(req,res,next)=>{
        //We got the id from params
        const {id} = req.params;

        const question = await Question.findById(id).populate("answers");
        const answers = question.answers;

        res.status(200).json({
            success:true,
            count:answers.length,
            //Burdaki answers questiondan gelen answeres oldugu icin contente ulasamayik.
            //Assagidaki gibi denendiginde null doner.
            //Ancak bize mongonun sundugu populate("MODE_NAME") metodunu gullanabilirik.
            //Amacimiza yonelik olarak =>  const question = await Question.findById(id).populate("answers");
            //Yukardaki kod bize Answer modelinin oldugu gibi tum ozelliklerini getirdi artik contetni alabilirizzz

           // answers: answers.map(answer=>answer.content)

           data:answers //tum ozelliklerini donecek
        })

    }),

    updateAnswer:asyncHandler(async(req,res,next)=>{
        const{id} = req.params;
        const information = req.body;
        const answer = await Answer.findOneAndUpdate(id,information,{
            new:true,
            runValidators:true
        });

        if(!answer) return next(new CustomError("Answer couldnt find!",400));

        res.status(200).json({
            success:true,
            message:"Answer edited",
            data:answer
        })
    }),

    deleteAnswer:asyncHandler(async(req,res,next)=>{
        const {id} = req.params;
        const {_id} = req.params;

        console.log(id)
        console.log(_id)
        await Answer.findOneAndRemove(_id);
        const question = await Question.findById(id);
        console.log(question        )
        question.answers.splice(question.answers.indexOf(_id),1);

        return res.status(200).json({
            success:true,
            message:"Answer is deleted",
        })
    })
}