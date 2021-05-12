
const User = require("../Models/User");
const CustomError = require("../Helpers/Custom Error/CustomError");
const { sendJwtToClient } = require("../Helpers/Authorization/tokenHelpers");
const { handleInputs, comparePasswords } = require("../Helpers/Inputs/inputHelpers");
const { sendEmail } = require("../Helpers/libraries/sendEmail");

//AsyncHandler => Bir Fonksiyon icerisinde fazla async -await kullanacaksak try catch'e de ihtiyac duyariz
//Bu yuzden birden fazla yerde try cathc blocklari tekrar edilecek. Bu SOLID kavramina pek iyi bir ornek degil.
//Kodun duzenli olup rahat okunabilir olmasi ve DRY olmasi icin asynch-handler npm paketini kullandik.

//Bu fonksiyon wrapper function gorevi gorup icerisine yazilan tum asyn await yapilarina otomatik olarak arka planda
//try catch yapilarini implemente ederek bizi buyuk bir kod kalabaligindan ve karmasasindan kurtaracaktir.
//Catch de yakalanan errorleri ise next parametresi sayesinde bir sonraki middleware function olan customerror (errortest)
//middlwareina yollayacak ve erorumuzu gorebilecegiz.
const asyncHandler = require('express-async-handler');

module.exports = {
    getRegisterPage: asyncHandler(async (req, res, next) => {

        //Creating a new user from request body
        const { name, email, password, role } = req.body;

        //Check the user is already exists

        const user = new User({
            name,
            email,
            password,
            role
        });
        const savedUser = await user.save(); //Save'da promise doner. UNUTMA!!

        sendJwtToClient(savedUser, res);
    }),


    login: asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        //If the email and password fields are both filled
        if (!handleInputs(email, password)) {
            return next(new CustomError("Please check your input fields!", 400));
        }
        const user = await User.findOne({ email: email }).select("+password");

        if (!comparePasswords(password, user.password)) {
            return next(new CustomError("Please check your credentials!", 400))
        }

        sendJwtToClient(user, res);

    }),

    editInformations: asyncHandler(async (req, res, next) => {
       
         //We should take WHOLE user object from reqbody
         const updateInformations = req.body;

         //Search USER AND UPDATE
         const user = await user.findOneAndUpdate(req.user.id,updateInformations,{
             new:true,
             runValidators:true
         });

         if(!user) return next(new CustomError("User couldnt found!",400));

    
         return res.status(200).json({
             success:true,
             message:"User informations are updated..",
             updatedUser:user
         })

    }),

    logout: asyncHandler(async (req, res, next) => {

        //Get Environment Variables From Configuration Folder
        const { NODE_ENV } = process.env;

        return res.status(200)
            .cookie({
                httpOnly: true,
                expires: new Date(Date.now()),//It expires when it requested
                secure: NODE_ENV === "development" ? false : true
            })
            .json({
                success: true,
                message: "Logged out from account succesfuly."
            });

    }),

    forgotmypassword: asyncHandler(async (req, res, next) => {

        //Reset Email From Request Body
        const resetEmail = req.body.email;

        //Test the email if it is exist
        const user = await User.findOne({ email: resetEmail });

        //If user doesnt exist offer sign in 
        if (!user) return next(new CustomError("Email is doesnt exist! Do you want signin?", 400));

        //Update the password with schema method
        const resetPasswordToken = user.getResetPasswordTokenFromUser();

        //Update edilmis yeni password ile user savelendi
        await user.save();

        const resetPasswordURL = `http://localhost:3000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;


        const emailTemplate = `
        
        <h3>Reset Your Password</h3>

        <p>This is a <a href = "${resetPasswordURL}" target="_blank">Reset Password</a></p>

        <p>This is going to expired in 1 hr.</p>
        
        `

        try {
            await sendEmail({
                from: process.env.SMTP_USER,
                to: resetEmail,
                subject: "Reset Password",
                html: emailTemplate
            })
            //Send feedback
            return res.status(200).json({
                success: true,
                message: "Your token has sent your email."
            })
        }

        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            return next(new CustomError("Email couldnt sent", 500));
        }

    }),

    resetPassword: asyncHandler(async (req, res, next) => {
        //We have to get the token from the params
        const { resetPasswordToken } = req.query;

        //New Password:
        const { password } = req.body;

        if (!resetPasswordToken) return next(new CustomError("Please provide a valid token.", 400));

        let user = await User.findOne(
            {
                resetPasswordToken: resetPasswordToken,
                //ResetPasswordExpire eger suresi gecmis degilse sifre degisilsin (Date.nowdan daha buyuk olmasi lazim)
                resetPasswordExpire: { $gt: Date.now() }
            });

        if (!user) return next(new CustomError("User couldnt find.", 404));

        //Password changed
        user.password = password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password is changed succesfuly."
        })

    }),

    imageUpload: asyncHandler(async (req, res, next) => {
        //Image Upload Success
        //We have to update the user in database when user change his/her profile image
        const { id } = req.body;
        const user = await User.findOneAndUpdate({ id: id }, { profilImage: req.savedImage }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            message: "Image Upload Successful",
            data: user
        })
    }),

    getUser: (req, res, next) => {
        res.json({
            success: true,
            message: "Welcome!",
            data: {
                id: req.user.id,
                name: req.user.name
            }
        })
    }
}

