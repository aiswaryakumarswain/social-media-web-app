import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from "react-router-dom";
import {UserContext} from "../App"
import M from "materialize-css"
const Navbar=()=>{
  const searchModal=useRef(null)
  const [search,setSearch]=useState("");
  const [userDetails,setUserDetails]=useState([])
  const  {state,dispatch}=useContext(UserContext);
  const history=useHistory();

   useEffect(()=>{
    M.Modal.init(searchModal.current)
   },[])
   const renderlist=()=>{
     if(state){
      return[
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/getsubpost">Explore</Link></li>,
        <li key="4"><Link to="/createpost">CreatePost</Link></li>,
        <li key="5"><Link to="/home">Home</Link></li>,
       
        <li  key="6">
           <button className="btn #c62828 red darken-3" type="submit" name="action" onClick={()=>{
             localStorage.clear();
             dispatch({type:"CLEAR"})
             history.push("/login")
           }}>Logout
  </button>
        </li>
      ]
     }else{
   return[
    <li key="7"><Link to="/login">Login</Link></li>,
    <li key="8"><Link to="/signup">Signup</Link></li>
   ]
     }
   }


   const fetchUsers=(query)=>{
     setSearch(query)
     fetch("/search-users",{
       method:"post",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify({
         query
       })
     }).then(res=>res.json())
     .then(result=>{
      setUserDetails(result.user)
     })
   }
   return( 
   <nav>
    <div className="nav-wrapper">
      <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
      
       {renderlist()}
       
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
    <div className="modal-content">
    <input type="text" placeholder="Search User"  value={search} onChange={(e)=>fetchUsers(e.target.value)}/>
    
    <ul className="collection">
      {userDetails.map(item=>{
        return  <Link to={item._id!==state._id? "/profile/"+item._id:"/profile"} onClick={()=>{
          M.Modal.getInstance(searchModal.current).close()
          setSearch("");
        }} ><li key={9}  className="collection-item">{item.name}</li></Link>
      })}
     
     
    </ul>
    </div>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("")}} >Close</button>
    </div>
  </div> 
  </nav>
   )     
}
export default Navbar;