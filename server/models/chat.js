const mongoose=require("mongoose");
const {ObjectId}= mongoose.Schema.Types;
const User=require("../models/user");

const chatSchema=new mongoose.Schema({
    sender:{
        type:ObjectId,
        ref:"User"
    },
    receiver:{
        type:ObjectId,
        ref:"User"
    },
    msg:[{
       message:{type:String,required:true},
       created_at: { type: Date, required: true, default: Date.now },
       sendBy:{type:ObjectId,ref:"User"}
    }]
   
   
})
const Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;