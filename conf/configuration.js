module.exports={
    mongoURL:"your connection string",
    PORT:process.env.PORT || 3000,
    Salt:10,
    globalVar:(req,res,next)=>{
        res.locals.user= req.user||null
        next()
    }
}
