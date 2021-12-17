import express from "express"
import createHttpError from "http-errors";
import conversationModel from "./schema.js"

const conversationRouter = express.Router()

conversationRouter.post("/", async (req, res, next) => {
    try {
        const newConversation = new conversationModel({
            members: [req.body.senderId, req.body.receiverId]
        })
        const conversation = await newConversation.save()
        res.status(200).send(conversation)
    } catch (error) {
        next(error)
        res.status(500).send({ message: error.message });
    }
})
conversationRouter.get("/:userId", async (req, res, next) => {
    try {
       const conversation = await conversationModel.find({
           members: {
               $in: [req.params.userId]
           }
       })
       res.status(200).send(conversation)
    } catch (error) {
        next(error)
        res.status(500).send({ message: error.message });
    }
})
export default conversationRouter