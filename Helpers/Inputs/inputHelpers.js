
const bcrypt = require("bcryptjs");

module.exports = {

    handleInputs:(email,password)=>{
        return email && password;
    },

    comparePasswords:(password,hashedPassword)=>{
        console.log(password,hashedPassword)
       return bcrypt.compareSync(password,hashedPassword);
    }

}