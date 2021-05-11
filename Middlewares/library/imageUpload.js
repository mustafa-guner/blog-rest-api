//MULTER
//Multer, sisteme dosya,video,forograf kisacasi belge yuklemek icin gerekli olan bir pakettir.
//Biz kullanim amacimiza uygun olmasi acisindan kendi icerisinde bulunan filter ozelligi ile sadece
//png jpg ve jpeg gibi resim belgelerinin yuklenmesine izin verecegiz.

const multer = require("multer");
//Kullanilmamasi gereken belge turu icin custom error donelim
const CustomError = require("../../Helpers/Custom Error/CustomError");
const path = require("path");



 //multers disk storage setting //KAYIT AYARLARI / KAYDETME AYARLARI
const storage = multer.diskStorage({ 
    //WHERE THE IMAGE FILE IS GOING TO BE SAVED
    destination: function(req,file,cb){
        const rootDir = path.dirname(require.main.filename); // => this points server.js (where the app is running)
          //Ilk parametre hata varsa err yoksa nul
        //ikinci paramtere yuklenilecek yer
        cb(null,path.join(rootDir,"public/uploads"));
    },

    //DETERMINES THE FILE NAME (best choice is give names according to user id)

    filename: function(req,file,cb){
        req.savedImage = file.fieldname  + req.user.id;
        console.log(req.savedImage);
        cb(null,req.savedImage) //user id olsun resimlerin adlari
    }
});


//Multer Settings //MULTER AYARLARI / FILTRELEME vs
const upload = multer({
    storage:storage,

    //Restrict the file extension (png,jpeg,jpg and giff only valid ones)
    fileFilter: function(req,file,cb){
        //Declaring the extension of the file
        //path.extname => Returns the file extension no matter how long the file root is. (e.g C:/deneme/users/uploads/deneme.js) => .js
        const extension =   path.extname(file.originalname);
        const validExtensions = [".png",".jpeg",".jpg",".gif"];
        if(!validExtensions.includes(extension)){
            return cb(new CustomError("Please provide valid image extension.",400),false);
        } else{
            return(cb(null,true));
        }
    }
})

//OUR CONFIGURATION OF THE MULTER IS DONE!
//LETS CREATE A MIDDLEWARE FOR IMPLEMENT it to ROUTE

module.exports = {
    //Middleware
    profileImageUpload: multer(upload)

}