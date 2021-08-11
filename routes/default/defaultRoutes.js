const express=require("express")
const passport=require("passport")
const localStrategy =require("passport-local").Strategy
const bcrypt =require("bcrypt")

const User=require("../../models/userSchema")
const router=express.Router()
const defaultController=require("../../controllers/default/defaultController")
const {isUserAuthenticated} = require("../../conf/customFunctions");
router.all("/admin",(req, res, next) => {
    isUserAuthenticated(req,res,next)
    next()
})

router.all("/",(req,res,next)=>{
    req.app.locals.layout="default"
    next()
})
router.get("/",defaultController.indexRoute)

passport.use( new localStrategy({
    usernameField:"email",
    passReqToCallback:true
},(req,email,password,done)=>{
    User.findOne({email}).then(user=>{
        if(!user){
            return done(null,false)
        }else{
            bcrypt.compare(password,user.password,(err,passwordMatched)=>{
                if(err){
                    return err
                }
                if (!passwordMatched){
                    return done(null,false)
                }
                return done(null,user)
            })
        }
    })
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
})
router.get("/register",defaultController.getRegister)
router.get("/login",defaultController.getLogin)
router.get("/detail/:id",defaultController.getSinglePost)
router.post("/post/:id",defaultController.postSubmitComment)
router.post("/register",defaultController.postRegister)
router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true,
    session:true}), defaultController.postLogin)
router.get("/logout",defaultController.logOut)

module.exports=router