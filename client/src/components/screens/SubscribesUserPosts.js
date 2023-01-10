import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App'
import M from 'materialize-css'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    //Retrieving posts 
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                if(result.posts.length==0){M.toast({html: 'You have not follow anybody',classes: "#e65100 orange darken-4" })}
                setData(result.posts)
            })
    }, [])
    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id,
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newdata = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newdata)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id,
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newdata = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newdata)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newdata = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newdata)
            }).catch(err => {
                console.log(err)
            })
    }
    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newdata = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newdata)
            })
    }
    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        result.postedBy = item.postedBy;
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData);
                M.toast({ html: "Comment Deleted Successfully", classes: "#43a047 green darken-1" })
            })
    }
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        //Retrieving data from posts
                        //Only post by user has delete func
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ fontWeight: "500" ,padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.name}</Link> {item.postedBy._id === state._id
                                && <i className="material-icons" style={{ float: "right" }}
                                    onClick={() => deletePost(item._id)} >delete</i>}</h5>
                            <div className="card-image">
                                <img src={item.photo} alt="Loading" />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                    ? <i className="material-icons icon-red" onClick={() => { unlikePost(item._id) }}>favorite</i>
                                    : <i className="material-icons icon-black" onClick={() => { likePost(item._id) }}>favorite</i>
                                }


                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <>
                                                <h6 className="m-0" key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> : <span className="text-secondary">{record.text}</span>{record.postedBy._id === state._id && <i id="comment_icon" className=" material-icons" style={{ float: "right" }} onClick={() => deleteComment(item._id, record._id)}>delete</i>}</h6>
                                            </>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}
export default Home