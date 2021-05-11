const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please provide a title"],
        minlength:[10,"Please provide a a title at least 10 char."],
        unique: true,
    },

    content:{
        type:String,
        required:[true,"Please provide a content"],
        minlength:[10,"Please provide at least 10 char content."],
    },
    slug:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },

    //Tabloyla kullanicilarini birbirine baglamak icin REFERANS VERDIk
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User" //User modelini referans verdik (JOIN)
    }
});

module.exports = mongoose.model("Question",schema);