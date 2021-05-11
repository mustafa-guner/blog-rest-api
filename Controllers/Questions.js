

module.exports = {
    getAllQuestions: (req,res,next)=>{
       res.status(200).json({
           message:"Questions are rendering",
           success:true
       })
    },
  
}






