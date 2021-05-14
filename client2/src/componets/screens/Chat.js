import React,{useState,useEffect,useContext} from 'react'
import {useLocation} from "react-router-dom"
import {UserContext} from "../../App"
import io from "socket.io-client"
import M from "materialize-css";

function Message() {
    const [data,setData]=useState([]);
    const {state,dispatch}=useContext(UserContext)
    let location = useLocation();
   const  textInput =React. createRef();
    const [msg, setMsg] = useState("")
    const [socket,setSocket]=useState(null)

    const setUpSocket=()=>{
      const token=localStorage.getItem("jwt")
      console.log("HHHH")
      if(token && !socket){
         const newSocket=io("http://localhost:3000",{
           query:{
               token:localStorage.getItem("jwt")
           }
           })
          console.log("here")
           newSocket.on("disconnect",()=>{
               setSocket(null)
               setTimeout(setUpSocket,3000)
               M.toast({html:"socket got disconnected",classes:"#43a047 green darken-1"})
           })
  
           newSocket.on("connect",()=>{
               console.log("hereA")
            M.toast({html:"socket connected",classes:"#43a047 green darken-1"})
            })
            setSocket(newSocket)
            
      }
    
   }
//     const scrollToBottom=()=>{
//    textInput.scrollIntoView({behavior: "smooth", block:"end"})
//     }
   const senderId=state._id;
    const ID=location.data 
   const name=location.name;
    useEffect(() => {
        //scrollToBottom()
      
      // setUpSocket() 
      // if(socket){
      //   socket.emit("register",{myid:state._id})  
      // }
        fetch(`/allmessage/${senderId}/${ID}`,{
            method:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{ setData(result.B)
     
          
         console.log(result.B)
           
        })
        if(socket){
        socket.on('private_chat',function(Indata){
         setData([...data,Indata])
         })
        }
        // return()=>{
        //   setSocket(null)
        // }
    }, [])
   
   
    Object.prototype.find = function() {
        try {
          return Array.prototype.slice.call(arguments).reduce(function(acc, key) {
            return acc[key]
          }, this)
        }
        catch(e) {
          return 
        }
      }

// const sendMsg=(ID)=>{
//   if(msg!==""){
//       socket.emit("private_chat",{
//                    from:state._id,
//                   to:ID,
//                   msg,
                  
//               })

//    data.push({
            
//                 created_at:Date.now(),
//                 message : msg,
//                 sendBy:{
//                     name:state.name,
//                     _id:state._id
//                   }}    )
//           setMsg("")                
//   }
 
// }


    const sendMsg=(ID)=>{
       if(msg !== ""){
        fetch("/sendmessage",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                senderId:state._id,
                receiverId:ID,
                msg,
                
            })
        })
        .then(res=>res.json())
        .then(result=>{
           data.push(result) 
          setMsg("")
        }).catch(err=>{
           console.log(err)
        })
    }

    }
    
   
    return (
        <>
        
         
            
                <div    style={{maxWidth:"800px",margin:"0 auto"}}>
                <div >
                <p style={{fontSize:"5rem",textAlign:"centre",color:"red"}}>{name}</p>
                </div>
                <div className="infinite-container" ref={textInput}>
                  {
                  data.map(G=>{
                      return(
                          
                          <h4><span style={{fontWeight:"300",color:"green"}}>{G.find("sendBy","name")}</span>{G.message}</h4>
                      )
                  })
               
                  }  
                </div>
                <div style={{display:"flex"}}>
                <input type="text" placeholder="lets chat"  value={msg} onChange={(e)=>setMsg(e.target.value)} >
                </input>
                <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>{sendMsg(ID)}}>Send
                </button>
                </div>
           </div>
             
             
        </>
       
    )
}

export default Message

//  this.element = React.createRef()
// scrollToBottom=()=>{
 //   this.element.scrollIntoView({behavior: "smooth", block:"end"})
//  }