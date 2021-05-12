const express = require("express");
const QuestionRoute = express.Router();
const {getAccessToRoute,getQuestionOwnerAccess} = require("../Middlewares/Authorization/auth")
const {getAllQuestions,createQuestion,getQuestionByID,editQuestion,deleteQuestion,likeAQuestion,dislikeAQuestion} = require("../Controllers/Questions");

//Requiring the Answer Route here
const Answer = require("./Answer");

QuestionRoute.get("/dislike/:id",getAccessToRoute,dislikeAQuestion);
QuestionRoute.get("/like/:id",getAccessToRoute,likeAQuestion);
QuestionRoute.delete("/question/:id",getAccessToRoute,getQuestionOwnerAccess,deleteQuestion);
QuestionRoute.put("/question/:id",getAccessToRoute,getQuestionOwnerAccess,editQuestion); //We should have access token (logged in ) to make changes
QuestionRoute.get("/question/:id",getQuestionByID);
QuestionRoute.post("/ask",getAccessToRoute,createQuestion); // In orde to ask the question you have to be logged in (TOKEN)
QuestionRoute.get("/",getAllQuestions);

//We are going the create a middleware here that checks the params if has answer 
QuestionRoute.use("/:id/answers",Answer);
//We added this middleware end of the page because if we put this before all the routes they were not going to work
//This middleware would pretend them to not work

//We are importing Answer route here because we are not sending request seperately (one for answer or one for question)
//They have to fetched together.

module.exports = QuestionRoute;