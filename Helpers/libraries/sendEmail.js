const nodemailer = require("nodemailer");

//Inorder to send emails from application
//We have to set 3 options

//We should have;
//Transporter,
//Transport,
//Defaults (Options)

//This process is also requires async functions so;

const sendEmail = async(mailOptions)=>{
    //Create Transport
    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    });

    //MailOptions:
    //Email'in kimden geldigi
    //Kime Gittigi
    //Basliginin ve iceriginin ne oldugu
    //HTML'i bu kisimda yer alacak
    let info = await transporter.sendMail(mailOptions);
    console.log(`Message Sent: ${info.messageId}`)
};

module.exports = {
    sendEmail
};


