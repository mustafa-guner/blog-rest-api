const express = require("express");
const QuestionRoute = express.Router();
const {getAllQuestions} = require("../Controllers/Questions");

QuestionRoute.get("/",getAllQuestions);

module.exports = QuestionRoute;