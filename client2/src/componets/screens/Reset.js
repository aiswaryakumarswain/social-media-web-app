import React,{useContext} from 'react'
import {Link,useHistory} from "react-router-dom"
import {useState} from 'react'
import M from "materialize-css";


const Reset=()=>{
   
    const history=useHistory();
         
          
           const [email,setEmail]=useState("");
       const PostData=()=>{
           if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
           {
            M.toast({html:"invalid email",classes:"#b71c1c red darken-4"})
            return;
           }

           fetch("http://localhost:3000/reset-password",{
               method:"post",
               headers:{"Content-Type":"application/json"},
               body:JSON.stringify({
                  
                  
                   email
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
       <input type="text" placeholder="email"  value={email} onChange={(e)=>setEmail(e.target.value)} >
        </input>
       
       <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>PostData()}>Reset password
  </button>
  
      </div>
        </div>

    )
}
export default Reset;