const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=5000;
const {MONGOURI}=require("./keys");
const Post=require("./models/post");
const Chat=require("./models/chat");
const {JWT_SECRET}=require("./keys");
const jwt=require("jsonwebtoken");
const User=mongoose.model("User");
const cors=require("cors")
// Chat=mongoose.model("Chat");
app.use(cors());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Origin","Origin,X-Requested-With,Context-Type,Accept,Authorization"
        
)
res.header("Access-Control-Allow-Methods","GET,PUT,PATCH,POST,DELETE,OPTIONS");
next();
})
 mongoose.connect(MONGOURI,{
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useFindAndModify:false
});
mongoose.connection.on("connected",()=>{console.log("connected to mongo")})
mongoose.connection.on("error",(err)=>{console.log("error connecting",err)})

require("./models/user");

app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))


const server=app.listen(port,()=>{console.log(`server is running at ${port}`)});
const io=require("socket.io")(server)

io.use(async(socket,next)=>{
   try{
    const token=socket.handshake.query.token;
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){console.log(err,"B")}
     userId=payload._id;
 

     next();
  
    })
    const user=await User.findOne({_id:userId})
    const Uname=user.name
   }
   catch(err){console.log(err)}
})
var connectedUsers=[];
io.on("connection",(socket)=>{
    console.log("Connected: "+userId)

    socket.on("disconnect",()=>{
        console.log("Disconnected: "+userId)
    })

    socket.on("register",function(myid){
        connectedUsers[myid]=socket;
      // connectedUsers.push(myid)
    })

socket.on('private_chat',function(data){
        console.log(data)
        const to = data.to,
                msg = data.msg,
              from=data.from;
var chat={message:msg,sendBy:to}
options = { upsert:true, new:true,setDefaultsOnInsert:true }
Chat.findOneAndUpdate( {sender:from,receiver:to},{
    "$push":{"msg":chat}
},options).exec((err,result)=>{ 
       if(err){
     return res.status(422).json({error:err})
    }else{
    console.log(result)
   }
})

        if(connectedUsers.hasOwnProperty(to)){
            connectedUsers[to].emit('private_chat',{
                
                created_at:Date.now(),
                message : msg,
                sendBy:{
                    name:Uname,
                    _id:userId
                }
            });
        }
    
    });
})