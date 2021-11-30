import express from "express"
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import { parseFile } from "../users/cloudinary.js";
import postModel from "./schema.js"

const postRouter = express.Router()

postRouter.get("/", async (req, res, next) => {
    try {
        const posts = await postModel.find({}).populate({
          path:"user",
          select:"username bio"
        })
        console.log(posts.comments)
        res.send(posts)
    } catch (error) {
        next(error)
    }
})

postRouter.post("/", async (req, res, next) => {
    try {
        const newPost = new postModel(req.body)
        const post = await newPost.save()
        res.status(201). send(post)
    } catch (error) {
        next(error)
        res.send(500).send({ message: error.message });
    }
})

postRouter.put("/:id/picture", parseFile.single("picture"),
    async (req, res, next) => {
      try {
        const postPicture = await postModel.findByIdAndUpdate( req.params.id, {
            picture: req.file.path,
        },
        {new: true})
        res.send(postPicture);
      } catch (error) {
        next(error);
      }
    }
  );

  postRouter.post("/:id/comment", async (req, res, next) => {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) {
        res
          .status(404)
          .send({ message: `post with ${req.params.id} is not found!` });
      } else {
       const comment = await postModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              comments: req.body,
            },
          },
          { new: true }
        );
        console.log(comment);
        res.status(204).send({comment});
      }
    } catch (error) {
      console.log(error);
      res.send(500).send({ message: error.message });
    }
  });

  postRouter.get("/:id/comment", async (req, res, next) => {
    try {
      const post = await postModel.findById(req.params.id)
      if (post){
        const comments = await post.populate({
          path:"comments.user",
          select:"username bio"
        })
        res.send(comments)
      }else{
        res.send(`post id ${req.params.id} not found!`)
      }
    } catch (error) {
      next(error);
    }
  });
  
  postRouter.delete("/:id/comment/:commentId", async (req, res, next) => {
    try {
      const post = await postModel.findByIdAndUpdate(req.params.id, 
        {$pull: {comments: {_id:req.params.commentId}}},
        {new: true})
      if (post){
       res.send(post)
      }else{
        res.send(`post id ${req.params.id} not found!`)
      }
    } catch (error) {
      next(error);
    }
  });
  postRouter.put("/:id/comment/:commentId", async (req, res, next) => {
    try {
      const post = await postModel.findById(req.params.id)
      if (post){
          const index = post.comments.findIndex(c=> c._id.toString()===req.params.commentId)
          if(index !== -1) {
              post.comments[index] = {...post.comments[index].toObject(), ...req.body}
              await post.save()
              res.send(post)
          } else {
            res.send(`comment id ${req.params.commentId} not found!`)
          } 
        } else {
        res.send(`post id ${req.params.id} not found!`)
      }
    } catch (error) {
      next(error);
    }
  });

postRouter.put("/:id", async (req, res, next) => {
    try {
      const post = await postModel.findById(req.params.id)
      const updatedPost = await postModel.findByIdAndUpdate(post, req.body, {
          new: true
      })
      if (updatedPost){
          res.send(updatedPost)
      } else {
          createHttpError(404, "post not found")
      }
    } catch (error) {
        next(error)
    }
})

postRouter.delete("/:id", async (req, res, next) => {
    try {
        const postId = req.params.id
        const deletedPost = await postModel.findByIdAndDelete(postId)
        if(deletedPost){
            res.status(204)
        } else {
            next(createHttpError(404, "post not found"))
        }
    } catch (error) {
        next(error)
    }
})

export default postRouter