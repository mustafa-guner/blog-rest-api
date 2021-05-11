const express = require("express");
const AuthRoute = express.Router();
const {getRegisterPage,getUser,login,logout,imageUpload,forgotmypassword,resetPassword,editInformations} = require("../Controllers/Auth");
//Korumak Istedigimiz Routelara uygulanacak!!!
const {getAccessToRoute} = require("../Middlewares/Authorization/auth");
const {profileImageUpload} = require("../Middlewares/library/imageUpload");

//Home Page
AuthRoute.post("/register",getRegisterPage);
AuthRoute.post("/login",login);
AuthRoute.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload) //Image upload yapmak icin LOgin olmak lazim (Token LAZIM - MIDDLEWARE)
//single => tek bir fotograf gonderecegimizden dolayi belirtmemiz lazim
//single("photo_image") => client-side'dan gelen key(id).Belirtmek lazim

AuthRoute.put("/edit",getAccessToRoute,editInformations);//Editlemek icin bilgileri giris yapilmis olunmasi lazim buyuzden TOKEN (middlware)
AuthRoute.put("/resetpassword",resetPassword);
AuthRoute.post("/forgotpassword",forgotmypassword); 
AuthRoute.get("/logout",getAccessToRoute,logout);  //Logout olmak icin once login olunmali yani token olmali (middleware)
AuthRoute.get("/profile",getAccessToRoute,getUser); //Profile sayfasina ulasilmasi icin once Login olunmali (middleware)

module.exports = AuthRoute;