import React,{useContext} from 'react'
import {Link,useHistory,useParams} from "react-router-dom"
import {useState} from 'react'
import M from "materialize-css";


const Newpassword=()=>{
  
    const history=useHistory();
    const [password,setPassword]=useState("");
    const {token}=useParams()       
       const PostData=()=>{
       

           fetch("http://localhost:3000/new-password",{
               method:"post",
               headers:{"Content-Type":"application/json"},
               body:JSON.stringify({
                  
                   password,
                   token
                 
               })
               }).then(res=>res.json())
               .then(data=>{
                  
                 if(data.error){
                   
                 M.toast({html: data.error,classes:' #b71c1c red darken-4'})
                  }
                 else{
             M.toast({html:data.message,classes:"#43a047 green darken-1"})
                     history.push("/login")
                 }
           }).catch((err)=>{
console.log(err);
           })
       }
    return(
        <div className="mycard">
       <div className="card auth-card">
       <h2>Instagram</h2>
      
        <input type="password" placeholder="Enter a password"  value={password} onChange={(e)=>setPassword(e.target.value)}>
        </input>
       <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>PostData()}>Update password
  </button>
 
      </div>
        </div>

    )
}
export default Newpassword;