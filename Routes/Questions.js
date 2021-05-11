const express = require("express");
const QuestionRoute = express.Router();
const {getAccessToRoute} = require("../Middlewares/Authorization/auth")
const {getAllQuestions,createQuestion} = require("../Controllers/Questions");

QuestionRoute.post("/ask",getAccessToRoute,createQuestion); // In orde to ask the question you have to be logged in (TOKEN)
QuestionRoute.get("/",getAllQuestions);

module.exports = QuestionRoute;