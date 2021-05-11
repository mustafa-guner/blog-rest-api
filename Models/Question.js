const mongoose = require("mongoose");
const slugify = require("slugify");

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
    },

    //Bu Soryua birden fazla like gelebileceginden kaynakli bunu array yaptik obje deigil
    likes:[//Likes islemesi icin USER ile bagladik. 
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        } 
    ]
});

//We have to create a PRE hooks for the slugify process (our question should look like that in params (asked-question-mongodb))
schema.pre("save",function(next){

    //We have to check the question when its informations updated is title changed as well?
    if(!this.isModified("title")){
        next();
    }

    this.slug = this.makeSlug();
    next();
});

schema.methods.makeSlug = function(){
   return slugify(this.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: false,      // convert to lower case, defaults to `false`
      })
}


module.exports = mongoose.model("Question",schema);