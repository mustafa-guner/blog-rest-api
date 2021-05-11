const express = require("express");
const {getUserById,getAllUsers} = require("../Controllers/User");
const UserRouter = express.Router();

// /users
UserRouter.get("/",getAllUsers);
UserRouter.get("/:id",getUserById);

module.exports = UserRouter;