const mongoose=require("mongoose")
const Schema=mongoose.Schema

const Post=new Schema({
    title:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"public"
    },
    description:{
        type:String,
        required:true
    },
    allowComments:{
        type:Boolean,
        default:false
    }
    ,user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }],
    file:{
        type:String,
        default:''
    }
},{
    timestamps:true
})
module.exports = mongoose.model("Post", Post)