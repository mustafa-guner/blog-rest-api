
const mongoose = require("mongoose");

module.exports = {

    //Connect to the database
    connection: async (db)=>{
        try{
            await mongoose.connect(db,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex:true,
                useFindAndModify:false
            });
            console.log("Connected to database succesfuly.");
        }
        
        catch(err){
            console.log(err);
        }
    }

}
