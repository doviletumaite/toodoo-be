import express from "express"
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import postModel from "./schema.js"

const postRouter = express.Router()

postRouter.get("/", async (req, res, next) => {
    try {
        const mongoQuery = q2m(req.query)
        const{total, posts} = await postModel.findPostWithComments(mongoQuery)
        console.log(posts)
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