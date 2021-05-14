import React,{useContext} from 'react'
import {Link,useHistory} from "react-router-dom"
import {useState} from 'react'
import M from "materialize-css";
import {UserContext} from "../../App"

const Login=()=>{
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
         
           const [password,setPassword]=useState("");
           const [email,setEmail]=useState("");
       const PostData=()=>{
        //    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        //    {
        //     M.toast({html:"invalid email",classes:"#b71c1c red darken-4"})
        //     return;
        //    }

           fetch("/login",{
               method:"post",
               headers:{"Content-Type":"application/json"},
               body:JSON.stringify({
                  
                   password,
                   email
               })
               }).then(res=>res.json())
               .then(data=>{
                  
                 if(data.error){
                   
                 M.toast({html: data.error,classes:' #b71c1c red darken-4'})
                  }
                 else{
                   
                     localStorage.setItem("jwt",data.token)
                     localStorage.setItem("user",JSON.stringify(data.user));
                    
                     dispatch({type:"USER",payload:data.user})
                     M.toast({html:"sucessfully logged in",classes:"#43a047 green darken-1"})
                     history.push("/")
                     
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
        <input type="password" placeholder="password"  value={password} onChange={(e)=>setPassword(e.target.value)}>
        </input>
       <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>PostData()}>Login
  </button>
  <h5>
        <Link to="/signup">Dont have an account?</Link>
    </h5>
  <h6>
        <Link to="/reset">forgot password ?</Link>
    </h6>
      </div>
        </div>

    )
}
export default Login;