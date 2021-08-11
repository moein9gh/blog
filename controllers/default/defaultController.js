const bcrypt=require("bcrypt")

const Post=require("../../models/postSchema")
const Category=require("../../models/categorySchema")
const User=require("../../models/userSchema")
const Comment=require("../../models/commentSchema")
const {Salt}=require("../../conf/configuration")

module.exports.indexRoute=(req,res)=> {

        Post.find().then(posts => {
                Category.find().then(categories => {
                        res.render("default/index.ejs",{posts,categories})
                }).catch(err=>{
                        console.log(err)
                })

        }).catch(err => {
                console.log(err)
        })
}

module.exports.getSinglePost=(req, res)=>{
        const id=req.params.id
        Post.findById(id)
            .populate("comments").then(post=>{
                if(!post)
                        res.status(404).json({msg:"page not found"})
                Category.find().then(categories => {
                        res.render("default/singlePost.ejs",{post,categories})
                }).catch(err=>{
                        console.log(err)
                })
        }).catch(err=>{
                console.log(err)
        })
}

module.exports.postSubmitComment=(req,res)=>{
        if(req.user){
               Post.findById(req.params.id).then(post=>{
                       const body = req.body.commentBody
                       const user = req.user._id
                       const newComment = new Comment({body, user})
                       post.comments.push(newComment)
                       post.save().then(result=>{
                               newComment.save().then(comment=>{
                                       res.redirect(`/detail/${post._id}`)
                               }).catch(error=>{
                                       console.log(error)})
                       }).catch(err=>{
                               console.log(err)})
               }).catch(err=>{
                       console.log(err)
               })
        }
        else {
                res.redirect("/login")
        }
}

module.exports.getLogin=(req,res)=>{
        res.render("default/login.ejs")
}

module.exports.getRegister=(req,res)=>{
        res.render("default/register.ejs",{
                errors:null,
                firstName:null,
                email:null,
                lastName:null,
        })
}

module.exports.postRegister=(req,res)=>{
        let errors=[]
        if(!req.body.firstName){
                errors.push({message:"first name is required"})
        }
        if(!req.body.lastName){
                errors.push({message:"last name is required"})
        }
        if(!req.body.email){
                errors.push({message:"email is required"})
        }
        if(req.body.password !== req.body.passwordConfirm){
                errors.push({message:"password not match"})
        }
        if (errors.length>0){
                res.render("default/register",{
                        errors,
                        firstName:req.body.firstName,
                        email:req.body.email,
                        lastName:req.body.lastName,
                })
        }else{
                User.findOne({email:req.body.email}).then(user=>{
                        if(user){
                                res.redirect("/login")
                        }
                        else {
                                const newUser=new User(req.body)
                                bcrypt.genSalt(Salt,(err,salt)=>{
                                        bcrypt.hash(newUser.password,salt,(er,hash)=>{
                                                newUser.password=hash
                                                newUser.save().then(result=>{
                                                        res.redirect("/login")
                                                }).catch(error=>{
                                                        console.log(error)
                                                })
                                        })
                                })
                        }
                })
        }
}

module.exports.postLogin=(req,res)=>{
       res.send("ooook")
}

module.exports.logOut=(req,res)=>{
        req.logOut()
        res.redirect("/")
}