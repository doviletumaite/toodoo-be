import express from "express"
import createHttpError from "http-errors";
import messageModel from "./schema.js"

const messageRouter = express.Router()

messageRouter.post("/", async (req, res, next) => {
    try {
        const newMessage = new messageModel(req.body)
        const message = await newMessage.save()
        res.status(200).send(message)
    } catch (error) {
        next(error)
        res.status(500).send({ message: error.message });
    }
})
messageRouter.get("/:conversationId", async (req, res, next) => {
    try {
       const messages = await messageModel.find({conversationId:req.params.conversationId})
       res.status(200).send(messages)
    } catch (error) {
        next(error)
        res.status(500).send({ message: error.message });
    }
})

export default messageRouter