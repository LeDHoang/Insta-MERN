export const initialState = null

export const reducer = (state, action) =>{
    //logged in
    if(action.type==="USER"){
        return action.payload
    }
    //logged out
    if(action.type==="CLEAR"){
        return null
    }
    if(action.type==="UPDATE"){
        return{
            ...state,
            followers:action.payload.followers,
            followings:action.payload.followings,
        }
    }
    if(action.type==="UPDATEPIC"){
        return{
            ...state,
            pic:action.payload
        }
    }
    return state
}