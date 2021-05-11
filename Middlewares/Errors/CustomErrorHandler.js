const CustomError = require("../../Helpers/Custom Error/CustomError");

//ERROR MIDDLEWARE
module.exports = {
    customErrorHandler:(err,req,res,next)=>{
        //New error class from the CustomError class. (errorTest) middleware
        let customError = err;
        console.log(customError.name);
        console.log(customError.message);
        //Gelen Error Adina gore hata error handling
        switch(customError.name){

            case "Error":
                customError = new CustomError(customError.message,customError.status);
                break;

            case "SyntaxError":
                customError = new CustomError("Unexpected Syntax",400);
                break;

            case "ValidationError":
                customError = new CustomError(customError.message,400);
                break;
            
            case "RegisterationError":
                customError = new CustomError(customError.message,400);
                break;

            //MongoDB ObjectID error
            case "CastError":
                customError = new CustomError("Please provide a valid id.",400);
                break;

            //MongoDB Error
            case "MongoError":
                if(customError.message.includes("E1100")){
                    //E1100 => MongoDB error for duplicates values in db
                    customError = new CustomError("You are trying to create something already exists!",400);
                }
                break;

            default:
                customError = new CustomError("Internal Service Error",500)
        }

        //400=> BAD STATUS
        res.status(customError.status).json({
            success:false,
            message:customError.message
        })
    }
}
