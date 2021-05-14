const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const requiredlogin = require("../middleware/requiredlogin");
const Post=mongoose.model("Post");
const Chat=mongoose.model("Chat");
//require("../models/chat");

 router.get("/allpost",requiredlogin,(req,res)=>{
     Post.find().populate("postedBy","_id name")
     .populate("comments.postedBy","_id name")
     .sort("-createdAt")
     .then(posts=>{
       
        res.json({posts})})
     .catch((err)=>{console.log(err)})
 })
 router.get("/getsubpost",requiredlogin,(req,res)=>{
     Post.find({postedBy:{$in:req.user.following}})
     .populate("postedBy","_id name")
     .populate("comments.postedBy","_id name")
     //.sort("-createdAt")
     .then(subposts=>{
       // console.log(subposts)
        Post.find({postedBy: {$in: req.user._id }})
        .populate("postedBy", "_id  name")
        .populate("comments.postedBy","_id name")
       // .sort("-createdAt")
        .exec((err,mypost)=>{
            const posts = [ ...subposts, ...mypost ]
            function cs(a,b){
                return new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime()
            }
            const post=posts.sort(cs).reverse()
            if(err){
                return res.status(422).json({error:errb})
            }
          
        res.json({post})})
     })
     .catch((err)=>{console.log(err)})
 })  

router.post("/createpost",requiredlogin,(req,res)=>{
    const {title,body,pic}=req.body;
    if(!title || !body ||!pic){
        return res.status(422).json({error:"please add the fields"})
    }
    // console.log(req.user)
    // res.send("ok");
    req.user.password=undefined;
    const post=new Post({
     title,
      body,
      photo:pic,
     postedBy:req.user
    })
    post.save().then((result)=>{
res.json({post:result})
    }).catch(err=>{
        console.log(err);
    })
})

router.get("/mypost",requiredlogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch((err)=>{
     console.log(err);
    })
})
router.put("/like",requiredlogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true}).exec((err,result)=>{
       if(err){
           return res.status(422).json({error:err})
       }else{
            res.json(result)
       } 
    })
})
router.put("/unlike",requiredlogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true}).exec ((err,result)=>{
       if(err){
           return res.status(422).json({error:err})
       }else{
           res.json(result)
       } 
    })
})
router.put("/comment",requiredlogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
   
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy", "_id  name")
    .exec((err,result)=>{ 
       
       if(err){
        return res.status(422).json({error:err})
       }else{
        res.json(result)
          
       } 
    })
})
router.delete("/deletepost/:postId",requiredlogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            console.log("hi")
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
               
                console.log(err)
            })
        }
    })
})
 router.delete("/deletecomment/:postId/:commentId",requiredlogin,(req,res)=>{


Post.findByIdAndUpdate(
    req.params.postId,{$pull:{comments:{_id:req.params.commentId}}},{new:true})
    .populate("comments.postedBy","_id name")
    .populate("postedBy", "_id  name")
    .exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
       
         res.json(result)
    } 
 })

 
 })

 router.put("/sendmessage",requiredlogin,(req,res)=>{
     const {senderId,receiverId,msg}=req.body
         var chat={message:req.body.msg,sendBy:senderId}
        
    //  var query = {sender:senderId,receiver:receiverId},
    // update = {msg:msgId},
     options = { upsert:true, new:true,setDefaultsOnInsert:true }
   
    Chat.findOneAndUpdate( {sender:senderId,receiver:receiverId},{
        "$push":{"msg":chat}
    },options).populate("msg.sendBy","name").exec((error, result)=> {
        if (error)
        {console.log(error)}   
        else{ 
          
             res.json(result.msg.slice(-1)[0])
        }  
         });
   
 })
 router.get("/allmessage/:senderId/:ID",requiredlogin,(req,res)=>{
    Chat.find({$or: [{
		sender:req.params.senderId,
		receiver:req.params.ID
	},{
		sender:req.params.ID,
		receiver:req.params.senderId
	}]})
    .populate("msg.sendBy","name") .sort("msg.created_at")
    .then(mymsg=>{
        function cs(a,b){
            return new Date(a.created_at).getTime()-new Date(b.created_at).getTime()
        }
       const A=[]
       mymsg.map(item=>item.msg.map(item=>A.push(item)))
      
        const B=A.sort(cs)
        res.json({B})
    })
    .catch((err)=>{
     console.log(err);
    })
})
module.exports=router;