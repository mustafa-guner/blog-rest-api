const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//"Both pre and post hooks need to be added to the schema before registering the model in the file." a NOTE from DEV.TO
//Salt and hashing the password for the secure database information.
//We have to do that process BEFORE the data saved into database.
//We have to use Mongoose HOOKS. (pre-post)

const jwt = require("jsonwebtoken");

//Forgot my password reset
const crypto = require("crypto");

//Question modelini dehil ediyoruz
//NEDENI: DELETE ON CASCADE =>Bir kullanici silindiginde o kullaniciyla iliskili sorularinda silinmesi gerekir.
//Bu yuzden post hook ekleylim user shcmeaya. 
//---------------------------HOOKS---------------------------------------------------------------
//(Routelarda silerken kullaniciyi .remove() kullandik.Bu yuzden schema.post("remove") kullanacayik)
//(Routelarda savelerlen kullaniciyi .save() kullandik.Bu yuzden schema.pre("save") kullanacayik)
const Question = require("./Question");


//Creation of the USER MODEL (DEFINITION)
const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide an email."],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please a provide a valid email."],
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]// Role turlerindeki olasliklari belirtmek icin enum kullanilir.
    },
    password: {
        type: String,
        minlength: [6, "Password should more than 6 chars."],
        required: [true, "Please provide a password."],
        select: false //Database'den GET ile user cekerken passwordun gorulmesini engeller
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    // User profile informations
    title: {
        type: String,
    },

    about: {
        type: String
    },

    location: {
        type: String
    },

    website: {
        type: String
    },

    profilImage: {
        type: String,
        default: "default.png"
    },

    blocked: {
        type: Boolean,
        default: false
    },

    resetPasswordToken:{
        type:String
    },

    resetPasswordExpire:{
        type:Date
    }

});
//Schema Methods for JWT
schema.methods.generateJwtFromUser = function(){
    //STEPS
    //1- Create a secret key and expire date in dotenv config file
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env; 

    //2- Create a payload object (from user)
    const payload = {
        id:this.id,
        name:this.name
    }

    //3-Create a token for generate 
    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn:JWT_EXPIRE
    });

    return token;

}

//Creating a user schema method for the forgot password
schema.methods.getResetPasswordTokenFromUser = function(){
    //STEPS
    //GENERATE RANDOM STRING WITH CYRPTO
    const randomHexString = crypto.randomBytes(15).toString("hex");
    
    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(process.env.RESET_PASSWORD_EXPIRE); // Password degismek icin gerekli sure 1 saat
    
    return resetPasswordToken;
}


//PRE HOOKS (ssave  hoook)
// WE HAVE TO HANDLE THE HASH OF PASSWORD BEFORE IT SAVED SO WE USE HOOKS (PRE HOOK here)
schema.pre("save", async function (next) {
    //Kullaniciya update yaptigimiz zaman burasi yine calisacagindan eger password degismemisse ben bastan hashlenmesini istemiyorum
    //EGER PASSWORD DEGISMEMISSE => Mongoose'un sagladigi isModified functionu kullandik.
    if (!this.isModified("password")) {
        next();
    }
    try {
        //If we type the only hash it does the salt and hash at the sametime.
        //10 is kind of speed of process.It neither too fast or too slow to be secure. 10 is just fine.
        const bcryptedPassword = await bcrypt.hash(this.password, 10);
        this.password = bcryptedPassword;
        next();
    }
    catch (err) {
        next(err);
    };
});


//PRE HOOKS (ssave  hoook)
//This is post (after) hook so we dont go there next thats why we dont pass next into parameter
schema.post("remove",async function(){

    //Delete all question on REMOVE that is releated with user id
   await Question.deleteMany({
        user:this._id
    })
})


module.exports = mongoose.model("User", schema);