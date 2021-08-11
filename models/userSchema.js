const mongoose=require("mongoose")
const Schema=mongoose.Schema

const User=new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        default:"public"
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        default:false
    }
},{
    timestamps:true
})
module.exports = mongoose.model("User", User)