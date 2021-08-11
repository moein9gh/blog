const mongoose=require("mongoose")
const Schema=mongoose.Schema

const Comment=new Schema({
    body:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    isApproved:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})
module.exports = mongoose.model("Comment", Comment)