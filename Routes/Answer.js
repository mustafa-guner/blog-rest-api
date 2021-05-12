const express = require("express");
const AnswerRouter = express.Router({mergeParams:true});
const {addNewAnswerToQuestion,getAnswers,updateAnswer,deleteAnswer} = require("../Controllers/Answer")
const {getAccessToRoute,getAnswerOwnerAccess} = require("../Middlewares/Authorization/auth");
//Answer route alt tabaka bir router oldugundan dolayi yani onunde middleware oldugundan kaynakli
//express js'in dogasi geregi malesef "/:id/answers" kismina ulasamaz.(req.params) ulasabilmesi icin bunu expresse bildirmemiz lazim
//Bildirmek icin yukardaki gibi router icerisine {mergeParams:true} yazilmadilidr

AnswerRouter.delete("/:_id/delete",getAccessToRoute,getAnswerOwnerAccess,deleteAnswer);
AnswerRouter.put("/:_id/edit",getAccessToRoute,getAnswerOwnerAccess,updateAnswer);
AnswerRouter.post("/",getAccessToRoute,addNewAnswerToQuestion);
AnswerRouter.get("/",getAnswers);


module.exports = AnswerRouter;