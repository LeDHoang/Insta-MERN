import React,{useState,useContext} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Login = () => {
    const {state,dispatch} = useContext (UserContext)
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const PostData = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
        ) {
            M.toast({ html: "invalid email", classes: "#e65100 orange darken-4" })
            return

        }
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e65100 orange darken-4" })
                }
                else {
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    //dispatch user info to userReducer
                    dispatch({type:"USER",payload:data.user})
                    M.toast({ html: "Signed in successfully", classes: "#43a047 green darken-1" })
                    navigate('/')
                }
            }).catch(err=>{
                console.log(err)
            })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field" >
                <h2 className="brand-logo">Instagram</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}>
                    LogIn
                </button>
                <h5 className="opp_link">
                    Don't have an account?  <Link to="/Signup" id="opp_link_2">Sign up</Link>
                </h5>
            </div>
        </div>
    )
}
export default Login