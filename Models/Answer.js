const mongoose = require("mongoose");
const Question = require("./Question");
const asyncHandler = require("express-async-handler")

const schema = mongoose.Schema({

    // title:{
    //     type:String,
    //     required:[true,"Please provide a title"]
    // },

    content: {
        type: String,
        required: [true, "Please provide a content"]
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    //Answer should has owner 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },

    //Answer can have LIKES
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true // User sart
        }
    ],

    //Answer is belongs to A QUESTION
    question: {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
        required: true
    }


});


//Answer yaratildiktan sonra ilgili question icerisine atmak icin bu cevabi hooks gullan
//savelendikden once => pre.save

//NOT:Bu fonksiyon her save isleminde calisacak
//bu yuzden user modified edilmediysa kosulu yarat
schema.pre("save", async function (next) {
    if (!this.isModified("user")) {
        next();
    }

    try {
        //Question icerisine ekleme islemi
        const question = await Question.findById(this.question);
        question.answers.push(this._id);

        await question.save();
        next();
        
    } catch(err){
        next(err);
    }
    
});

module.exports = mongoose.model("Answer", schema);