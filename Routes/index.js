const express = require("express");
const router = express.Router();
const questions = require("./Questions");
const auth  = require("./Auth");
const users = require("./User");
const admin = require("./Admin");

//Server js icerisinde bu routelama islemini
//yapmaktansa index.js adli dosya icerisinde
//duzenlemek kodu daha okunmasi kolay bir hale getirecektir

router.use("/questions",questions);
router.use("/auth",auth);
router.use("/users",users);
router.use("/admin",admin);

module.exports = router;

