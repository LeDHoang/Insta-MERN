import React,{useEffect,createContext,useReducer,useContext} from 'react'
import NavBar from './components/navbar';
import "./App.css"
import { BrowserRouter, Route,Routes, useNavigate} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribesUserPosts'

export const UserContext = createContext()

//History of User
//if log in to home
//if not to log in
const Routing = () =>{
  const navigate = useNavigate()
  //save user info when not logged out
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      navigate('/login')
    }
  },[])
  return(
    <Routes>
        <Route exact path="/" element={<Home />}>
        </Route>
        <Route path="/login" element={<Login />}>
        </Route>
        <Route path="/signup" element={<Signup />}>
        </Route>
        <Route exact path="/profile" element={<Profile />}>
        </Route>
        <Route path="/create" element={<CreatePost />}>
        </Route>
        <Route path="/profile/:userid" element={<UserProfile />}>
        </Route>
        <Route path="/myfollowingspost" element={<SubscribedUserPosts />}>
        </Route>
        </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value ={{state, dispatch}}>
    <BrowserRouter>
        <NavBar />
        <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
