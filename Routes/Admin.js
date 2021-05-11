const express = require("express");
const AdminRouter = express.Router();
const {getAccessToRoute,getAdminAccess} = require("../Middlewares/Authorization/auth");
const {getAdminPage,blockUser,deleteUser} = require("../Controllers/Admin");
//Icluding our tokenAccess middleware and admin middleware

//We are going to create a middleware that confirms the user is ADMIN if its not then error will be thrown
AdminRouter.use([getAccessToRoute,getAdminAccess]); //User should pass both to get route

AdminRouter.get("/",getAdminPage);
AdminRouter.get("/block/:id",blockUser);
AdminRouter.delete("/user/:id",deleteUser);

module.exports = AdminRouter;