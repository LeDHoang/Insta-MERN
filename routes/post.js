const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requrieLogin')
const Post = mongoose.model("Post")

//getting all posts
router.get('/allposts', requireLogin, (req, res) => {
  Post.find()
    //get id and name of person's post
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy","_id name pic")
    .then(posts => {
      res.json({ posts })
    })
    .catch(err => {
      console.log(err)
    })
})
//Posts of subscribed
router.get('/getsubpost', requireLogin, (req, res) => {
  //if postedBy in following 
  Post.find({postedBy:{$in:req.user.followings}})
    //get id and name of person's post
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .then(posts => {
      res.json({ posts })
    })
    .catch(err => {
      console.log(err)
    })
})
//Create post
router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, pic } = req.body
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user
  })
  post.save().then(result => {
    res.json({ post: result })
  })
    .catch(err => {
      console.log(err)
    })
})
//List all posts by one user
router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then(mypost => {
      res.json(mypost)
    })
    .catch(err => {
      console.log(err)
    })
})
//Like
router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id }
  }, {
    new: true
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json(error.err);
    } else {
      res.json(result);
    }
  });
});

//Unlike
router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: { likes: req.user._id }
  }, {
    new: true
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json(error.err);
    } else {
      res.json(result);
    }
  });
});
//Comment
router.put('/comment', requireLogin, (req, res) => {
  //Get comment body from front end
  const comment = {
    text: req.body.text,
    postedBy: req.user
  }
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { comments: comment }
  }, {
    new: true
  }).populate("comments.postedBy", "_id name")
  .populate("postedBy","_id name")

    .exec((err, result) => {
      if (err) {
        return res.status(422).json(error.err);
      } else {
        res.json(result);
      }
    });
});
//Delete post
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err, post)=>{
    if(err||!post){
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove()
      .then(result=>{
        res.json(result)
      }).catch(error=>{
        console.log(err)
      })
    }
  })
})
//Delete Comment
router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
  Post.findById(req.params.postId)
  //   .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,post)=>{
        if(err || !post){
          return res.status(422).json({message:"Some error occured!!"});
        }
        const comment = post.comments.find((comment)=>
          comment._id.toString() === req.params.commentId.toString()
          );
          if (comment.postedBy._id.toString() === req.user._id.toString()) {
              const removeIndex = post.comments
              .map(comment => comment.postedBy._id.toString())
              .indexOf(req.user._id);
              post.comments.splice(removeIndex, 1);
              post.save()
              .then(result=>{
                  res.json(result)
              }).catch(err=>console.log(err));
          }
    })
});

module.exports = router