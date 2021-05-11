const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bp = require("body-parser");
//Route (Routes / index.js)
const Route = require("./Routes/index");
const {customErrorHandler} = require("./Middlewares/Errors/CustomErrorHandler")

//Configuration Folder For The Variables
dotenv.config({
    path:path.join(__dirname,"/Config/env/config.env")
});

//Initializing the application (START)
const app = express();
//Third Party Middlewares
app.use(express.static(path.join(__dirname,"public"))); //Using static files by express.
app.use(bp.json());

//Server Variables
const PORT  = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECT;

//Import the database connection from HELPERS (MongoDB Connection)
const {connection} = require("./Helpers/Database/connectToDB");
connection(DB_CONNECTION);


//Route Middleware
app.use("/api/",Route);

//ERROR HANDLE
app.use(customErrorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    console.log(`Node Environment: ${process.env.NODE_ENV}`);
});