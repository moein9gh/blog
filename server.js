/* import required packages */
const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const session=require("express-session")
const fileUpload=require("express-fileupload")
const passport=require("passport");


const conf =require("./conf/configuration")
const defaultRoutes=require("./routes/default/defaultRoutes")
const adminRoutes=require("./routes/admin/adminRoutes")
const {globalVar} = require("./conf/configuration");
const app=express()

/* mongo configures */
mongoose.connect(conf.mongoURL,
    {useNewUrlParser:true,useUnifiedTopology: true })
    .then(()=>{
        console.log("mongodb connected.")
    })
    .catch(err=>{
        console.log(err,"cant connect to mongodb.")
    })

/*
template engine
 */

app.set('view engine', 'ejs');


/* express configures */
app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

/*
session
 */

app.use(session({
    secret:"anysecret",
    saveUninitialized:true,
    resave:true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(((req, res, next) => {
    globalVar(req,res,next)
}));

/*
file upload conf
 */

app.use(fileUpload({}))

/*
routes
 */

app.use("/",defaultRoutes)


app.use("/admin",adminRoutes)





/* listen to port */
app.listen(conf.PORT,()=>{
    console.log(`server is runnin on port ${conf.PORT}`)
})