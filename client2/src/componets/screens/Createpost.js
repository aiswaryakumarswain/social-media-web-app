import React,{useState,useEffect} from 'react'
import M from "materialize-css";
import {useHistory} from "react-router-dom"

const Createpost=()=>{
  const history=useHistory();
      const [title,setTitle]=useState("");
      const [body,setBody]=useState("");
      const [image,setImage]=useState("");
      const [url,setUrl]=useState("");
useEffect(()=>{
  if(url){
    fetch("http://localhost:3000/createpost",{
      method:"post",
      headers:{
        "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
         
         title,
         body,
         pic:url
      })
      }).then(res=>res.json())
      .then(data=>{
         
        if(data.error){
          
        M.toast({html: data.error,classes:' #b71c1c red darken-4'})
         }
        else{
            M.toast({html:"sucessfully post created",classes:"#43a047 green darken-1"})
            history.push("/")
        }
  }).catch((err)=>{
  console.log(err);
  })
  }
  
},[url])
  const postDetails=()=>{
  const data=new FormData();
  data.append("file",image);
  data.append("upload_preset","insta-clone");
  data.append("cloud_name","diwcwtrkc");
  fetch("	https://api.cloudinary.com/v1_1/diwcwtrkc/image/upload",{
    method:"post",
     body:data
  }).then(res=>res.json())
  .then(data=>{
    setUrl(data.url);
  })
  .catch(err=>console.log(err))

}
 

 return(
    <div className="card input-field" style={{
        margin:"30px auto",
        maxWidth:'500px',
        padding:"20px",
        textAlign:"center"
    }}>
         <input type="text" placeholder="title" value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
        <input type="text" placeholder="body" value={body} onChange={(e)=>{setBody(e.target.value)}} />
        <div className="file-field input-field">
      <div className="btn">
        <span>UPLOAD IMAGE</span>
        <input type="file"  
        onChange={(e)=>{setImage(e.target.files[0])
         
        }}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>
    <button className="btn waves-effect waves-darken-1" type="submit" name="action" onClick={()=>postDetails()} >Submit post
  </button>
    </div>
 )
}
export default Createpost;