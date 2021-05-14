import React,{useEffect,createContext,useReducer,useContext,useState} from 'react'
import Navbar from "./componets/Navbar"
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from "react-router-dom";
import Home from "./componets/screens/Home";
import Login from "./componets/screens/Login";
import Profile from "./componets/screens/Profile";
import Signup from "./componets/screens/Signup";
import Createpost  from "./componets/screens/Createpost"
import {reducer,initialState} from "./reducer/userReducer"
import UserProfile from "./componets/screens/UserProfile"
import  SubscribedUserPosts from "./componets/screens/SubcribedUserPosts"
import Reset from "./componets/screens/Reset"
import Newpassword from "./componets/screens/Newpassword"
import Chat from "./componets/screens/Chat"

 export const UserContext=createContext();

const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  
  useEffect(()=>{
    
    const user=JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      history.push("/home") 
    }else{
      if(!history.location.pathname.startsWith("/reset"))
      history.push("/login")
    }
  },[])
 
  return(
    <Switch>
      <Route exact path="/">
      <SubscribedUserPosts/>
     </Route>
     <Route path="/home">
     <SubscribedUserPosts/>
     </Route>
     <Route path="/signup">
       <Signup/>
     </Route>
     <Route path="/login" >
       <Login/>
     </Route>
      
     <Route exact path="/profile">
       <Profile/>
     </Route>
     <Route path="/createpost">
       <Createpost/>
     </Route>
     <Route path="/profile/:userid">
       <UserProfile/>
     </Route>
     <Route path="/getsubpost">
      <Home/>
     </Route>
     <Route  exact path="/reset">
      <Reset/>
     </Route>
     <Route path="/reset/:token">
      <Newpassword/>
     </Route>
     <Route path="/chat" >
       <Chat/>
     </Route>
    </Switch>
  ) 
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}} >
    <BrowserRouter>
     <Navbar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
