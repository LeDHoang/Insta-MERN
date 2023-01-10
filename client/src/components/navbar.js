import React, { useContext } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
const NavBar = () => {
  const { state, dispatch } = useContext(UserContext)
  const navigate = useNavigate()
  //Changing nav bar depends on if user is loged in
  const renderList = () => {
    if (state) {
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create"><i class="material-icons">add_box</i></Link></li>,
        <li><Link to="/myfollowingspost" ><i class="material-icons">group</i></Link></li>,
        // <li><Link to="/myfollowingspost">Followings</Link></li>,
        <li>
          <button className="btn #c62828 red darken-3"
            onClick={() => {localStorage.clear()
            dispatch({type:"CLEAR"})
            navigate('/login')//to login screen after logged out
            }}>
            Log Out
          </button>
        </li>]
    } else {
      return [
        <li><Link to="/login" >Login</Link></li>,
        <li><Link to="/signup">Sign Up</Link></li>
      ]
    }
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  )
}
export default NavBar