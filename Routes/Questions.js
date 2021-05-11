const express = require("express");
const QuestionRoute = express.Router();
const {getAccessToRoute,getQuestionOwnerAccess} = require("../Middlewares/Authorization/auth")
const {getAllQuestions,createQuestion,getQuestionByID,editQuestion,deleteQuestion,likeAQuestion,dislikeAQuestion} = require("../Controllers/Questions");

QuestionRoute.get("/dislike/:id",getAccessToRoute,dislikeAQuestion);
QuestionRoute.get("/like/:id",getAccessToRoute,likeAQuestion);
QuestionRoute.delete("/question/:id",getAccessToRoute,getQuestionOwnerAccess,deleteQuestion);
QuestionRoute.put("/question/:id",getAccessToRoute,getQuestionOwnerAccess,editQuestion); //We should have access token (logged in ) to make changes
QuestionRoute.get("/question/:id",getQuestionByID);
QuestionRoute.post("/ask",getAccessToRoute,createQuestion); // In orde to ask the question you have to be logged in (TOKEN)
QuestionRoute.get("/",getAllQuestions);

module.exports = QuestionRoute;