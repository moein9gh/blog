module.exports={
    isEmpty:(obj)=>{
        for( let key in obj){
            if(obj.hasOwnProperty("key"))
                return false
        }
        return true
    },
    isUserAuthenticated:(req,res,next)=>{
        if(req.isAuthenticated()){
            next()
        }
        else {
            res.redirect('/login');
        }
    }
}