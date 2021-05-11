

module.exports = {
    sendJwtToClient: (user, response) => {
        //Generate JWT
        //After creation of user we have to initialize the jwt token
        const token = user.generateJwtFromUser();
        console.log(token); 

        const {JWT_COOKIE,NODE_ENV} = process.env; 

        return response.status(200).cookie("access_token",token,{
            httpOnly:true,
            expires:new Date(Date.now()+parseInt(JWT_COOKIE) + 1000 * 60),
            secure:NODE_ENV === "development" ? false : true
        })
        .json({
            success:true,
            access_token:token,
            data:{
                name:user.name,
                email:user.email
            }
        })
    },

    //Authorizationlar icin gerekli fonksoyonlar

    //Kullanici Tokensiz ise yani Headers Authorization undefined ise
    isTokenIncluded: (req)=>{
        //Eger yerlestirilmemisse HATA
        return req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        
    },

    getAccessTokenFromHeader:(req)=>{
        const authorization = req.headers.authorization;
        const access_token = authorization.split(" ")[1];
        return access_token;
    }
}